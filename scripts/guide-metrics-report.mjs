import { pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

export function parseDays(args) {
  if (args.length === 0) return 30;
  if (args.length !== 2 || args[0] !== '--days' || !/^[1-9]\d?$/.test(args[1]) || Number(args[1]) > 90) {
    throw new Error('Usage: npm run metrics:guides -- [--days 1..90]');
  }
  return Number(args[1]);
}

export function summarize(rows, days) {
  const daily = new Map();
  for (const row of rows) {
    const key = `${row.day}/${row.guide}`;
    const entry = daily.get(key) || { day: row.day, guide: row.guide, viewEvents: 0, openSanctuaryEvents: 0 };
    if (row.event === 'view') entry.viewEvents += Number(row.count);
    if (row.event === 'open_sanctuary') entry.openSanctuaryEvents += Number(row.count);
    daily.set(key, entry);
  }
  const guides = [...daily.values()].sort((a, b) => a.day.localeCompare(b.day) || a.guide.localeCompare(b.guide));
  return {
    utcCalendarDays: days,
    includesToday: true,
    interpretation: 'Event counts, not unique people or attributed conversions. Repeats, bots, blocked requests and collection failures affect counts. A click/view ratio may exceed 1.',
    totals: guides.reduce((total, row) => ({ viewEvents: total.viewEvents + row.viewEvents, openSanctuaryEvents: total.openSanctuaryEvents + row.openSanctuaryEvents }), { viewEvents: 0, openSanctuaryEvents: 0 }),
    daily: guides.map(row => ({ ...row, clickEventsPerView: row.viewEvents ? Number((row.openSanctuaryEvents / row.viewEvents).toFixed(4)) : null })),
  };
}

export async function report(args, { env = /** @type {Record<string, string | undefined>} */ (process.env), connect = neon, write = console.log } = {}) {
  const days = parseDays(args);
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required for the read-only guide report.');
  const sql = connect(env.DATABASE_URL);
  const rows = await sql`
    SELECT day::text AS day, guide, event, count
    FROM auspice_guide_metrics
    WHERE day BETWEEN (now() AT TIME ZONE 'UTC')::date - (${days}::int - 1)
                  AND (now() AT TIME ZONE 'UTC')::date
    ORDER BY day, guide, event
  `;
  write(JSON.stringify(summarize(rows, days), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  config({ path: '.env.local', quiet: true });
  report(process.argv.slice(2)).catch(() => {
    // Provider errors may include SQL or connection details; keep CLI output safe.
    console.error('Guide report failed. Check --days (1..90), DATABASE_URL and migration 004. No changes were made.');
    process.exitCode = 1;
  });
}
