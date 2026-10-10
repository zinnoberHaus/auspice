# Public guide measurement

The initial acquisition baseline counts two events: opening a published practice guide (`view`) and using its **Open the almanac** link (`open_sanctuary`). Collection is limited to the individual public guide pages. It does not track the guide index, other public pages, private sanctuary, journal, account or administration pages.

## Data and interpretation

`auspice_guide_metrics` contains only a UTC calendar day, an allowlisted guide slug, one of the two event names, and an integer count. Its primary key is `(day, guide, event)`. There are no individual event records, visitor identifiers, account joins, arbitrary URLs, query strings, referrers, birth data, questions or journal content. Anonymous totals may persist for editorial analysis; there is no automatic expiration promise.

These are **event counts**, not unique people, attributed conversions or retention. Repeat visits and clicks, bots, blocked requests and failed collection affect counts. Clicks can arrive without a counted view, and a click/view ratio can exceed one. Counts saturate at 1,000,000 per guide/action/day. Same-origin validation and a bounded schema reduce accidental or cross-site collection; they are not authentication or bot protection. Network requests still use ordinary Vercel and Neon infrastructure and their operational logging policies. This feature does not enable Vercel Web Analytics or add an analytics subscription; function and database usage remain subject to the existing service plans.

## Read-only report

Use the authorized database environment for the intended deployment. The script loads `.env.local`, with already-set environment variables taking precedence. The current `.env.local` points to the separate development database, so the commands below report development totals unless an explicit environment override is supplied. They are not implicitly production reports. Never paste connection strings into reports or commits.

```sh
npm run metrics:guides
npm run metrics:guides -- --days 7
```

For an authorized production report, use a private production environment file without replacing development `.env.local`. Replace the example path with the intended file and confirm the resource identity before running. This imports the report directly, avoiding the CLI's `.env.local` fallback, and rejects a missing database URL:

```sh
env -u DATABASE_URL node --env-file=/absolute/private/auspice-production.env --input-type=module <<'JS'
if (!process.env.DATABASE_URL) throw new Error('Selected environment file must provide DATABASE_URL.');
const { report } = await import('./scripts/guide-metrics-report.mjs');
await report(['--days', '7']).catch(() => {
  console.error('Guide report failed; check the selected environment and migration 004.');
  process.exitCode = 1;
});
JS
```

The report uses only `DATABASE_URL`, unlike the migration runner, which prefers `DATABASE_URL_UNPOOLED`. See [explicit environment selection](deployment.md#explicit-database-selection). Keep configuration backups private and outside source control and deployment uploads.

The default window is 30 UTC calendar days including today; accepted windows are 1–90 days. Output is JSON with total view/click events and a daily breakdown by guide. Empty results mean no stored events in that window, not proof of zero human traffic. The script makes one parameterized `SELECT` and does not read account, reading or interest tables. It is an operator CLI, not a publicly exposed reporting endpoint.

Use guide event counts to identify useful topics and links to investigate. Search Console impressions/clicks, guide-to-reading attribution, seven/thirty-day retention and membership conversion remain separate unimplemented or unverified measurements. A completed reading is automatically saved, so those are one stage, not two.

## Controls and deployment

Collection defaults to enabled only when `VERCEL_ENV=production`. `AUSPICE_GUIDE_METRICS=0` disables it in any environment; `AUSPICE_GUIDE_METRICS=1` explicitly enables local testing. Preview and development are otherwise disabled and now have separate database/Auth resources from production. Preview branches share one preview database, rather than a separate database per PR. Explicit test collection belongs in the intended non-production environment; do not populate the production baseline with synthetic traffic.

Migration `004_guide_metrics.sql` is applied in all three environments. It adds an independent table and does not alter identity or reading data. Apply it explicitly before deploying the collector to any future environment, using the normal checksum-tracked migration rules. Resource bindings and [verified retirement of historical previews](deployment.md#environment-changes-and-historical-previews) are separate: old deployments retain their original environment snapshots until retired, even after the current project bindings change.

The client sends a fixed JSON payload with `credentials: 'omit'`, `referrerPolicy: 'no-referrer'` and `keepalive: true`, without waiting for a response before navigation. It honors `navigator.doNotTrack` and `navigator.globalPrivacyControl`; the server also ignores requests carrying `DNT: 1` or `Sec-GPC: 1`. The endpoint requires a matching request origin, a JSON body of at most 512 bytes, and the exact event schema. No cookie/session lookup is performed. Invalid requests do not increment a counter. Collection failure leaves guide content and its ordinary link usable.

To disable collection, set the explicit `0` flag on the intended Vercel environment and redeploy. Rolling back to the preceding application revision stops collection without removing aggregate data. The additive table can remain through rollback; do not drop unrelated application tables. An authorized operator may separately erase aggregate data if required, after confirming the intended environment. No destructive cleanup is automatic.

The transport uses the fixed relative collector URL with `mode: 'cors'` and `redirect: 'error'`. Under the [Fetch standard](https://fetch.spec.whatwg.org/#append-a-request-origin-header), a POST in `same-origin` mode with `no-referrer` would send a null Origin; `cors` mode preserves the origin required by the server while still omitting the referrer. Redirects are rejected rather than forwarding events elsewhere.

## Verification limits

Automated checks exercise the actual request handler and client transport boundary with isolated dependencies, including origin/schema/body limits, privacy signals, disabled environments and collection failure. The migration and actual increment SQL passed a PostgreSQL audit in a newly created isolated schema within a single rollback transaction: UTC bucketing, counter saturation, schema constraints, public-access revocation and report query. No fixture counters were retained. The installed local PostgreSQL server could not start because an ICU library was missing, so this audit used the existing Neon connection with a separate temporary schema and no access to application records. Production checks must distinguish invalid/opted-out probes from real events; do not seed synthetic traffic into the production baseline.

Browser rendering and real navigation emission require a connected browser and remain unverified until that surface is available. A passing HTTP probe or unit test is not evidence of organic traffic or a working rendered browser journey.
