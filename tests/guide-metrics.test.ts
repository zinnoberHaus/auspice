import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import * as metricRules from '../lib/guide-metrics';
import { sendGuideMetric } from '../lib/guide-metrics-client';
import { guides } from '../lib/guides';
import * as http from '../lib/http';

const origin = 'https://auspice.test';
const metric = { guide: guides[0].slug, event: 'view' as const };
type Exports = Record<string, any>;

function load(file: string, bindings: Exports, environment: Record<string, string | undefined> = {}): Exports {
  const exports = {};
  const source = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  runInNewContext(source, {
    exports,
    require(name: string) {
      if (Object.hasOwn(bindings, name)) return bindings[name];
      throw new Error(`Unexpected guide measurement dependency: ${name}`);
    },
    process: { env: environment },
    Request, Response, URL, TextDecoder,
  });
  return exports;
}

function fixture(environment: Record<string, string | undefined> = { VERCEL_ENV: 'production' }, fail = false) {
  const calls: { query: string; values: unknown[] }[] = [];
  let connections = 0;
  const server = load('lib/guide-metrics-server.ts', {
    './guide-metrics': metricRules,
    './guides': { guides },
    './http': http,
    './db': { db() {
      connections++;
      return async (strings: TemplateStringsArray, ...values: unknown[]) => {
        calls.push({ query: strings.join('?'), values: Array.from(values) });
        if (fail) throw new Error('Database unavailable; must never leak this message');
        return [];
      };
    } },
  }, environment);
  const route = load('app/api/guide-metrics/route.ts', { '@/lib/guide-metrics-server': server });
  return { route, calls, get connections() { return connections; } };
}

function request(body: unknown = metric, options: {
  origin?: string | null;
  headers?: Record<string, string>;
  raw?: string;
  query?: string;
} = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json', ...options.headers });
  if (options.origin !== null) headers.set('Origin', options.origin ?? origin);
  return new Request(`${origin}/api/guide-metrics${options.query || ''}`, {
    method: 'POST', headers, body: options.raw ?? JSON.stringify(body),
  });
}

test('guide measurement defaults to production, supports explicit opt-in, and always honors explicit disable', () => {
  assert.equal(metricRules.guideMetricsEnabled({}), false);
  assert.equal(metricRules.guideMetricsEnabled({ VERCEL_ENV: 'preview' }), false);
  assert.equal(metricRules.guideMetricsEnabled({ VERCEL_ENV: 'development' }), false);
  assert.equal(metricRules.guideMetricsEnabled({ VERCEL_ENV: 'production' }), true);
  assert.equal(metricRules.guideMetricsEnabled({ AUSPICE_GUIDE_METRICS: '1' }), true);
  assert.equal(metricRules.guideMetricsEnabled({ VERCEL_ENV: 'production', AUSPICE_GUIDE_METRICS: '0' }), false);
});

test('actual route accepts both events for published guides and uses only atomic parameterized counters', async () => {
  const f = fixture();
  for (const event of metricRules.guideMetricEvents) {
    const response = await f.route.POST(request({ ...metric, event }, { headers: {
      Cookie: 'private-session=must-not-be-read',
      Referer: 'https://auspice.test/guides/example?private=must-not-be-read',
      'X-Forwarded-For': '192.0.2.1',
    } }));
    assert.equal(response.status, 204);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(f.connections, 2);
  assert.equal(f.calls.length, 2);
  for (const [index, call] of f.calls.entries()) {
    assert.deepEqual(call.values, [metric.guide, metricRules.guideMetricEvents[index], 1_000_000, 1_000_000]);
    assert.match(call.query, /now\(\) AT TIME ZONE 'UTC'/);
    assert.match(call.query, /ON CONFLICT \(day, guide, event\) DO UPDATE/);
    assert.match(call.query, /SET count = LEAST\(auspice_guide_metrics.count \+ 1, \?\)/);
    assert.match(call.query, /WHERE auspice_guide_metrics.count < \?/);
    assert.doesNotMatch(call.query, /user_id|session|referer|request_id|ip_address/i);
  }
});

test('disabled environments and server DNT/GPC signals skip body consumption and all database access', async () => {
  for (const environment of [{}, { VERCEL_ENV: 'preview' }, { VERCEL_ENV: 'production', AUSPICE_GUIDE_METRICS: '0' }]) {
    const f = fixture(environment);
    const input = request(undefined, { raw: 'invalid body need not be read' });
    assert.equal((await f.route.POST(input)).status, 204);
    assert.equal(input.bodyUsed, false);
    assert.equal(f.connections, 0);
  }
  const privacyHeaders: Record<string, string>[] = [{ DNT: '1' }, { DNT: 'yes' }, { 'Sec-GPC': '1' }];
  for (const headers of privacyHeaders) {
    const f = fixture();
    const input = request(undefined, { raw: 'invalid body need not be read', headers });
    assert.equal((await f.route.POST(input)).status, 204);
    assert.equal(input.bodyUsed, false);
    assert.equal(f.connections, 0);
  }
});

test('cross-origin, missing-origin and query-string collection requests are rejected before writes', async () => {
  const f = fixture();
  for (const input of [request(undefined, { origin: null }), request(undefined, { origin: 'https://other.invalid' })]) {
    assert.equal((await f.route.POST(input)).status, 403);
  }
  assert.equal((await f.route.POST(request(undefined, { query: '?question=private' }))).status, 400);
  assert.equal(f.connections, 0);
});

test('malformed JSON, unknown keys, arbitrary guide paths and unsupported events never reach the database', async () => {
  const f = fixture();
  const invalidBodies = [null, [], {}, { ...metric, userId: 'injected' }, { ...metric, url: '/account' },
    { ...metric, guide: '/account' }, { ...metric, guide: 'not-a-published-guide' },
    { ...metric, guide: `${metric.guide}?email=private` }, { ...metric, event: 'reading_completed' },
    { guide: metric.guide }, { ...metric, count: 5000 }, { ...metric, day: '2026-10-10' }];
  for (const body of invalidBodies) assert.equal((await f.route.POST(request(body))).status, 400);
  assert.equal((await f.route.POST(request(undefined, { raw: '{bad json' }))).status, 400);
  assert.equal((await f.route.POST(request(undefined, { raw: '' }))).status, 400);
  assert.equal(f.connections, 0);
});

test('content type and byte limits are enforced with and without a declared body size', async () => {
  const f = fixture();
  assert.equal((await f.route.POST(request(undefined, { headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await f.route.POST(request(undefined, { headers: { 'Content-Length': '513' } }))).status, 413);
  assert.equal((await f.route.POST(request(undefined, { raw: ' '.repeat(513) }))).status, 413);
  assert.equal((await f.route.POST(request(undefined, { raw: 'é'.repeat(300) }))).status, 413);
  assert.equal(f.connections, 0);
});

test('streaming collector cancels an oversized undeclared body before draining remaining chunks', async () => {
  const f = fixture();
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(300).fill(32));
      controller.enqueue(new Uint8Array(300).fill(32));
    },
    cancel() { cancelled = true; },
  });
  const input = new Request(`${origin}/api/guide-metrics`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: stream, duplex: 'half',
  } as RequestInit);
  assert.equal((await f.route.POST(input)).status, 413);
  assert.equal(cancelled, true);
  assert.equal(f.connections, 0);
});

test('collector returns a generic failure without disclosing database errors', async () => {
  const f = fixture({ AUSPICE_GUIDE_METRICS: '1' }, true);
  const response = await f.route.POST(request());
  assert.equal(response.status, 503);
  assert.equal(await response.text(), '');
  assert.equal(f.connections, 1);
});

test('client requests omit cookies/referrers, contain only fixed fields, and never wait for delivery', async () => {
  const calls: { url: unknown; options?: RequestInit }[] = [];
  const send: typeof fetch = async (url, options) => {
    calls.push({ url, options });
    throw new Error('Network unavailable');
  };
  assert.equal(sendGuideMetric({ ...metric, question: 'must not be sent' } as typeof metric, {}, send), undefined);
  await Promise.resolve();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/guide-metrics');
  assert.deepEqual(JSON.parse(calls[0].options!.body as string), metric);
  assert.equal(calls[0].options!.credentials, 'omit');
  assert.equal(calls[0].options!.referrerPolicy, 'no-referrer');
  assert.equal(calls[0].options!.mode, 'cors');
  assert.equal(calls[0].options!.redirect, 'error');
  assert.equal(calls[0].options!.keepalive, true);
  assert.doesNotThrow(() => sendGuideMetric(metric, {}, (() => { throw new Error('Blocked'); }) as typeof fetch));
});

test('client DNT/GPC signals suppress requests entirely', () => {
  let calls = 0;
  const send: typeof fetch = async () => { calls++; return new Response(null, { status: 204 }); };
  for (const privacy of [{ doNotTrack: '1' }, { doNotTrack: 'yes' }, { globalPrivacyControl: true }]) {
    sendGuideMetric(metric, privacy, send);
  }
  assert.equal(calls, 0);
});

test('guide component deduplicates repeated mount effects and keeps its ordinary CTA functional', () => {
  const recorded: unknown[] = [];
  const effects: (() => void)[] = [];
  const ref = { current: null as string | null };
  const jsx = (type: unknown, props: unknown) => ({ type, props });
  const component = load('components/GuideMetrics.tsx', {
    react: { useRef: () => ref, useEffect: (effect: () => void) => effects.push(effect) },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/link': { default: 'link' },
    '@/lib/guide-metrics-client': { sendGuideMetric: (value: unknown) => recorded.push(JSON.parse(JSON.stringify(value))) },
  }).default;
  const href = '/sanctuary?tool=tarot';
  const link = component({ guide: metric.guide, href, enabled: true });
  effects[0]();
  effects[0](); // React StrictMode replays mount effects with the same ref.
  assert.deepEqual(recorded, [metric]);
  assert.equal(link.props.href, href);
  assert.equal(link.props.onClick(), undefined);
  assert.deepEqual(recorded[1], { ...metric, event: 'open_sanctuary' });
  component({ guide: guides[1].slug, href, enabled: true });
  effects[1]();
  assert.deepEqual(recorded[2], { guide: guides[1].slug, event: 'view' });
  const disabledLink = component({ guide: guides[2].slug, href, enabled: false });
  effects[2]();
  disabledLink.props.onClick();
  assert.equal(recorded.length, 3);
  assert.equal(disabledLink.props.href, href);
});
