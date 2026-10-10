# Marketing and SEO operations

Scope: the October 10, 2026 almanac landing, public guest tarot, membership proposal and acquisition materials. This is a public-alpha marketing update, not a completed paid launch.

## Public entry points

- `/`: brand, real use cases, guest-first CTA, availability and pricing summary.
- `/free-tarot`: indexable server-rendered explanation around the working one-, three- and ten-card guest table. No personal question, account or payment is required. Draws are unsaved.
- `/pricing`: guest tools available now, temporarily unavailable account features, and proposed Plus at $11.99/month or $107.99/year. The annual charge is upfront; savings are approximately 25% versus twelve monthly payments. No checkout or email waitlist exists.
- `/guides` and nine individual guides: original educational content, sources and relevant guest links. Guide views and clicks on “Open the almanac” retain their existing `view` / `open_sanctuary` aggregate event meanings. The separate `/free-tarot` link is not tracked.

Homepage, pricing and free-tarot traffic/activation are not measured by those guide counters. Do not call anonymous event totals unique visitors, saved-reading conversions, retention or paid conversion.

## Technical search configuration

`lib/site.ts` normalizes the explicit `NEXT_PUBLIC_SITE_URL` into a canonical origin. It defaults to `https://auspice-red.vercel.app` and never uses a request Host or automatic preview hostname. Set this variable to the production canonical origin in **all** Vercel environments. Public pages have individual titles, descriptions and social metadata. The common 1200×630 image follows the almanac identity. Root structured data identifies the real site and organization; guides retain Article and Breadcrumb markup. The free tool adds a matching breadcrumb. There are no invented ratings, endorsements, active subscription offers or FAQ rich-result promises.

The sitemap lists only canonical public pages. It omits unsupported priority/change-frequency guesses and fabricated modification dates. Account, admin, sanctuary and API responses carry `X-Robots-Tag: noindex, nofollow`. Vercel preview/development builds carry that header globally and inherit a noindex meta tag. App shells remain crawlable so search engines can read their noindex directive; API crawling is disallowed. Authentication and ownership checks remain the private-data boundary.

The preview sitemap contains production canonical URLs but is not advertised by preview robots.txt. A canonical is not an access control or an indexing guarantee.

## Verification

Use Node 24. Start the built app, then run the read-only smoke check:

```sh
npm run build
npm start -- --hostname 127.0.0.1 --port 3100
# In a second terminal:
AUSPICE_TEST_URL=http://127.0.0.1:3100 npm run check:public
```

For production, set `AUSPICE_TEST_URL=https://auspice-red.vercel.app`. The script follows the sitemap, checks all public HTTP responses, unique titles, descriptions, canonical/social URLs, social images, one h1, parseable JSON-LD, intended indexing and private-route headers. It never signs in, submits a question, sends analytics events or creates account data. `AUSPICE_EXPECT_NOINDEX=1` is for a reachable preview build; a protected preview requires the existing authorized Vercel access mechanism.

The same public smoke check runs after build/typecheck in the required web CI job. It complements the guest draw tests and HTTP draw checks. It does not execute a browser, verify mobile rendering or prove indexing. The current session has no connected browser; visual/device verification remains outstanding.

## Search Console and launch sequence

1. Use the exact existing production URL for a URL-prefix Search Console property unless the owner chooses and configures a custom domain. Use the owner’s authorized verification mechanism; never invent a verification token.
2. Submit `/sitemap.xml`, inspect `/`, `/free-tarot`, `/pricing` and one guide with URL Inspection, and record coverage/canonical results. Those actions require verified property access and have not been performed in this update.
3. Establish a dated baseline of impressions, clicks, landing pages and queries. Review observed results; no rankings, keyword volumes or traffic forecasts are asserted.
4. Follow the [launch strategy](../../reports/Auspice%20almanac%20launch%20strategy.md) for prepared copy and the 30-day sequence. External posts, partner outreach, email campaigns and advertising spend are not performed by preparing the materials.
5. Resolve and verify the [production Auth domain](deployment.md#production-auth-domain-correction) before account acquisition. Complete billing, entitlement, cancellation and recovery checks before selling Plus. Keep guest CTAs usable while those gates remain open.

If a custom domain is later selected, update the canonical origin, redirects, sitemap, Auth trusted domains/callbacks and desktop origin together; verify the destination before retiring the old domain. No domain was purchased or changed here.

## Rollback and data effects

This change adds no database migration, dependency or third-party tracking service. It changes presentation, metadata, public routing and search headers. Revert the marketing change or restore the preceding production deployment to recover the previous public experience; existing accounts and journal data are unaffected. Preserve the current production/preview/development service isolation. Deployment IDs and verification results belong in the release evidence when observed.
