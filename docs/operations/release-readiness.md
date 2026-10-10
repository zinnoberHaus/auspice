# Public alpha evidence

Date: October 10, 2026. This is an evidence ledger, not a claim of a completed commercial launch.

## Observed working

- Provisioned GitHub repository, Vercel application, Neon database and Managed Better Auth.
- Real email/password signup and session cookies; verified synthetic identity sign-in; rejection of unverified reading requests; sign-out and protected API rejection.
- Real structured interpretation through the configured gateway, persisted private journal, idempotent retry using one allowance, note update, JSON export, content deletion, and deleted-request replay returning HTTP 410.
- Other-account journal mutation requests return HTTP 404. Account deletion reauthenticates with the provider and atomically cascades through owned records. See [erasure decision](account-erasure.md).
- Database rollback audit verifies erasure of all application tables, preservation of a different owner, and rejection of orphan recreation.
- Tradition tests cover tarot deck constraints, all 4,096 three-coin outcomes, the 64 canonical hexagrams, changing lines and date validation.
- Nine server-rendered guide routes return HTTP 200 and an unknown guide returns HTTP 404. Canonical metadata, sitemap, robots, article and breadcrumb structured data are implemented.
- Production build and typechecking have passed locally; final revision/CI/deployment evidence is recorded below as it becomes available.

## Not yet proven or available

- Original design fidelity: the supplied Downloads ZIP was denied by the operating system. No archive content was recovered or invented.
- Visual/accessibility device review: no browser surface was connected. Source inspection and HTTP checks do not substitute for rendering checks.
- Delivered verification/recovery emails: fixtures used a narrowly scoped database verification step, not a real mailbox. Production SMTP/domain settings need verification.
- Administrator activation and live administration: no owner account was guessed or granted privileges. Mocked authorization tests are separate from a live operator test.
- Payments: Stripe terms await human acceptance. Plus is an interest list; there is no active billing.
- SEO outcomes: indexed pages, rankings, acquisition and conversion have not been measured. The research and editorial plan are hypotheses, not traffic results.
- Separate preview data, backup restore drill, production spending alarms and sustained operational monitoring remain launch work.
- Desktop signing/notarization and additional operating systems are not complete. Desktop packaging evidence is in [desktop operations](desktop.md).

## Release records

Initial Vercel deployment: `dpl_12b7SMWo2Dqgz7C3ySnCeQiDQvfW`, ready, public alias `https://auspice-red.vercel.app`. Final source revision and subsequent deployment are pending release integration.
