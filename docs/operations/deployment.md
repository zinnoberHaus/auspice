# Deployment and recovery

## Verified service inventory

Observed October 10, 2026. Repository: `zinnoberHaus/auspice`. Public origin: `https://auspice-red.vercel.app`.

| Service | Provisioned resource | State |
| --- | --- | --- |
| Vercel | Project `prj_XcZcL7NAgdIM3x3pYrNwqduBdVm2`, scope `my-team-ae70891f` (display name Microyee) | Initial deployment ready; authenticated CLI owner `zinnoberhaus` |
| Neon | Project `long-river-98398124`, Vercel resource `store_WjTWodqy6Mq6ZY1h`, free_v3 plan | Database, Managed Better Auth and migrations provisioned; real account/session/reading tests passed |
| Vercel AI Gateway | Project OIDC; `google/gemini-2.5-flash-lite` | Real structured reading tested; gateway availability and quota remain external dependencies |
| Stripe | No billing resource | Marketplace terms require human acceptance; no checkout, products, subscriptions or webhook processing are advertised as active |
| GitHub Actions | Repository Verify workflow | See the release evidence for the tested revision |

The Vercel scope is the existing connected account; its display name is not evidence of a separate Zinnober organization. A future team or custom-domain transfer must explicitly migrate env scopes, domain allowlists, auth callback settings and the desktop origin together. GitHub is a personal owner account; executable agent roles do not imply that human team memberships were created.

## Configuration

The linked project stores `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, and `NEXT_PUBLIC_SITE_URL` as environment variables. Do not replace a ready Auth URL with the temporary literal `provisioning` emitted during resource creation. Production interpretation uses Vercel OIDC; local runs need a fresh pulled token or `AI_GATEWAY_API_KEY`. A model can be selected with `READING_MODEL`; verify structured output and pricing before changing it.

Production, preview and development were initially linked to the same provisioned database. **Do not run destructive previews or customer-data tests against this configuration.** Before accepting public traffic at scale, create separate Neon branches/projects, rebind each Vercel environment, and verify Auth URLs and secrets for each. CI uses dummy build-only auth configuration and does not connect to the live database.

## Rollout

1. Run the tests, production build, typecheck and dependency audit recorded in the README.
2. Review pending SQL on an isolated database branch. `node scripts/migrate.mjs` applies unapplied, checksum-tracked SQL in transactions. Never edit an already-applied migration.
3. Commit and merge the reviewed implementation. Deploy from the intended revision with `vercel --prod --yes --scope my-team-ae70891f`, or let the connected Git integration deploy the merged main branch.
4. Verify the actual public alias, sitemap, canonical URLs, public guides, anonymous private-API rejection and a designated synthetic account flow. A successful build alone is insufficient.
5. Record deployment URL, commit, tests and unresolved gates in release evidence. Desktop updates require a separate package and release; they do not update automatically.

## Rollback and recovery

Vercel can restore a previously working deployment through the project Deployments interface or the authorized CLI rollback command. Keep the current service variables compatible with that deployment. The initial schema changes are additive; application rollback does not erase the database. Never reverse the deletion cascade merely to restore an old UI.

For a faulty migration, stop writes and create a Neon branch from a verified point within the configured retention window, validate the corrected migration there, then decide whether to restore or apply a forward correction. The current backup retention window and an actual restore drill have not been verified; do not promise a recovery-point or recovery-time objective. Account deletion cascades immediately through live identity, sessions, credentials and application records. Restoring a backup can resurrect erased data, so an erasure reconciliation process is required before restored data serves users.

If gateway calls fail, reservations become failed and do not consume the monthly allowance. Stale pending reservations expire after five minutes when a subsequent reservation is attempted. There is no pretend replacement reading. If Auth or the database fails, private features require service restoration; the static guide content remains independently deployable.

## Launch gates

Import and visually verify the supplied design archive; verify mobile/desktop rendering; configure and test production email delivery and recovery with an owner-controlled mailbox; activate the exact intended administrator; verify trusted domains and production localhost policy; isolate environments; accept Stripe terms and implement/test billing before selling Plus; sign and notarize desktop packages; perform a database restore drill and set operational spending alerts. No production mailbox, administrator, payment method or legal acceptance was fabricated during implementation.
