import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDays, report, summarize } from '../scripts/guide-metrics-report.mjs';

test('report rejects unbounded or malformed windows before connecting', async () => {
  assert.equal(parseDays([]), 30);
  assert.equal(parseDays(['--days', '90']), 90);
  for (const args of [['--days', '0'], ['--days', '91'], ['--days', '1.5'], ['--days', '30', '--all'], ['--user', 'someone'], ['--days', '2;DELETE']]) {
    let connected = false;
    await assert.rejects(report(args, { env: {}, connect: (() => { connected = true; }) as any }));
    assert.equal(connected, false);
  }
});

test('report handles clicks without views and does not invent unique or conversion metrics', () => {
  const result = summarize([
    { day: '2026-10-10', guide: 'example', event: 'open_sanctuary', count: 3 },
    { day: '2026-10-09', guide: 'example', event: 'view', count: 2 },
    { day: '2026-10-09', guide: 'example', event: 'open_sanctuary', count: 4 },
  ], 2);
  assert.deepEqual(result.totals, { viewEvents: 2, openSanctuaryEvents: 7 });
  assert.equal(result.daily[0].clickEventsPerView, 2);
  assert.equal(result.daily[1].clickEventsPerView, null);
  assert.deepEqual(summarize([], 30).daily, []);
});

test('operator report performs only an aggregate SELECT with a parameterized UTC window', async () => {
  let statement = ''; let parameters: unknown[] = []; const output: string[] = [];
  await report(['--days', '7'], {
    env: { DATABASE_URL: 'not-a-real-credential' },
    connect: (() => async (strings: TemplateStringsArray, ...values: unknown[]) => {
      statement = strings.join('?'); parameters = values;
      return [{ day: '2026-10-10', guide: 'example', event: 'view', count: 2 }];
    }) as any,
    write: (value: string) => output.push(value),
  });
  assert.match(statement, /SELECT day::text AS day, guide, event, count/);
  assert.match(statement, /FROM auspice_guide_metrics/);
  assert.match(statement, /AT TIME ZONE 'UTC'/);
  assert.doesNotMatch(statement, /INSERT|UPDATE|DELETE|neon_auth|auspice_readings/);
  assert.deepEqual(parameters, [7]);
  assert.equal(JSON.parse(output[0]).totals.viewEvents, 2);
  assert.ok(!output[0].includes('not-a-real-credential'));
});
