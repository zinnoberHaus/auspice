# Auspice product, pricing, and acquisition strategy

Research observed and almanac launch recommendation revised: **October 10, 2026**. Owner: Zinnober Haus. This document separates verified public evidence from launch recommendations. It does not establish product completeness, market demand, search rankings, or working payments. The [launch report](../../reports/Auspice%20almanac%20launch%20strategy.md) includes the 30-day calendar, prepared channel copy, and measurement gates; its [pricing](../../research_notes/Auspice%20almanac%20launch%20strategy/pricing.md) and [acquisition](../../research_notes/Auspice%20almanac%20launch%20strategy/acquisition.md) notes preserve source details and alternatives.

## Product position

**Recommendation:** a modern almanac for everyday reflection: draw a card, look at a home more closely, or make room for a meaningful day. Lead the public launch with the functioning guest tools and original guides. Private saved readings and the journal remain account-dependent; production account access is blocked by the documented trusted-domain setting until verified otherwise. Paid membership is not active. The useful first outcome is a clearer question and an ordinary next step, not a promise of prediction.

The supplied paper, ink and cinnabar design gives this practice a consistent visual identity. It does not establish calculation accuracy or willingness to pay. Guest tarot spreads and home/date drafts are unsaved. The date planner is not an auspicious-date calculator, and the home planner compares entered observations rather than scoring properties. Keep these limits visible where people choose the tools. See the [design mapping](design-implementation.md) and [current release evidence](../operations/release-readiness.md).

Begin with tarot-curious reflective beginners as an audience hypothesis, with people comparing homes or planning a milestone as adjacent use cases. The homepage should offer one primary guest-tarot action, a guide link, a real interaction preview, and practical home/date examples before discussing account features. No demographic, audience-size, traffic, or demand claim supports this hypothesis yet.

Keep the traditions identifiable. Explain the method and inputs behind each reading and distinguish calculated or drawn elements from interpretation. Do not present agreement between traditions as scientific validation or promise predictions, wealth, romantic certainty, or a successful property purchase. Unknown birth time must remain unknown rather than produce a fabricated ascendant. Housing and career reflections should complement practical investigation and professional advice where needed.

The product's interface and marketing should emphasize the experience rather than its implementation technology, as requested. Documentation and privacy disclosures must still truthfully explain data handling and service behavior. Avoid invented practitioners, reviews, credentials, usage counts, or endorsements. No fear-based upsells or notifications that imply missing a ritual causes harm.

## Observed competitor evidence

Prices are USD from vendor documentation or US App Store listings. Storefront SKUs establish advertised prices, not the price every account will see at checkout. Taxes, offers, and regional pricing can differ.

| Product | Observed price | Relevant product pattern |
| --- | --- | --- |
| CHANI | $11.99 monthly; $107.99 annually | Free app with premium guidance, meditations, and continuing editorial content. [Vendor pricing](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732281-App-Pricing), [US listing](https://apps.apple.com/us/app/chani-your-astrology-guide/id1532791252). |
| Co–Star | Pro-Star $8.99 monthly; 5 questions $2.99, 10 $4.99, 25 $6.99; selected reports $8.99 | Free charts and daily guidance, with subscription, question packs, and individual reports. [US listing](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561). |
| The Pattern | Go Deeper+ $14.99 monthly, $29.99 quarterly, $83.99 annually | Personal cycles, relationship compatibility, audio, and subscription access. [US listing](https://apps.apple.com/us/app/the-pattern/id1071085727). |
| Labyrinthos | Premium SKUs $9.99 and $89.99; explicitly labeled $24.99 per three months; digital decks commonly $4.99 | Free learning and readings, subscription, optional decks, and credits. The listing does not identify the billing intervals of the $9.99/$89.99 SKUs; do not represent those intervals as verified. [US listing](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220). |

Labyrinthos also publishes a navigable 78-card meanings library with suit groupings and links to fuller explanations. This demonstrates an educational discovery surface; it does not prove traffic or conversion performance. [Card meanings library](https://labyrinthos.co/blogs/tarot-card-meanings-list).

Source discrepancies matter. Co–Star's FAQ describes revenue as à-la-carte while its current storefront lists a subscription. The Pattern's older support article describes quarterly and annual plans while its storefront lists monthly too. Prefer the current storefront for the listed prices, and verify the actual purchase flow before competitive claims are published. [Co–Star FAQ](https://www.costarastrology.com/faq/), [The Pattern subscription help](https://thepattern.zendesk.com/hc/en-us/articles/14045427454740-General-information-about-Subscriptions).

## Launch pricing hypothesis

Recommend **Free + proposed Auspice Plus at $11.99/month or $107.99 billed annually**. The annual price is about $9/month equivalent and 24.94% below twelve monthly payments; public copy can say “about 25% less.” Show the full annual charge prominently. This is an experiment anchored in the observed $8.99–$14.99 monthly range, not evidence of willingness to pay for Auspice.

| Capability | Free | Plus, proposed and not on sale |
| --- | --- | --- |
| Guest tarot, practical planners and public guides | Available without an account; drafts are unsaved | Same guest tools |
| Traditions in personal readings | Tarot, I Ching, approximate sun-sign reflection, entry-aligned feng shui and synthesis | Same methods and limits |
| Completed personalized interpretations | 3 per calendar month for a usable verified account; current account-access restriction applies | Proposed 30 per monthly allowance period, once payment and entitlements work |
| Journal rights | Read, annotate, export and delete with account access | Same rights; preserve existing journal access after cancellation |

**The public Plus proposal is an allowance difference only.** Do not promise deeper interpretations, superior accuracy, exclusive multi-tradition synthesis, saved planner context, or continuity across past readings. Those are possible research directions, not accepted launch entitlements or implemented paid features. The larger allowance alone is a commercial hypothesis to test; a more elaborate visual design is not evidence of recurring value.

Do not charge until the actual service matches the proposed offer. Keep the guest ritual accessible before requiring an account; require an account for private synchronization and metered personalized service. Never expose an authenticated user's reading to another user. Separate “guest tools available now,” “account features temporarily unavailable,” and “Plus planned” on the pricing page rather than combining them into a functioning signup promise.

The current pricing page has **no subscription, trial, email-waitlist or interest form**. The legacy interest component and authenticated endpoint are retained, but the page does not render the component. The endpoint only records a signed-in account's plan preference; it is **not contact consent, an email waitlist, notification signup, subscription, or payment authorization**. Explain that scope if a preference control is exposed in a future release, and do not funnel guests into a known-broken signup path to record it. A future monthly/annual preference selector cannot promise contact or pricing. No trial CTA is justified by an unimplemented preview idea.

Define a reading as one submitted question and one completed interpretation. A follow-up requesting a new interpretation uses another reading; opening a saved result, exporting, and journaling do not. Show remaining allowance before submission. Failed attempts consume no allowance, retries must be idempotent, and the server enforces the limit. Planned monthly subscriptions should reset on their billing anniversary; annual plans should replenish monthly rather than granting 360 immediately. The implemented free allowance resets on the first of each calendar month in UTC, as disclosed in the account and pricing pages. Cancellation should preserve access to and export of the user's own existing journal.

Avoid additional credit packs at launch. The single membership is easier to explain while delivery cost and retention remain unknown. Consider a clearly priced one-off reading only after measuring whether it serves occasional users without confusing the subscription.

## Unit economics and payment readiness

For a US domestic-card benchmark, Stripe publishes **2.9% + $0.30** per successful online transaction, and pay-as-you-go Billing adds **0.7% of Billing volume**. International-card, conversion, tax, and other charges can change actual costs. These are published standard rates, not confirmation of the account's rates or setup. [Stripe US pricing](https://stripe.com/en-us/pricing), [Stripe Billing pricing](https://stripe.com/billing/pricing).

The following calculation uses `fee = charge × 0.036 + 0.30`. Reading costs are explicitly hypothetical and must be measured across successful outputs, retries, and validation.

| At full 30-reading monthly usage | Monthly plan | Annual plan, monthly equivalent |
| --- | ---: | ---: |
| Gross revenue | $11.99 | $9.00 |
| Payment and Billing fees | $0.73 | $0.35 |
| Reading cost at assumed $0.05 each | $1.50 | $1.50 |
| Remaining contribution at $0.05 | **$9.76** | **$7.15** |
| Reading cost at assumed $0.15 each | $4.50 | $4.50 |
| Remaining contribution at $0.15 | **$6.76** | **$4.15** |
| Reading cost at assumed $0.30 each | $9.00 | $9.00 |
| Remaining contribution at $0.30 | **$2.26** | **−$0.35** |

Remaining contribution excludes hosting, storage, support, email, taxes, refunds, disputes, acquisition, and native-store commissions. It is not profit. Three free readings cost an assumed $0.15–$0.45 per fully active free account at the two lower cost scenarios before these other expenses. Include that free-user cost when evaluating paid conversion and acquisition. The annual offer already loses money before overhead in the $0.30/full-use scenario; measure delivered cost, including failures and retries, before wider annual sales. Do not promise unlimited personalized service or deepen the annual discount before measuring real usage.

**Current payment setup status:** the coordinator's October 10 Vercel Stripe integration attempt returned `action_required` with reason `integration_terms_acceptance_required`. The account owner must accept the integration terms before that setup can continue. This is a pending owner action, not evidence that Stripe rejected the business or that a category restriction was found. The research agent did not provision or verify a Stripe account.

Before accepting subscriptions, prove authenticated checkout, signed and idempotent webhook handling, server-controlled entitlements, persistent usage, renewal/reset behavior, cancellation, payment failure, and the customer portal. Test the actual prices and billing periods. A pricing page or deployment alone is insufficient evidence that payment processing works.

## Search and acquisition plan

Google's guidance favors original content that helps people, with clear authorship and useful substance. Auspice should compete through clear methods, original examples, and useful tools rather than a large collection of near-identical sign, city, or question pages. No ranking or traffic forecast is justified by this research. [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

The launch foundation is the existing nine substantive guides plus a dedicated `/free-tarot` page with the actual guest table and original explanatory content. The new public page is being implemented in the almanac launch workstream; source presence is not proof of deployment, browser usability or indexing. Link it from the homepage, relevant tarot/journal guides and sitemap. Do not make indexing sanctuary query variants the acquisition strategy. Future guides should answer observed reader questions rather than meet a page-count quota. The [editorial record](editorial-plan.md) tracks source and verification boundaries.

Each guide should explain the tradition, show a worked example, cite sources, state limits, identify actual authors/reviewers, record a meaningful update date, and link to the relevant free experience. Do not invent a reviewer or imply a practitioner reviewed content when they did not. Sources and asset/translation permissions require review before publication.

Technical implementation requirements:

- Give every public guide a stable URL, unique title and description, visible heading, canonical URL, accessible HTML, and mobile-friendly layout.
- Use real `<a href>` links with descriptive text; every important page should have an internal link. [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- Put preferred public canonical URLs in the sitemap, reference it from `robots.txt`, and submit it in Search Console once ownership is verified. Submission is a discovery hint, not a guarantee of indexing. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Keep the page title, visible main heading, description, canonical and social-preview promise consistent. Use original helpful HTML alongside the interactive tool; metadata cannot substitute for a useful page. Google can choose different title/snippet text. [Title guidance](https://developers.google.com/search/docs/appearance/title-link), [snippet guidance](https://developers.google.com/search/docs/appearance/snippet), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Google ignores sitemap `priority` and `changefreq`. Maintain `lastmod` only when it reflects meaningful content changes. Useful visible Q&A can remain, but FAQ rich results were retired in May 2026 and their documentation removed in June; do not sell FAQ markup as a launch benefit. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google update history](https://developers.google.com/search/updates).
- Use accurate JSON-LD only for relevant, visible content, such as articles, breadcrumbs, and application information. Never fabricate reviews or ratings. Validate applicable markup; correct markup does not guarantee rich results. [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Keep personal readings, journals, account routes, and private share previews out of search indexes and the public sitemap. Enforce authentication and per-user authorization: `noindex` and `robots.txt` are not privacy controls. If the goal is to remove a public app-shell URL from results, Google must be able to crawl it to observe `noindex`; robots disallow alone can leave a URL indexed without content. [Noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- Verify crawlability, rendered content, canonical URLs, sitemap routes, and mobile experience on the deployed production domain. Search Console access, indexing, performance, and rankings remain unverified until checked there.

Recommended acquisition sequence:

1. Verify the guest experience, truthful homepage/pricing and public search entry page. Use a first week for source/browser/crawl checks and Search Console setup when the owner has access.
2. Prepare original exercises and actual interface demonstrations for an existing owned or permissioned audience. Share nothing automatically; exclude birth information, addresses, personal questions and journal text from public assets.
3. Gather voluntary feedback about question framing, card interpretation and practical next steps; improve the existing pages. Use the current anonymous guide totals and available Search Console evidence with their limitations.
4. Prepare creator collaborations or optional email only for an authorized, working channel. An account price-preference record is not email consent or a mailing list. Avoid pressure, streak penalties and ominous notifications.
5. Promote account features only after production identity access and email flows are verified. Promote paid membership only after payment, entitlement and billing lifecycle gates pass. Test paid acquisition later with measured costs, retention, a bounded approved budget and stop conditions.

The immediate journey is **public page or guide → useful guest exercise → a practical next step**. The later account journey is **verified account → completed saved reflection → meaningful return → optional subscription**, subject to the operational gates. Completing a personal reading and saving it are one atomic operation, not separate conversion stages. Guest spreads are a different unsaved action. Future measurement should distinguish these behaviors without collecting raw questions, birth data, home details or journal text into analytics. Account activation, seven/thirty-day recurrence, payment, renewal and delivered cost require explicit designs and actual evidence before targets are set.

The initial implemented measurement is deliberately narrower: daily public-guide view events and guide-to-sanctuary click events, with a [read-only operator report](../operations/guide-measurement.md). It does not measure homepage/free-tarot visits, guest-draw completion or social-source attribution. It collects no visitor identifier, so it cannot count unique people, attribute readings to guides, or establish retention or paid conversion. Click/view ratios are event ratios and can exceed one. Evaluate them as a directional editorial baseline, then decide whether further measurement is justified. Search Console ownership, human traffic and the broader funnel remain unverified.

## Evidence limits and release status

- Verified here: the linked public pricing, product patterns, Google guidance, published payment-fee benchmarks, and arithmetic based on labeled assumptions.
- Recommended here: positioning, price, allowance, editorial topics, acquisition sequence, and measurement definitions.
- Not established: Auspice demand, retention, conversion, acquisition cost, keyword volumes/difficulty, provider account rates, production payment success, or search rankings.
- Design-pack fidelity, working web/mobile/desktop experiences, identity management, live readings, deployment, and recovery must be verified by the implementation/release workstreams. This research is not evidence that those requirements are complete.
