# Auspice product, pricing, and acquisition strategy

Research observed: **October 10, 2026**. Owner: Zinnober Haus. This document separates verified public evidence from launch recommendations. It does not establish product completeness, market demand, search rankings, or working payments.

## Product position

**Recommendation:** a calm, private place to explore tarot, astrology, I Ching, and feng shui around real questions about home, career, relationships, and personal direction. The useful outcome is a considered question, an understandable interpretation, and a reflection the person can revisit.

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

Recommend **Free + Auspice Plus at $11.99/month or $107.99/year**. The annual price is about $9/month paid upfront and approximately 25% less than twelve monthly payments. Show the full annual charge prominently. This is an experiment anchored in the observed $8.99–$14.99 monthly range, not evidence of willingness to pay for Auspice.

| Capability | Free | Plus, once implemented and verified |
| --- | --- | --- |
| Traditions and public educational library | All four traditions | All four traditions |
| Completed personalized interpretations | 3 per month | 30 per month |
| Interpretation depth | Standard reflection and a journal prompt | Deeper interpretation, comparison across selected traditions, saved context |
| Journal | Save, revisit, export, delete | Same rights, plus useful continuity across prior reflections |
| Daily ritual | Lightweight draw or editorial prompt | Same; deeper personalization uses the stated allowance |

Do not charge for the table's planned features until their actual behavior matches the offer. Keep the first ritual accessible before requiring an account where technically appropriate; require an account for private synchronization and metered personalized service. Never expose an authenticated user's reading to another user.

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

Remaining contribution excludes hosting, storage, support, email, taxes, refunds, disputes, acquisition, and native-store commissions. It is not profit. Three free readings cost an assumed $0.15–$0.45 per fully active free account before these other expenses. Include that free-user cost when evaluating paid conversion and acquisition. Do not promise unlimited personalized service or deepen the annual discount before measuring real usage.

**Current payment setup status:** the coordinator's October 10 Vercel Stripe integration attempt returned `action_required` with reason `integration_terms_acceptance_required`. The account owner must accept the integration terms before that setup can continue. This is a pending owner action, not evidence that Stripe rejected the business or that a category restriction was found. The research agent did not provision or verify a Stripe account.

Before accepting subscriptions, prove authenticated checkout, signed and idempotent webhook handling, server-controlled entitlements, persistent usage, renewal/reset behavior, cancellation, payment failure, and the customer portal. Test the actual prices and billing periods. A pricing page or deployment alone is insufficient evidence that payment processing works.

## Search and acquisition plan

Google's guidance favors original content that helps people, with clear authorship and useful substance. Auspice should compete through clear methods, original examples, and useful tools rather than a large collection of near-identical sign, city, or question pages. No ranking or traffic forecast is justified by this research. [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Publish an initial editorial library of approximately 12 substantive guides. This quantity is a planning recommendation, not a ranking requirement. Suggested groups:

- **Tarot:** how to ask a career question; a three-card reflection exercise; reading the suits and court cards.
- **I Ching:** casting and recording a reading; understanding changing lines; asking an open-ended question.
- **Feng shui:** bedroom layout considerations; desk placement and a usable workspace; questions to consider when visiting a potential home.
- **Astrology:** reading a birth chart; what birth time changes; understanding Sun, Moon, and rising signs without conflating them.

Each guide should explain the tradition, show a worked example, cite sources, state limits, identify actual authors/reviewers, record a meaningful update date, and link to the relevant free experience. Do not invent a reviewer or imply a practitioner reviewed content when they did not. Sources and asset/translation permissions require review before publication.

Technical implementation requirements:

- Give every public guide a stable URL, unique title and description, visible heading, canonical URL, accessible HTML, and mobile-friendly layout.
- Use real `<a href>` links with descriptive text; every important page should have an internal link. [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- Put preferred public canonical URLs in the sitemap, reference it from `robots.txt`, and submit it in Search Console once ownership is verified. Submission is a discovery hint, not a guarantee of indexing. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Use accurate JSON-LD only for relevant, visible content, such as articles, breadcrumbs, and application information. Never fabricate reviews or ratings. Validate applicable markup; correct markup does not guarantee rich results. [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Keep personal readings, journals, account routes, and private share previews out of search indexes and the public sitemap. Enforce authentication and per-user authorization: `noindex` and `robots.txt` are not privacy controls.
- Verify crawlability, rendered content, canonical URLs, sitemap routes, and mobile experience on the deployed production domain. Search Console access, indexing, performance, and rankings remain unverified until checked there.

Recommended acquisition sequence:

1. Release useful free experiences and the original guide library; measure whether visitors complete and save a first reflection.
2. Add previewable, opt-in share cards. Exclude birth information, addresses, personal questions, and journal text by default. Never publish private content automatically.
3. Offer optional weekly reflection emails with straightforward unsubscribe. Avoid pressure, streak penalties, and ominous notifications.
4. Pursue educational collaborations with identifiable practitioners and creators after there is a verifiable product to demonstrate. Outreach and publication are separate actions requiring their assigned scope.
5. Test paid acquisition only after retention and actual contribution support a bounded experiment. Set a budget from measured economics rather than assuming an industry acquisition cost.

The intended funnel is **public guide visit → first completed and saved reflection → return visit → subscription**. In the current app, completing a reading and saving it are one atomic operation, not separate conversion stages. Define events without collecting raw questions, birth data, or journal text into analytics. Track search impressions/clicks by landing page; completion and save rates; seven- and thirty-day return; trial-to-paid or free-to-paid conversion with explicit cohort windows; cancellations; paid renewal; delivered reading cost; support load; and acquisition cost per retained subscriber. Set numeric targets after an initial baseline rather than inventing market benchmarks.

The initial implemented measurement is deliberately narrower: daily public-guide view events and guide-to-sanctuary click events, with a [read-only operator report](../operations/guide-measurement.md). It collects no visitor identifier, so it cannot attribute a completed reading to a guide, count unique visitors, or establish retention or paid conversion. Evaluate the initial event counts as a directional editorial baseline, then decide whether further measurement is justified. Search Console ownership, human traffic and the broader funnel remain unverified.

## Evidence limits and release status

- Verified here: the linked public pricing, product patterns, Google guidance, published payment-fee benchmarks, and arithmetic based on labeled assumptions.
- Recommended here: positioning, price, allowance, editorial topics, acquisition sequence, and measurement definitions.
- Not established: Auspice demand, retention, conversion, acquisition cost, keyword volumes/difficulty, provider account rates, production payment success, or search rankings.
- Design-pack fidelity, working web/mobile/desktop experiences, identity management, live readings, deployment, and recovery must be verified by the implementation/release workstreams. This research is not evidence that those requirements are complete.
