import { config } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
config({ path: '.env.local', quiet: true });
const connection = new URL(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
const sql = neon(connection.toString());
await sql`CREATE TABLE IF NOT EXISTS auspice_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`;
const applied = await sql`SELECT name,checksum FROM auspice_migrations`;
for (const name of (await readdir('migrations')).filter(name => /^\d+_[a-z_]+\.sql$/.test(name)).sort()) {
const migration = await readFile(`migrations/${name}`, 'utf8');
const checksum = createHash('sha256').update(migration).digest('hex');
const previous = applied.find(row => row.name === name);
if (previous) { if (previous.checksum !== checksum) throw new Error(`Applied migration changed: ${name}`); continue; }
const result = spawnSync('psql', ['--set', 'ON_ERROR_STOP=1'], {
  env: { ...process.env, PGHOST: connection.hostname, PGPORT: connection.port || '5432', PGUSER: decodeURIComponent(connection.username), PGPASSWORD: decodeURIComponent(connection.password), PGDATABASE: connection.pathname.slice(1), PGSSLMODE: 'verify-full', PGSSLROOTCERT: process.env.PGSSLROOTCERT || '/etc/ssl/cert.pem' },
  encoding: 'utf8',
  input: `BEGIN;\n${migration}\nINSERT INTO auspice_migrations(name,checksum) VALUES ('${name}','${checksum}');\nCOMMIT;\n`,
});
if (result.status !== 0) { console.error(result.stderr || 'psql failed'); process.exit(1); }
console.log(`Applied ${name}.`);
}
