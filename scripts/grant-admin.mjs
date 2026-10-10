import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';

const help = `Grant the admin role to one explicitly identified Auspice account.

Usage:
  node scripts/grant-admin.mjs --project-id PROJECT --branch-id BRANCH --user-id UUID --dry-run
  node scripts/grant-admin.mjs --project-id PROJECT --branch-id BRANCH --user-id UUID --confirm UUID

The confirmation must exactly repeat the user ID. A real request requires
NEON_API_KEY in the environment. No .env files or stored CLI credentials are read.
The operation assigns the role list ["admin"], replacing existing role assignments.
Verify the target in Neon Console before executing; sign in again to verify /admin.
`;

/**
 * @param {string[]} argv
 * @param {{ fetch?: typeof globalThis.fetch, env?: Record<string, string | undefined>, write?: (message: string) => void }} [options]
 */
export async function grantAdmin(argv, { fetch: request = globalThis.fetch, env = process.env, write = console.log } = {}) {
  const { values } = parseArgs({ args: argv, strict: true, allowPositionals: false, options: {
    'project-id': { type: 'string' }, 'branch-id': { type: 'string' }, 'user-id': { type: 'string' },
    confirm: { type: 'string' }, 'dry-run': { type: 'boolean' }, help: { type: 'boolean' },
  } });
  if (values.help) { write(help); return; }
  const project = values['project-id']; const branch = values['branch-id']; const user = values['user-id'];
  if (!project || !/^[a-z0-9-]{1,60}$/.test(project)) throw new Error('Supply a valid, explicit --project-id.');
  if (!branch || !/^[a-z0-9-]{1,60}$/.test(branch)) throw new Error('Supply a valid, explicit --branch-id.');
  if (!user || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user)) throw new Error('Supply the verified account UUID using --user-id.');
  const scope = `user ${user}, project ${project}, branch ${branch}`;
  if (values['dry-run']) { write(`Dry run: assign roles ["admin"] to ${scope}. No request sent.`); return; }
  if (values.confirm !== user) throw new Error('No request sent. --confirm must exactly repeat --user-id.');
  if (!env.NEON_API_KEY) throw new Error('No request sent. Provide an authorized Neon management NEON_API_KEY in the environment.');
  let response;
  try {
    response = await request(`https://console.neon.tech/api/v2/projects/${project}/branches/${branch}/auth/users/${user}/role`, {
      method: 'PUT', headers: { Authorization: `Bearer ${env.NEON_API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ roles: ['admin'] }), redirect: 'error', signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error('The role update response was not received. Check the user role in Neon Console before attempting another request.');
  }
  if (!response.ok) throw new Error(`Neon returned HTTP ${response.status}. Check the target, API-key permissions, and current role before retrying.`);
  write(`Role update accepted for ${scope}. Sign in again and verify /admin access.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  grantAdmin(process.argv.slice(2)).catch(error => { console.error(error instanceof Error ? error.message : 'Admin grant failed.'); process.exitCode = 1; });
}
