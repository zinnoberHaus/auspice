# Auspice pricing and packaging

## What do current category prices and offers establish?

### Takeaway

Fresh primary-source checks on October 10, 2026 support a **$11.99/month and $107.99/year price hypothesis**, not evidence of Auspice demand. The closest competitors sell continuing interpretation, learning, and reflection; a paper almanac interface alone does not establish a paid advantage.

### Cited Findings

Prices below are advertised US storefront USD prices, not verified purchases. Available SKUs, trials, regional prices, taxes, and account-specific offers can differ.

| Product | Freshly observed price | Relevant offer, described by the vendor |
| --- | --- | --- |
| CHANI | $11.99/month; $107.99/year. Its help page describes a 14-day monthly-plan trial and 30-day annual-plan trial, each converting automatically, for new users. | Birth-chart interpretation, daily/weekly astrology, meditation and affirmation libraries, rituals and journal prompts. The listing emphasizes human astrologers and explicitly opposes AI. [Vendor pricing](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732281-App-Pricing), [US listing](https://apps.apple.com/us/app/chani-your-astrology-guide/id1532791252), [free/premium content](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732421-Free-Premium-Content-In-the-App). |
| Co–Star | Pro-Star $8.99/month; five questions $2.99, ten $4.99, 25 $6.99; Advanced Chart Self/Relationships $8.99 each; Your Year Ahead $11.99. | Daily horoscopes, friend-chart comparisons and additional question/report purchases. Its FAQ describes a combination of human work and natural-language AI. [US listing](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561), [vendor FAQ](https://www.costarastrology.com/faq/). |
| The Pattern | Go Deeper+ $14.99/month, $29.99/quarter, $83.99/year. | Personality, relationships, timing cycles and audio. Its current website also advertises In-Depth, a personalized AI conversation feature concerning self, family, relationships and work. [US listing](https://apps.apple.com/us/app/the-pattern/id1071085727), [vendor features](https://www.thepattern.com/app-features). |
| Labyrinthos | Premium $9.99 and $89.99 SKUs **without explicit billing intervals in the listing**; $24.99 explicitly labeled three months. Optional digital decks commonly $4.99; credits also listed. | Free readings and learning, custom spreads, a journal, meanings library, and personalized computer-generated interpretations. Its storefront advertises unlimited personalized readings, but this is the vendor's offer, not a cost model Auspice should copy. [US listing](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220). |

- Source conflict: Co–Star's FAQ says all revenue comes from à-la-carte purchases, while the current storefront explicitly lists Pro-Star monthly. Use the storefront for the observed subscription price, without declaring its FAQ current on this point. [FAQ](https://www.costarastrology.com/faq/), [storefront](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561).
- A historical Labyrinthos announcement calls Premium roughly $10 monthly and describes free journal storage limits. It does not establish the exact current interval of either unlabeled SKU; keep that uncertainty rather than silently interpreting $89.99 as annual. [Vendor announcements](https://feedback.labyrinthos.co/announcements).

### Inferences

- The verified monthly anchors of $8.99, $11.99 and $14.99 bound a plausible experiment; they do not establish that Auspice can charge the same as a mature editorial subscription. CHANI provides a direct price anchor but a materially different, human-authored proposition.
- The Pattern's $83.99 annual offer is about $7/month, below Auspice's proposed $9/month annual equivalent. Do not claim Auspice is the cheapest or universally better value. Co–Star's question packs also make raw answer volume a weak differentiator.
- Neither multiple traditions nor AI-assisted interpretation alone is a defensible uniqueness claim. Test the **workflow**: practical observations or a life question → clearly identified traditions → a considered interpretation → a private reflection to revisit.
- The supplied almanac design supports a quiet, tangible, repeatable practice. Position for English-speaking people reflecting on home, career and life transitions, rather than promising calculation accuracy, professional chart depth or future outcomes that the product does not supply.

### Gaps

- No purchases, logged-in paywalls, regional checkout tests, competitor revenue, retention or profitability were verified. Store ratings and vendor testimonials are not used as evidence of Auspice demand.
- Labyrinthos's exact $9.99/$89.99 periods remain unverified. Its help homepage failed to load through the research tool; no interval is inferred from price alone.

## What should Auspice offer and say at launch?

### Takeaway

Recommend **Free + Plus**, with all four traditions available in both. Keep the useful almanac entrance free; charge for a bounded volume of deeper work and implemented continuity. Current marketing should describe Plus as proposed and unavailable for purchase.

### Cited Findings

- The repository describes a public alpha with guest tarot spreads, approximate sun-sign reflection, three-coin I Ching, entry-aligned feng shui reflection, a journal, home-comparison notes and a date planner. It also records production signup blocked by the Auth provider's trusted-domain setting and membership as an interest list. These are repository status statements, not fresh production smoke-test evidence. [README at reviewed commit](https://github.com/zinnoberHaus/auspice/blob/c1054bf2187fe15554b5f1dff9ebd06f48d32608/README.md).
- The existing strategy proposes three free completed readings per calendar month, 30 Plus readings, and $11.99/$107.99. It records incomplete billing integration and explains that current anonymous guide counters cannot measure unique visitors, downstream activation or retention. [Existing strategy](https://github.com/zinnoberHaus/auspice/blob/c1054bf2187fe15554b5f1dff9ebd06f48d32608/docs/research/product-strategy.md).
- The documented design mapping distinguishes live methods and planning tools from prototype birth charts, scored homes and auspicious-date fixtures. Those fixture values are not evidence for marketing claims. [Design mapping](https://github.com/zinnoberHaus/auspice/blob/c1054bf2187fe15554b5f1dff9ebd06f48d32608/docs/research/design-implementation.md).

### Inferences

**Recommended package after implementation and verification:**

| Capability | Free | Plus — proposed |
| --- | --- | --- |
| Almanac, practice guides, guest tarot table | Available; operational abuse controls may apply | Same |
| Home observations, practical date planner and browser calendar export | Available; accurately disclose unsaved drafts | Same basic tools; saved planner continuity only after implemented |
| Traditions | Tarot, I Ching, approximate sun-sign reflection, entry-aligned feng shui; synthesis remains available | Same traditions, never marketed as more factually accurate |
| Completed personalized readings | 3 per calendar month, reset in UTC | 30 per monthly allowance period; annual subscribers replenish monthly |
| Depth | Clear symbols/method, interpretation and reflection prompt | Fuller comparison of perspectives and a practical reflection exercise; show a real preview of the difference |
| Continuity | Save/read existing results; private notes, export and delete | Revisit user-selected past context and compare reflections, with an explicit preview of material included |
| Ownership | Existing journal access and export remain available after cancellation | Same |

Use one submitted question plus one completed interpretation as the unit. Synthesis is one reading even when several traditions are included; budget its actual cost accordingly. A new follow-up interpretation consumes another unit. Reading saved results, writing notes, exporting and failed attempts consume none. Display balance before submission; retries remain idempotent. No rollover, automatic overage charge, credit packs or “unlimited” promise at launch. Paid-period reset semantics require implementation; do not imply the present free UTC counter already implements billing-anniversary periods.

**Price:** $11.99/month, or **$107.99 billed annually**. The latter is $8.999/month equivalent and **24.94%** below twelve monthly charges; consumer copy may say “about 25% less.” Show the full annual charge with equal prominence to the equivalent monthly amount. USD is an international reference, not a promise of local currency or tax-inclusive checkout. Avoid a steeper annual discount before costs are measured.

**Recommended launch offer, not live:** a one-time **seven-day preview with five completed Plus readings**, no payment card and no automatic conversion. Define five as the total preview allowance, not 30 per week; specify how the preview ledger interacts with the ordinary free allowance before implementation. End on Free unless the user deliberately purchases. Keep journal access. Start with a bounded research cohort rather than advertising invented scarcity. Do not offer lifetime discounts or a countdown without real terms and an implemented end date. Until this exists, show no trial CTA.

**Landing-page hierarchy:** (1) “A quiet almanac for the questions you’re living.” (2) Plain description: tarot, I Ching, astrology and feng shui for reflection. (3) Primary CTA to the functioning guest experience, such as “Draw a card”; secondary CTA to guides. (4) Show one real sample interaction and the home/date planning path. (5) Explain distinct methods and their limits. (6) Free/Plus comparison with proposed-price labeling. The visual seal is identity, not a practitioner credential. Keep personal profiles, scores, agreement percentages and chart fixtures out of screenshots presented as live capability.

**Current availability wording:** “Explore the free almanac. Plus is planned at $11.99/month or $107.99/year; subscriptions are not available yet.” Use an interest CTA only if it actually records interest and explains what happens next. Disclose the account availability issue beside account-dependent actions while it remains unresolved. Do not send users through a signup funnel known to fail.

**Paid launch prerequisites:** working production signup/verification and recovery; the advertised Plus difference; authenticated checkout; signed, idempotent webhooks; server-owned entitlements; monthly replenishment for annual subscribers; cancellation/customer portal; payment failure and refund behavior; allowance concurrency and deletion tests. This is the actual sellable-product gate, not a requirement to pause useful guest-tool marketing.

### Gaps

- No implemented paid entitlements, verified paid checkout, measured willingness to pay, usable production signup or live trial is established by this research.
- Saved planner context and deeper continuing readings are recommendations; do not present them as existing features. The current free result and a proposed Plus result need an honest, product-tested distinction before charging.

## What costs and experiments should determine the next decision?

### Takeaway

A 30-reading cap preserves room to learn, but the annual plan becomes unprofitable before overhead at $0.30 per fully delivered reading. Test comprehension, repeat use and real payment separately; an interest-list click is not a conversion forecast.

### Cited Findings

- Stripe's US standard online domestic-card fee is 2.9% + $0.30; Billing pay-as-you-go adds 0.7% of Billing volume. These are published benchmarks, not verified merchant-account rates. [Stripe US pricing](https://stripe.com/en-us/pricing), [Stripe Billing US pricing](https://stripe.com/en-us/billing/pricing).
- Published US surcharges include 1.5% for international cards and another 1% when currency conversion is required. These may change the international economics; local processing, tax and merchant arrangements require separate verification. [Stripe pricing](https://stripe.com/en-us/pricing).

### Inferences

**Scenario arithmetic, not observed delivery cost.** Use `fee = charge × 0.036 + $0.30`. Annual fees occur once and are divided by 12 below. Reading cost must include successful output, failed provider attempts, retries, validation and the longer synthesis/context cases.

| Monthly-equivalent scenario | $11.99 monthly | $107.99 annually |
| --- | ---: | ---: |
| Gross revenue | $11.99 | $9.00 |
| Card + Billing fee | $0.73 | $0.35 |
| After fees, before readings | $11.26 | $8.65 |
| 10 readings at hypothetical $0.05 each | $10.76 | $8.15 |
| 30 readings at hypothetical $0.05 each | $9.76 | $7.15 |
| 10 readings at hypothetical $0.15 each | $9.76 | $7.15 |
| 30 readings at hypothetical $0.15 each | $6.76 | $4.15 |
| 30 readings at hypothetical $0.30 each | $2.26 | **−$0.35** |

These are contributions after the named fees and reading expense only, **not profit**. Excluded: hosting, database/storage, email, support, taxes, refunds, chargebacks, acquisition, native-store commissions and free users. At full usage, reading-only break-even cost is $0.375/monthly-plan reading or $0.288/annual-plan reading, before every excluded expense. If both international surcharges apply, subtract another ~$0.30 per monthly payment or ~$0.225 per annual-plan month.

Three free readings cost $0.15/$0.45 per fully active free account at the two base assumptions. Five trial readings cost $0.25/$0.75 before overhead. At full paid and free usage, domestic fees and no other costs, paid share of active accounts would need to exceed roughly 1.51% at $0.05/reading or 6.24% at $0.15/reading merely to fund monthly-plan reading costs. This is algebra, **not a conversion benchmark**; annual mix and overhead raise the requirement. If trial and ordinary free quotas can both be consumed, add both costs.

**Proposed experiments and decision rules — all numbers below are operating choices, not industry benchmarks:**

1. **Now: comprehension before demand.** Show the actual guest flow and proposed package to 8–12 opt-in target participants, including people considering a move, a career change and another transition. Ask them to describe what the service does, distinguish the free draw from a saved interpretation, identify the full annual charge, and explain the limitations. Advance only after at least 8 of 10 can explain the package unaided; any repeated confusion about prediction, factual charts or live billing triggers a copy fix. Recruitment and contact are a future action, not performed here.
2. **After production auth works: activation and recurrence.** Observe the first 50 verified, consenting research accounts for 30 days. Define activation as a completed saved reading within seven days; define meaningful return as another saved reading or a journal note on a different day within 30 days. A proposed continuation gate is at least 20 activated accounts and at least 10 returning accounts. Small cohorts give directional evidence only; report counts and denominators, not statistical certainty. If comprehension passes but recurrence fails, test the workflow and usefulness before cutting price.
3. **Cost gate before paid acquisition or wider annual sales.** Record actual cost for at least 100 representative completed readings, including long-context synthesis and failed attempts. Model full 30-reading usage using measured upper-tail costs. Provisional target: positive contribution after attributable infrastructure/support, with at least $3/month of annual-plan contribution remaining in the conservative scenario. If it fails, improve delivery cost or revisit price/allowance before expanding. Do not quietly reduce existing buyers' benefits.
4. **First paid pilot: 30 payers and two monthly renewal opportunities.** Start with the single published price; track paid start, first successful result, support/refund requests and actual renewal. Suggested continuation floor: at least 18 of the first 30 monthly payers renew once, with positive measured contribution and no recurring billing confusion. Annual purchases do not count as monthly renewals. If the cohort is smaller, explicitly mark the decision inconclusive. No lifetime-value projection from the first month.
5. **Only then test price.** Compare $11.99 with $9.99 for the same monthly entitlement, keeping channels, copy, timing and annual presentation controlled. Predefine sample size from the observed conversion baseline and a worthwhile contribution difference; do not call a winner on a few purchases. Primary metric: 60-day contribution per eligible exposed account, including refunds and free/trial expense. Secondary: paid renewal and support load. At a conservative full-use $0.15 reading cost, $9.99 yields $4.83 after fees/readings versus $6.76 at $11.99; it needs approximately **40% more paying accounts** just to equal that contribution before retention/overhead differences. Price reductions therefore need evidence, not a higher click rate alone.

Keep the current identifier-free guide events as editorial direction. To run the later account/renewal experiments, explicitly design the necessary first-party operational measurement, retention limits and privacy disclosures; avoid copying questions, addresses, birth dates or journal text into analytics. Existing guide event counts cannot furnish these cohort metrics.

### Gaps

- Actual generation cost distribution, synthesis cost, failure/retry expense, storage/support allocation, demand, retention, conversion, acquisition cost, refund rates and tax treatment are unknown.
- Proposed thresholds are a small-pilot management policy, not a forecast or proof of product-market fit. No participant recruitment, outreach, account creation, payment, production mutation or live checkout test occurred in this task.
