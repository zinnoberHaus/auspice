# Auspice

A calm place for tarot, I Ching, astrology, and feng shui. A responsive web sanctuary, private journal, and macOS desktop preview.

[Open Auspice](https://auspice-red.vercel.app) · [Practice guides](https://auspice-red.vercel.app/guides) · [Desktop releases](https://github.com/zinnoberHaus/auspice/releases)

**Status: public alpha.** Public guides and guest tools are available. Production signup is currently blocked by the Auth provider's trusted-domain setting; [the corrective steps](docs/operations/deployment.md#production-auth-domain-correction) and [release evidence](docs/operations/release-readiness.md) record the exact state. The supplied design ZIP was not readable in the development environment, so the current visual design is provisional. Paid membership is an interest list, not an active subscription. This release does not include a professional birth chart, guaranteed predictions, or a traditional compass-school feng shui assessment.

## What works

- Cryptographically randomized tarot draws and three-coin I Ching casts, including changing lines and the resulting hexagram.
- Approximate tropical sun-sign reflection, entrance-aligned BTB feng shui reflection, and synthesis across selected traditions.
- Structured interpretations grounded in the selected symbols, with three saved readings per calendar month for verified free accounts.
- Email/password accounts, verification and recovery interfaces, private journal notes, export, and permanent account deletion.
- An operator console with explicit administrator authorization; owner activation remains pending.
- Nine original, linked practice guides with canonical URLs, metadata, sitemap, and structured data.
- A sandboxed macOS desktop client sharing the web account and journal. Preview packages are not Developer ID signed or notarized.

Read the [methods and sources](docs/research/tradition-methods.md), [pricing and acquisition research](docs/research/product-strategy.md), and [editorial plan](docs/research/editorial-plan.md). Auspice supports personal reflection; it does not establish facts about the future or replace professional advice.

## Local development

Use Node 24 and npm. Copy `.env.example` to `.env.local` and supply your own Neon database and Managed Better Auth endpoint, a random cookie secret of at least 32 characters, and an interpretation gateway credential. With the linked Vercel project, `vercel env pull .env.local` retrieves authorized development configuration, including its short-lived OIDC credential. Never commit that file.

```sh
npm ci
node scripts/migrate.mjs
npm run dev
```

Migration execution requires `psql` and a trusted CA bundle. On systems without `/etc/ssl/cert.pem`, set `PGSSLROOTCERT` to the system's CA bundle. Migrations are transactional and checksum tracked; apply them to an isolated branch before production. The app uses server-side database queries and enforces ownership in each private handler.

```sh
npm test
npm run build
npm run typecheck
npm audit --omit=dev --audit-level=high
```

Database integration tests are opt-in; read their explicit environment requirements in `tests/integration-db.test.ts`. The live smoke script creates disposable synthetic identities, temporarily verifies only those fixtures, requests one real interpretation, and deletes the fixtures afterward. It does **not** prove email delivery. Use only the intended test deployment and its matching database:

```sh
AUSPICE_RUN_LIVE_TEST=1 AUSPICE_TEST_URL=http://localhost:3000 node --env-file=.env.local scripts/smoke-live.mjs
```

## Operations and collaboration

[Deployment and recovery](docs/operations/deployment.md) · [User management](docs/operations/user-management.md) · [Desktop](docs/operations/desktop.md) · [Release evidence](docs/operations/release-readiness.md)

The `.codex/agents` roles provide bounded product research, implementation, documentation, security review, verification, and release assignments. They run when assigned; they are not background workers. See [contributing](CONTRIBUTING.md), [governance](GOVERNANCE.md), and [security reporting](SECURITY.md). Owner: [zinnoberHaus](https://github.com/zinnoberHaus). Apache-2.0.
