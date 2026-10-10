# Public alpha evidence

Date: October 10, 2026. This is an evidence ledger, not a claim of a completed commercial launch.

## Observed working

- Provisioned GitHub repository, Vercel application, Neon database and Managed Better Auth.
- Through the local application against the real provisioned services: email/password signup and session cookies; verified synthetic identity sign-in; rejection of unverified reading requests; sign-out and protected API rejection. The production-domain exception is recorded below.
- Real structured interpretation through the configured gateway, persisted private journal, idempotent retry using one allowance, note update, JSON export, content deletion, and deleted-request replay returning HTTP 410.
- Other-account journal mutation requests return HTTP 404. Account deletion reauthenticates with the provider and atomically cascades through owned records. See [erasure decision](account-erasure.md).
- Database rollback audit verifies erasure of all application tables, preservation of a different owner, and rejection of orphan recreation.
- Tradition tests cover tarot deck constraints, all 4,096 three-coin outcomes, the 64 canonical hexagrams, changing lines and date validation.
- Nine server-rendered guide routes return HTTP 200 and an unknown guide returns HTTP 404. Canonical metadata, sitemap, robots, article and breadcrumb structured data are implemented.
- Production build and typechecking passed locally and in GitHub Actions. The default suite has 46 passing tests and two opt-in database tests. Both database tests subsequently passed on the isolated development database, including concurrent reservations, idempotency and deletion serialization; the separate rollback audits also passed.

## Not yet proven or available

- **Production account access is blocked:** the public-domain signup test returned HTTP 403 `INVALID_ORIGIN`. The provider needs the exact `https://auspice-red.vercel.app` origin in its trusted-domain configuration. Public guides and guest tools are available; production signup and subsequent private flows are not passed. See [the corrective steps](deployment.md#production-auth-domain-correction).
- Original design fidelity: the supplied Downloads ZIP was denied by the operating system. No archive content was recovered or invented.
- Visual/accessibility device review: no browser surface was connected. Source inspection and HTTP checks do not substitute for rendering checks.
- Delivered verification/recovery emails: fixtures used a narrowly scoped database verification step, not a real mailbox. Production SMTP/domain settings need verification.
- Administrator activation and live administration: no owner account was guessed or granted privileges. Mocked authorization tests are separate from a live operator test.
- Payments: Stripe terms await human acceptance. Plus is an interest list; there is no active billing.
- SEO outcomes: indexed pages, rankings, acquisition and conversion have not been measured. The research and editorial plan are hypotheses, not traffic results.
- Backup restore drill, production spending alarms and sustained operational monitoring remain launch work. Production, preview and development now have separate provisioned resources; retirement of legacy previews is recorded below.
- Desktop signing/notarization and additional operating systems are not complete. Desktop packaging evidence is in [desktop operations](desktop.md).

## Guide measurement follow-up

The public guides now include daily view and sanctuary-link event counting with no visitor IDs or private-content telemetry, plus a read-only operator report. Fourteen additional tests cover the collector, client transport boundary and report. The production build, typecheck and dependency audit pass locally (zero production dependency vulnerabilities). The new migration and actual counter SQL passed in an isolated PostgreSQL schema inside a rollback transaction; no synthetic counts were retained. Independent browser execution and organic traffic remain unverified. See [measurement operations](guide-measurement.md) for data scope, disable controls, limitations and rollback.

## Environment isolation follow-up

Three distinct Neon projects now serve production, preview and development, with environment-specific Vercel bindings. The production database/Auth endpoints and cookie-secret metadata remained unchanged during the connection update. Both new resources started with zero identities, received all four migrations and use separate nonproduction cookie secrets. The complete local account, real reading, journal, export and erasure smoke flow passed against the isolated development service, and its synthetic fixtures were removed. All preview branches currently share the single preview resource; this is not per-branch isolation.

Ten legacy previews were inventoried and their exact GitHub source revisions archived privately before retirement. The replacement preview (`dpl_2KBKXErRUkJNFfRoVtZUwASUThkU`, revision `6448e6049cda78a08b20a3dbb88d20376f08b615`) is Ready. Authenticated Vercel CLI requests returned HTTP 200 for its anonymous session and HTTP 204 for disabled guide collection; sign-in remains HTTP 403 `INVALID_ORIGIN`. All ten inventoried legacy previews were retired, all 17 old immutable/alias URLs returned 404, and production remained available. No production deployment or customer data was removed. See the [retirement and resource evidence](environment-isolation-evidence.json) and [PR 8](https://github.com/zinnoberHaus/auspice/pull/8). Existing deployment snapshots do not inherit new environment settings; recovering an old preview would recover the old unsafe configuration.

## Release records

Source: [`a628a76`](https://github.com/zinnoberHaus/auspice/commit/a628a76e266016686e28e92650e8357eec99a3f1), merged through [PR 1](https://github.com/zinnoberHaus/auspice/pull/1). Its tree matches the checked feature revision `7f6e6f6`. [GitHub web and desktop dependency checks](https://github.com/zinnoberHaus/auspice/actions/runs/38085612282) passed. Main requires the web and desktop dependency checks before merging.

Production deployment: `dpl_DpQidgHgWnhy8pTnKe6Q9Ktt9jiE`, ready, immutable URL `https://auspice-o5m3o40s0-my-team-ae70891f.vercel.app`, public alias `https://auspice-red.vercel.app`. Public homepage, pricing, download, manifest, social image, font notices, robots, sitemap and all nine guides returned HTTP 200. Guide pages contain canonical and structured-data markup; unknown guide returned 404. Anonymous journal, export and admin APIs returned 401. Production signup returned 403 as described above; the smoke test stopped and its cleanup ran.

[The macOS developer prerelease](https://github.com/zinnoberHaus/auspice/releases/tag/v0.1.0-alpha.1) is published with Apple Silicon and Intel archives, SHA256SUMS and sanitized package-verification evidence. GitHub's uploaded asset digests match the local verified archives. The previews retain their ad-hoc-signature and native-testing limitations.

The initial deployment `dpl_12b7SMWo2Dqgz7C3ySnCeQiDQvfW` predates later fixes and is retained only as historical evidence; it is not the current release candidate.
