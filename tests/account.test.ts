import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const nodeRequire = createRequire(import.meta.url);
const ownerId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const ownerEmail = 'owner@example.invalid';
const origin = 'https://auspice.test';
type Stub = Record<string, any>;

// Execute the real route and HTTP helpers, replacing only the auth/database
// boundaries. Unexpected imports fail rather than reaching a live provider.
function load(file: string, bindings: Stub): Stub {
  const exports = {};
  const source = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(source, {
    exports,
    require: (name: string) => {
      if (Object.hasOwn(bindings, name)) return bindings[name];
      if (name === 'zod') return nodeRequire(name);
      throw new Error(`Unexpected account route dependency: ${name}`);
    },
    Request, Response, URL,
  });
  return exports;
}

function fixture(options: { anonymous?: boolean; badPassword?: boolean; wrongIdentity?: boolean } = {}) {
  const calls: { method: string; args?: any }[] = [];
  const auth = {
    getSession: async (args: any) => {
      calls.push({ method: 'getSession', args });
      return { data: options.anonymous ? null : { user: { id: ownerId, email: ownerEmail } }, error: null };
    },
    signIn: {
      email: async (args: any) => {
        calls.push({ method: 'signIn.email', args });
        return options.badPassword
          ? { data: null, error: { status: 401, message: 'Invalid password' } }
          : { data: { user: { id: options.wrongIdentity ? otherId : ownerId } }, error: null };
      },
    },
    signOut: async () => {
      calls.push({ method: 'signOut' });
      return { data: { success: true }, error: null };
    },
  };
  const db = () => {
    calls.push({ method: 'db' });
    return async (strings: TemplateStringsArray, ...values: unknown[]) => {
      calls.push({ method: 'delete', args: { query: strings.join('?'), values } });
      return [];
    };
  };
  return {
    calls,
    route: load('app/api/account/route.ts', {
      '@/lib/auth/server': { auth },
      '@/lib/db': { db },
      '@/lib/http': load('lib/http.ts', {}),
    }),
  };
}

function deletionRequest(body: unknown = { password: 'current-password', confirmation: 'DELETE' }, requestOrigin: string | null = origin) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (requestOrigin !== null) headers.set('Origin', requestOrigin);
  return new Request(`${origin}/api/account`, { method: 'DELETE', headers, body: JSON.stringify(body) });
}

function assertFreshSession(calls: ReturnType<typeof fixture>['calls']) {
  assert.equal(calls[0].method, 'getSession');
  assert.equal(calls[0].args.query.disableCookieCache, 'true');
}

test('account deletion rejects cross-origin and missing-origin requests before authentication', async () => {
  for (const requestOrigin of ['https://attacker.invalid', null]) {
    const f = fixture();
    const response = await f.route.DELETE(deletionRequest(undefined, requestOrigin));
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.deepEqual(f.calls, []);
  }
});

test('account deletion bypasses session cookie cache and rejects a missing or revoked session', async () => {
  const f = fixture({ anonymous: true });
  const response = await f.route.DELETE(deletionRequest());
  assert.equal(response.status, 401);
  assertFreshSession(f.calls);
  assert.deepEqual(f.calls.map(call => call.method), ['getSession']);
});

test('account deletion requires the exact confirmation before reauthentication or database access', async () => {
  for (const body of [{ password: 'current-password' }, { password: 'current-password', confirmation: 'delete' }]) {
    const f = fixture();
    const response = await f.route.DELETE(deletionRequest(body));
    assert.equal(response.status, 400);
    assertFreshSession(f.calls);
    assert.deepEqual(f.calls.map(call => call.method), ['getSession']);
  }
});

test('account deletion rejects a wrong password without deleting data or signing out', async () => {
  const f = fixture({ badPassword: true });
  const response = await f.route.DELETE(deletionRequest());
  assert.equal(response.status, 400);
  assertFreshSession(f.calls);
  assert.deepEqual(f.calls.map(call => call.method), ['getSession', 'signIn.email']);
  assert.equal(f.calls[1].args.email, ownerEmail);
  assert.equal(f.calls[1].args.password, 'current-password');
});

test('account deletion rejects reauthentication returning a different user identity', async () => {
  const f = fixture({ wrongIdentity: true });
  const response = await f.route.DELETE(deletionRequest());
  assert.equal(response.status, 400);
  assertFreshSession(f.calls);
  assert.deepEqual(f.calls.map(call => call.method), ['getSession', 'signIn.email']);
});

test('successful account deletion ignores injected identity fields and parameterizes only the authenticated owner', async () => {
  const f = fixture();
  const response = await f.route.DELETE(deletionRequest({
    password: 'current-password', confirmation: 'DELETE', userId: otherId, email: 'attacker@example.invalid',
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { deleted: true });
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assertFreshSession(f.calls);
  assert.deepEqual(f.calls.map(call => call.method), ['getSession', 'signIn.email', 'db', 'delete', 'signOut']);
  assert.equal(f.calls[1].args.email, ownerEmail);
  assert.equal(f.calls[1].args.password, 'current-password');
  const deletion = f.calls.find(call => call.method === 'delete')!.args;
  assert.equal(deletion.query, 'DELETE FROM neon_auth."user" WHERE id=?::uuid');
  assert.deepEqual(deletion.values, [ownerId]);
});
