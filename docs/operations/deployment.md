# Deployment and recovery

## Verified service inventory

Observed October 10, 2026. Repository: `zinnoberHaus/auspice`. Public origin: `https://auspice-red.vercel.app`.

| Service | Provisioned resource | State |
| --- | --- | --- |
| Vercel | Project `prj_XcZcL7NAgdIM3x3pYrNwqduBdVm2`, scope `my-team-ae70891f` (display name Microyee) | Alpha deployment ready; public routes verified; authenticated CLI owner `zinnoberhaus` |
| Neon production | `auspice-db`; project `long-river-98398124`; Vercel resource `store_WjTWodqy6Mq6ZY1h`; free_v3 plan | Bound only to production; existing database and Auth endpoints verified unchanged; production signup remains blocked by the trusted-domain configuration |
| Neon preview | `auspice-preview-db`; project `soft-poetry-10995260`; Vercel resource `store_f4WKKRim93sdT9cU`; free_v3 plan | Auth enabled; bound only to preview; initially empty identity store; all four migrations applied |
| Neon development | `auspice-dev-db`; project `divine-tooth-41517958`; Vercel resource `store_4cjpEWzit91f3pKp`; free_v3 plan | Auth enabled; bound only to development; initially empty identity store; all four migrations applied |
| Vercel AI Gateway | Project OIDC; `google/gemini-2.5-flash-lite` | Real structured reading tested; gateway availability and quota remain external dependencies |
| Stripe | No billing resource | Marketplace terms require human acceptance; no checkout, products, subscriptions or webhook processing are advertised as active |
| GitHub Actions | Repository Verify workflow | Web and desktop dependency checks passed for alpha source; main requires both |

The Vercel scope is the existing connected account; its display name is not evidence of a separate Zinnober organization. A future team or custom-domain transfer must explicitly migrate env scopes, domain allowlists, auth callback settings and the desktop origin together. GitHub is a personal owner account; executable agent roles do not imply that human team memberships were created.

## Configuration

The linked project stores `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, and `NEXT_PUBLIC_SITE_URL` as environment variables. Do not replace a ready Auth URL with the temporary literal `provisioning` emitted during resource creation. Production interpretation uses Vercel OIDC; local runs need a fresh pulled token or `AI_GATEWAY_API_KEY`. A model can be selected with `READING_MODEL`; verify structured output and pricing before changing it.

Production, preview and development now have separate Neon projects and distinct database/Auth endpoints. The production resource's connection was narrowed to production in place, without disconnecting it; before/after checks confirmed its database and Auth endpoints did not change. Preview and development each use a separately generated 64-character hexadecimal cookie secret. The current local `.env.local` contains development configuration. CI uses dummy build-only auth configuration and does not connect to a live database.

**All preview branches still share one preview database and Auth service.** This separates previews from production, but is not per-PR database isolation. Coordinate preview fixtures and migrations, and do not treat parallel preview branches as independent tenants or disposable databases.

The two opt-in database integration tests passed against the initially empty development environment, including concurrent quota reservations, idempotency, and deletion/cascade cleanup. The isolated development application's live smoke test also passed: two synthetic signups, explicitly verified fixtures, a real gateway interpretation, journal persistence, idempotent quota handling, cross-owner protection, account deletion and sign-out. The fixtures were cleaned up. These checks do not establish email delivery. The replacement preview returned HTTP 200 with an anonymous session and HTTP 204 from its disabled metrics collector through authenticated Vercel CLI access. Sign-in returned HTTP 403 `INVALID_ORIGIN`, so its provider trusted-domain configuration also needs correction; preview account access is not claimed working.

### Environment changes and historical previews

Before changing bindings, retain authorized production configuration backups in a private, access-controlled location outside source control and deployment uploads. Never commit credentials, generated SSO URLs or backup contents. Use the explicit project/scope and inspect the proposed environment change before applying it:

```sh
vercel storage update store_WjTWodqy6Mq6ZY1h --project prj_XcZcL7NAgdIM3x3pYrNwqduBdVm2 --scope my-team-ae70891f --environment production --dry-run
```

Apply an authorized, reviewed change by replacing `--dry-run` with `--yes`. Omit `--auth` and `--prefix` to preserve the existing credential mode and variable prefix. Updating the existing connection preserves it; disconnecting and recreating it is not part of this procedure. Verify the intended resource binding and compare database/Auth endpoints without printing credentials.

Changing environment bindings does not rewrite immutable environment snapshots in older deployments. Ten legacy preview deployments in the exact Auspice project were inventoried because they retain the previous production credentials. Source tarballs and SHA-256 checksums were saved privately. All ten exact preview IDs were then retired after the replacement preview checks. All 17 old immutable and branch-alias URLs returned HTTP 404, and the production homepage remained HTTP 200. The scoped preview inventory contained only the new isolated preview at that verification time. See the [sanitized retirement record](environment-isolation-evidence.json). Production deployment history was excluded. This retires those execution surfaces; it does not rotate the production database credential. If a retired build is recovered, it would retain its old environment snapshot, so rebuild its preserved source against the isolated preview environment instead. This is a bounded, one-time operation, not an automatic recurring cleanup.

### Explicit database selection

`scripts/migrate.mjs` loads `.env.local` without replacing already-set variables and prefers `DATABASE_URL_UNPOOLED` over `DATABASE_URL`. Select the intended environment explicitly before every migration; a stale unpooled URL can otherwise select a different database from the pooled URL. Keep production configuration out of the development `.env.local`.

For an authorized environment file stored privately, the following pattern clears inherited database overrides and requires the selected file to supply both database URLs before the runner can load `.env.local`. Replace the example path with the intended file and confirm both URLs belong to that environment before running it. The guard prevents a missing unpooled URL from silently falling back to development configuration.

```sh
env -u DATABASE_URL -u DATABASE_URL_UNPOOLED node --env-file=/absolute/private/auspice-development.env --input-type=module <<'JS'
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('Selected environment file must provide both database URLs.');
}
await import('./scripts/migrate.mjs');
JS
```

The migration runner applies unapplied, checksum-tracked SQL in transactions. Review and test migrations in development before an explicitly authorized production run; never edit an already-applied migration. The current production, preview and development resources have migrations `001` through `004` applied. Opt-in database tests require their explicit integration-test URL and mode; they do not implicitly use `.env.local` or `DATABASE_URL`.

## Rollout

1. Run the tests, production build, typecheck and dependency audit recorded in the README.
2. Review pending SQL against the isolated development database and explicitly select the intended migration environment as described above. Coordinate changes to the shared preview database. Never edit an already-applied migration.
3. Commit and merge the reviewed implementation. Deploy from the intended revision with `vercel --prod --yes --scope my-team-ae70891f`, or let the connected Git integration deploy the merged main branch.
4. Verify the actual public alias, sitemap, canonical URLs, public guides, anonymous private-API rejection and a designated synthetic account flow. A successful build alone is insufficient.
5. Record deployment URL, commit, tests and unresolved gates in release evidence. Desktop updates require a separate package and release; they do not update automatically.

## Rollback and recovery

Vercel can restore a previously working deployment through the project Deployments interface or the authorized CLI rollback command. Keep the current service variables compatible with that deployment. The initial schema changes are additive; application rollback does not erase the database. Never reverse the deletion cascade merely to restore an old UI.

For a faulty migration, stop writes and create a Neon branch from a verified point within the configured retention window, validate the corrected migration there, then decide whether to restore or apply a forward correction. The current backup retention window and an actual restore drill have not been verified; do not promise a recovery-point or recovery-time objective. Account deletion cascades immediately through live identity, sessions, credentials and application records. Restoring a backup can resurrect erased data, so an erasure reconciliation process is required before restored data serves users.

If gateway calls fail, reservations become failed and do not consume the monthly allowance. Stale pending reservations expire after five minutes when a subsequent reservation is attempted. There is no pretend replacement reading. If Auth or the database fails, private features require service restoration; the static guide content remains independently deployable.

## Launch gates

Visually verify the imported replacement design archive on mobile and desktop; configure and test production email delivery and recovery with an owner-controlled mailbox; activate the exact intended administrator; verify trusted domains and production localhost policy; accept Stripe terms and implement/test billing before selling Plus; sign and notarize desktop packages; perform a database restore drill and set operational spending alerts. No production mailbox, administrator, payment method or legal acceptance was fabricated during implementation.

## Production Auth domain correction

The deployed signup endpoint returned HTTP 403 `INVALID_ORIGIN` for the canonical public domain. Do not rewrite or suppress the request's Origin to bypass this protection.

Open the [existing Vercel Neon resource](https://vercel.com/my-team-ae70891f/~/stores/integration/store_WjTWodqy6Mq6ZY1h), choose **Open in Neon**, select the production branch, then **Auth → Configuration → Domains**. Add exactly `https://auspice-red.vercel.app` without a trailing slash. The resource can also be opened using `vercel integration open neon auspice-db --scope my-team-ae70891f`; its generated SSO URL is sensitive and must not be committed.

This uses the existing Vercel-managed account, not a new Neon project. The CLI's integration connection command exposes environments and prefixes, but does not expose this domain setting. A separate Neon management API key is not available in the current setup, and native/browser automation permissions were unavailable. The owner was asked to apply the documented setting. Then rerun the production smoke flow and record the result before claiming production accounts work. [Neon domain configuration](https://neon.com/docs/auth/guides/configure-domains), [Vercel-managed integration](https://neon.com/docs/guides/vercel-managed-integration).
