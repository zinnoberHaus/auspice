import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import { grantAdmin } from '../scripts/grant-admin.mjs';

const nodeRequire = createRequire(import.meta.url);
const operator = '11111111-1111-4111-8111-111111111111';
const targetId = '22222222-2222-4222-8222-222222222222';
const origin = 'https://auspice.test';
type Stub = Record<string, any>;

// Execute the actual route modules with isolated SDK/DB boundaries. This avoids
// Next request-context dependencies and guarantees no live provider calls.
function load(file: string, bindings: Stub): Stub {
  const exports = {};
  const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(source, { exports, require: (name: string) => Object.hasOwn(bindings, name) ? bindings[name] : nodeRequire(name),
    Request, Response, URL, console: { info() {} }, Date });
  return exports;
}

function fixture(options: Stub = {}) {
  const calls: { method: string; args: any }[] = [];
  const target = { id: targetId, name: 'Test member', email: 'member@example.invalid', emailVerified: true, role: 'user', banned: false, createdAt: '2026-01-01T00:00:00Z', ...options.target };
  const auth = {
    getSession: async (args: any) => { calls.push({ method: 'getSession', args }); return { data: options.anonymous ? null : { user: { id: operator, role: 'admin' } }, error: options.sessionError || null }; },
    admin: Object.fromEntries(['listUsers', 'banUser', 'unbanUser', 'revokeUserSessions'].map(method => [method, async (args: any) => {
      calls.push({ method, args });
      if (options.failMethod === method) return { data: null, error: { status: 403, message: 'Provider denied' } };
      return { data: method === 'listUsers' ? { users: options.missingTarget ? [] : [target], total: 41 } : method === 'revokeUserSessions' ? { success: !options.revokeUnconfirmed } : { user: target }, error: null };
    }])),
  };
  const db = () => async (...args: any[]) => {
    calls.push({ method: 'db', args });
    return options.missingOperator ? [] : [{ id: operator, name: 'Operator', role: options.role ?? 'admin', banned: options.banned ?? false, emailVerified: options.verified ?? true }];
  };
  const helper = load('lib/admin.ts', { '@/lib/auth/server': { auth }, '@/lib/db': { db } });
  const bindings = { '@/lib/auth/server': { auth }, '@/lib/admin': helper, '@/lib/http': load('lib/http.ts', {}) };
  return { calls, helper, list: load('app/api/admin/users/route.ts', bindings), action: load('app/api/admin/users/[id]/route.ts', bindings) };
}

function actionRequest(body: unknown, options: { id?: string; requestOrigin?: string } = {}) {
  return [new Request(`${origin}/api/admin/users/${options.id || targetId}`, { method: 'POST', headers: { origin: options.requestOrigin || origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), { params: Promise.resolve({ id: options.id || targetId }) }] as const;
}

test('admin routes deny anonymous users without querying accounts', async () => {
  const f = fixture({ anonymous: true });
  const response = await f.list.GET(new Request(`${origin}/api/admin/users`));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(f.calls.map(call => call.method), ['getSession']);
});

test('admin gate bypasses cookie cache and rejects demoted, banned, unverified, missing and misleading roles', async () => {
  for (const options of [{ role: 'user' }, { banned: true }, { verified: false }, { missingOperator: true }, { role: 'superadmin' }]) {
    const f = fixture(options);
    const response = await f.list.GET(new Request(`${origin}/api/admin/users`));
    assert.equal(response.status, 403);
    assert.equal(f.calls[0].args.query.disableCookieCache, 'true');
    assert.equal(f.calls.filter(call => call.method === 'listUsers').length, 0);
  }
  const f = fixture({ role: 'user, admin' });
  assert.equal((await f.helper.requireAdmin()).user.id, operator);
});

test('directory bounds pagination/search and projects only permitted identity fields', async () => {
  const f = fixture({ target: { token: 'never-return', password: 'never-return', journal: ['private'], sessions: ['private'] } });
  const response = await f.list.GET(new Request(`${origin}/api/admin/users?page=2&search=member&field=name&sortBy=password`));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.pageSize, 20);
  assert.equal(payload.page, 2);
  assert.equal(payload.total, 41);
  assert.deepEqual(Object.keys(payload.users[0]).sort(), ['id', 'name', 'email', 'emailVerified', 'role', 'banned', 'banExpires', 'createdAt'].sort());
  const query = f.calls.find(call => call.method === 'listUsers')!.args.query;
  assert.equal(query.limit, 20); assert.equal(query.offset, 40); assert.equal(query.searchField, 'name'); assert.equal(query.searchOperator, 'contains'); assert.equal(query.sortBy, 'createdAt');
  for (const suffix of ['page=-1', 'page=1.5', 'page=10001', 'field=role', `search=${'a'.repeat(121)}`]) {
    const invalid = fixture();
    assert.equal((await invalid.list.GET(new Request(`${origin}/api/admin/users?${suffix}`))).status, 400);
    assert.equal(invalid.calls.filter(call => call.method === 'listUsers').length, 0);
  }
});

test('mutations reject cross-origin requests, self-targeting, missing confirmation and invalid input', async () => {
  const cross = fixture();
  assert.equal((await cross.action.POST(...actionRequest({ action: 'revoke', confirmed: true }, { requestOrigin: 'https://attacker.invalid' }))).status, 403);
  assert.equal(cross.calls.length, 0);
  for (const [body, options, status] of [
    [{ action: 'revoke', confirmed: true }, { id: operator }, 409],
    [{ action: 'revoke', confirmed: true }, { id: 'invalid' }, 404],
    [{ action: 'revoke', confirmed: false }, {}, 400],
    [{ action: 'ban', confirmed: true, reason: 'no', duration: 'week' }, {}, 400],
    [{ action: 'ban', confirmed: true, reason: 'Policy abuse', duration: 'forever' }, {}, 400],
    [{ action: 'revoke', confirmed: true, role: 'admin' }, {}, 400],
    [{ action: 'delete', confirmed: true }, {}, 400],
    [{ action: 'ban', confirmed: true, reason: 'x'.repeat(5000), duration: 'week' }, {}, 413],
  ] as const) {
    const f = fixture();
    assert.equal((await f.action.POST(...actionRequest(body, options))).status, status);
    assert.equal(f.calls.filter(call => ['banUser', 'unbanUser', 'revokeUserSessions'].includes(call.method)).length, 0);
  }
});

test('mutations deny unknown users and protect administrator accounts from suspension', async () => {
  const missing = fixture({ missingTarget: true });
  assert.equal((await missing.action.POST(...actionRequest({ action: 'revoke', confirmed: true }))).status, 404);
  const admin = fixture({ target: { role: 'user,admin' } });
  assert.equal((await admin.action.POST(...actionRequest({ action: 'ban', confirmed: true, reason: 'Policy review', duration: 'week' }))).status, 409);
  assert.equal(admin.calls.filter(call => call.method === 'banUser').length, 0);
});

test('authorized actions dispatch the documented SDK payloads without live mutations', async () => {
  for (const [body, method, expected] of [
    [{ action: 'ban', confirmed: true, reason: 'Documented abuse', duration: 'week' }, 'banUser', { userId: targetId, banReason: 'Documented abuse', banExpiresIn: 604800 }],
    [{ action: 'ban', confirmed: true, reason: 'Documented abuse', duration: 'indefinite' }, 'banUser', { userId: targetId, banReason: 'Documented abuse' }],
    [{ action: 'unban', confirmed: true }, 'unbanUser', { userId: targetId }],
    [{ action: 'revoke', confirmed: true }, 'revokeUserSessions', { userId: targetId }],
  ] as const) {
    const f = fixture();
    const response = await f.action.POST(...actionRequest(body));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.equal(JSON.stringify(f.calls.find(call => call.method === method)!.args), JSON.stringify(expected));
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  }
});

test('provider failures never report a successful mutation', async () => {
  const denied = fixture({ failMethod: 'banUser' });
  assert.equal((await denied.action.POST(...actionRequest({ action: 'ban', confirmed: true, reason: 'Policy review', duration: 'day' }))).status, 403);
  const unconfirmed = fixture({ revokeUnconfirmed: true });
  assert.equal((await unconfirmed.action.POST(...actionRequest({ action: 'revoke', confirmed: true }))).status, 502);
});

const grantArgs = ['--project-id', 'test-project', '--branch-id', 'br-test', '--user-id', targetId];
test('grant script dry-run and invalid confirmations never send a request', async () => {
  let calls = 0;
  const dependencies = { fetch: async () => { calls++; return Response.json({}); }, env: { NEON_API_KEY: 'test-secret' }, write: () => {} };
  await grantAdmin([...grantArgs, '--dry-run'], dependencies);
  await assert.rejects(grantAdmin(grantArgs, dependencies), /--confirm/);
  await assert.rejects(grantAdmin([...grantArgs, '--confirm', operator], dependencies), /--confirm/);
  await assert.rejects(grantAdmin([...grantArgs, '--confirm', targetId], { ...dependencies, env: {} }), /NEON_API_KEY/);
  assert.equal(calls, 0);
});

test('grant script sends exactly one scoped role request and keeps credentials out of output', async () => {
  let calls = 0; const output: string[] = [];
  await grantAdmin([...grantArgs, '--confirm', targetId], {
    env: { NEON_API_KEY: 'test-secret' }, write: (line: string) => output.push(line),
    fetch: async (url, options) => {
      calls++;
      assert.equal(url, `https://console.neon.tech/api/v2/projects/test-project/branches/br-test/auth/users/${targetId}/role`);
      assert.equal(options?.method, 'PUT'); assert.equal(options?.body, '{"roles":["admin"]}'); assert.equal(options?.redirect, 'error');
      return Response.json({});
    },
  });
  assert.equal(calls, 1);
  assert.ok(output[0].includes(targetId));
  assert.ok(output.every(line => !line.includes('test-secret')));
  let failedCalls = 0;
  await assert.rejects(grantAdmin([...grantArgs, '--confirm', targetId], {
    env: { NEON_API_KEY: 'test-secret' }, write: () => {}, fetch: async () => { failedCalls++; throw Error('ambiguous response'); },
  }), /Check the user role/);
  assert.equal(failedCalls, 1);
});
