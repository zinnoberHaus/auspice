# Auspice almanac launch strategy

**Launch Auspice around its useful free almanac: a real tarot draw, a more careful look at a home, and space to plan a meaningful day.** The supplied paper, ink and cinnabar design gives those activities a coherent identity, while clear method descriptions give people a reason to trust the experience. Lead the homepage and acquisition with guest tools because production account access is currently blocked; paid membership is not active. Retain **$11.99/month or $107.99 billed annually** as a pricing hypothesis, with a proposed **30 personal readings per month** and no promised improvement in depth, accuracy or memory. Build search discovery around a substantive `/free-tarot` page and the nine original guides, then spend the first month checking usability, answering real reader questions and establishing an honest measurement baseline. This report recommends actions and supplies publication drafts; it does not establish deployment, indexing, demand, or working payments. ([Product status](../README.md), [design boundaries](../docs/research/design-implementation.md), [pricing research](../research_notes/Auspice%20almanac%20launch%20strategy/pricing.md).)

Research reviewed October 10, 2026. The full [acquisition notes](../research_notes/Auspice%20almanac%20launch%20strategy/acquisition.md) contain the technical checklist, extended original page copy and source findings. No outreach or external publication was performed by this research.

## A useful first visit gives the almanac its purpose

The first audience hypothesis is a tarot-curious person who wants a short reflective exercise, with people considering a home or planning a milestone as adjacent audiences. This is a choice about focus, not a measured demographic or market-size claim. The proposition should be understandable before a visitor knows any terminology: **“A modern almanac for everyday reflection: draw a card, look at a home more closely, or make room for a meaningful day.”** Keep the individual traditions identifiable as the person explores. The product already distinguishes random upright tarot spreads, approximate sun-sign reflection, three-coin I Ching and entry-aligned feng shui from unsupported natal charts, scored properties or calculated auspicious dates. ([Method and interface mapping](../docs/research/design-implementation.md).)

The homepage should begin with the accepted headline, “A little perspective for your next chapter.” Follow it immediately with the concrete proposition. A primary **“Try free tarot”** action should lead to the working guest table; “Explore the guides” is a useful secondary action. Show a real, verified interaction or a clearly labeled interface illustration, then explain the simple progression from choosing a spread to revealing the cards and taking one question away. Below that, offer home comparison and date planning as practical activities. Describe drafts as unsaved, and disclose unavailable account features where a person would expect saving. The visual seal should remain brand identity rather than imply practitioner approval. These are recommended presentation choices based on the implemented tool boundaries, not evidence that the landing page has already passed a browser review. ([Guest table](../components/TarotTable.tsx), [planners](../components/AlmanacTools.tsx).)

The case for this positioning is the workflow, not a claim that multiple traditions or AI interpretation are unique. A sophisticated interface can attract curiosity, but recurring value depends on whether people find the question, interpretation and next step useful. CHANI, for example, advertises human-authored astrology and substantial continuing content at the same proposed monthly price; that is a different offer from an allowance of Auspice readings. Do not imply category parity from matching a price. ([CHANI pricing](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732281-App-Pricing), [CHANI content](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732421-Free-Premium-Content-In-the-App).)

## Keep Plus a narrow price hypothesis until it works

Retain the proposed price for a controlled test rather than changing it merely to create a launch discount. CHANI lists **$11.99/month and $107.99/year**, Co–Star lists **$8.99/month**, and The Pattern lists **$14.99/month and $83.99/year** in the reviewed US storefront evidence. These are advertised prices, not verified purchases or proof of Auspice willingness to pay. Labyrinthos lists several Premium SKUs, but its $9.99 and $89.99 entries do not state their billing intervals; those periods must remain unverified. ([CHANI](https://apps.apple.com/us/app/chani-your-astrology-guide/id1532791252), [Co–Star](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561), [The Pattern](https://apps.apple.com/us/app/the-pattern/id1071085727), [Labyrinthos](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220).)

The annual price is about **$9 per month equivalent**, paid as **$107.99 upfront**, or **24.94% less** than twelve $11.99 monthly payments. Say “about 25% less” and keep the full charge prominent. Do not imply that the annual offer is the cheapest in the category. The public package should remain deliberately narrower than the possible future depth, continuity and trial experiments described in the research notes.

| Offer | What can be said | What must remain explicit |
| --- | --- | --- |
| Guest tools | Free tarot table, practical home/date planners and original guides | No account required for the guest tools; spreads and planner drafts are unsaved |
| Free account | Three completed personal readings per calendar month and journal rights, when account access is usable | Production account access is temporarily unavailable; free allowance resets on the first of the month in UTC |
| Plus proposal | $11.99/month or $107.99 billed annually; proposed 30 personal readings per monthly allowance period | Not on sale; no guaranteed deeper output, exclusive synthesis, saved planner context or continuing memory |
| Legacy account price preference | The retained authenticated endpoint stores a signed-in account's plan preference; no interest form appears on the current pricing page | A preference is not consent to email, a notification signup, payment authorization or subscription |

The current pricing page has **no subscription, trial, email-waitlist or interest form**. The legacy interest component and authenticated endpoint remain in the repository, but the page does not render the component. That endpoint only stores a signed-in plan preference, not contact consent. If a preference control is exposed in a future release, explain that scope explicitly; guest visitors should still have an obvious working action. A possible seven-day preview or additional continuity feature is a future experiment, not a trial or entitlement to advertise now. ([Pricing page](../app/pricing/page.tsx), [legacy interest component](../app/pricing/interest.tsx), [product strategy](../docs/research/product-strategy.md).)

One submitted question and one completed personal interpretation should remain the unit. Synthesis counts as one reading; a new follow-up interpretation consumes another. Revisiting or annotating an existing result, exporting, and failed attempts do not. Paid allowance periods, annual monthly replenishment, cancellation, payment failure and entitlements must be implemented and verified before sale. Existing journal rights should survive cancellation. The public allowance difference is easy to explain, but whether it is sufficient to support a subscription remains an open commercial question. ([Allowance and billing recommendation](../docs/research/product-strategy.md).)

Cost evidence should decide whether the annual price remains viable. Using the published US domestic-card benchmark of 2.9% plus $0.30 and Billing at 0.7%, the illustrative fee formula is `charge × 0.036 + $0.30`. These are vendor benchmarks, not verified merchant rates. At full 30-reading usage, the following contribution remains after those named fees and hypothetical reading cost only. ([Stripe payments](https://stripe.com/en-us/pricing), [Stripe Billing](https://stripe.com/en-us/billing/pricing).)

| Hypothetical delivered reading cost | Monthly-plan contribution | Annual-plan monthly-equivalent contribution |
| --- | ---: | ---: |
| $0.05 | $9.76 | $7.15 |
| $0.15 | $6.76 | $4.15 |
| $0.30 | $2.26 | **−$0.35** |

These figures are **not profit**. They exclude free users, hosting, storage, email, support, taxes, refunds, disputes, acquisition and native-store fees. Measure successful output plus failures, retries and longer synthesis requests before widening annual sales or promising a larger allowance. A lower price should be tested against contribution and useful recurrence, not a higher interest-click count.

## Let one substantive tarot page earn discovery

The dedicated `/free-tarot` source now contains the actual guest table, practical instructions, spread descriptions, visible questions and answers, and related-guide links. This is a better search entry than a thin page redirecting into a query-selected sanctuary tab. Preserve clear static HTML around the interaction so a reader can understand the method without drawing a card. Google identifies useful interactive tools as main content and encourages original, audience-serving work; this supports the approach without implying any ranking forecast. ([Public page source](../app/free-tarot/page.tsx), [Google's content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).)

The page should answer a complete beginner's job: which spread to choose, how to reveal and revisit cards, how positions shape an interpretation, and what to do afterwards. Explain that the complete 78-card deck is used, cards are upright, a spread contains no repeat card, and the guest result is unsaved. Keep an ordinary next step central. A worked example can show how Strength prompts a question about patient courage, provided it is labeled as a teaching example and never represented as the visitor's draw. Existing guides on tarot questions, career reflection and journaling provide natural next reading. ([Guest method](../lib/traditions.ts), [editorial record](../docs/research/editorial-plan.md).)

Use a descriptive title such as **“Free Tarot Reading & Card Meanings | Auspice”**, with a distinct visible main heading. The homepage title can establish the brand as a modern almanac, while pricing should say “Free Tools & Planned Membership.” Descriptions should accurately summarize the individual page; Google can choose different title and snippet text. Match the social preview to that same promise rather than preserve the old journal-led metadata. ([Title guidance](https://developers.google.com/search/docs/appearance/title-link), [snippet guidance](https://developers.google.com/search/docs/appearance/snippet), [Open Graph specification](https://ogp.me/).)

Keep one preferred production URL consistent across page canonicals, ordinary internal links, social URLs and the sitemap. Add contextual links from the homepage and relevant guides, with meaningful anchor text. Account data remains protected by authentication and ownership checks, independent of search directives. Do not mass-index sanctuary variations or put private readings and personal input in public URLs. ([Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).)

Spend technical effort on crawlable content, correct metadata and usable mobile interactions. **FAQ rich results ended in May 2026**; retain Q&A for readers without presenting FAQ markup as a discovery feature. Google ignores sitemap priority/changefreq, so maintain meaningful dates and canonical URLs instead of tuning those values. Verify the final site in Search Console when the owner has access; a sitemap submission or successful live inspection does not guarantee indexing. ([Google update history](https://developers.google.com/search/updates), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en).)

## Use 30 days to verify, teach and listen

Day 1 is the start of the approved launch window. The calendar below is a work plan, not a growth forecast. External publication and outreach remain owner actions after the relevant guest experience is verified. If a browser or account-access gate stays blocked, continue the independent editorial work and record the limitation rather than declare the gate passed.

| Day | Specific deliverable |
| --- | --- |
| 1 | Record the current guest/account/payment availability matrix and remove unsupported claims. |
| 2 | Finish homepage, pricing and metadata copy around the working guest offer. |
| 3 | Complete the substantive free-tarot page and actual table integration. |
| 4 | Review the method, explanatory copy, source links and honest editorial identity. |
| 5 | Verify real mobile/desktop guest use, keyboard controls and failure states in a connected browser. |
| 6 | Check production HTML, canonical, robots, social metadata, internal links and sitemap. |
| 7 | Owner verifies Search Console, submits the sitemap and inspects representative public pages. |
| 8 | Owner publishes one verified guest-tool introduction on an existing channel. |
| 9 | Record actual questions and confusion from replies without sensitive personal details. |
| 10 | Owner shares a standalone question-framing exercise linked to the existing guide. |
| 11 | Invite up to three willing readers to describe their experience of the guest table. |
| 12 | Fix the clearest wording or usability issue revealed. |
| 13 | Prepare one captioned product demonstration with blank or synthetic input. |
| 14 | Review the first available Search Console evidence and production guide-event totals. |
| 15 | Share the practical home-viewing exercise in a suitable permissioned channel. |
| 16 | Invite one relevant educator or creator to critique the method presentation. |
| 17 | Improve an existing guide using an actual reader question. |
| 18 | Share date planning with its calculation limit; show export only after it is verified. |
| 19 | Check the free-tarot-to-guide journey, including use with collection blocked. |
| 20 | Publish an honest build note about turning almanac design into practical tools. |
| 21 | Review search page/query evidence and investigate crawl or snippet mismatches. |
| 22 | Gather a second small round of voluntary feedback about one unresolved task. |
| 23 | Improve the page section responsible for that confusion and record the reason. |
| 24 | Check account-access remediation with operations; retain restrictions if still unresolved. |
| 25 | Prepare an account announcement only after end-to-end identity/email verification; otherwise improve guest onboarding. |
| 26 | Review payment and entitlement readiness; retain proposed pricing until all gates pass. |
| 27 | Adapt the most useful exercise into a second format for the same intended audience. |
| 28 | Reinspect significant page changes and mobile usability; document pending indexing honestly. |
| 29 | Write a short learning memo separating observations, interpretations and missing evidence. |
| 30 | Choose the next focus from improving the guest page, deepening one guide, or validating account recurrence after unblock. |

The content below is original **ready-to-publish draft copy, not sent or published**. Use `/free-tarot` only once its production page and guest flow are verified. These messages assume an existing owned or permissioned channel, not an invented social presence or mailing list. Their product claims follow the current guest-method and availability records. ([Guest table](../components/TarotTable.tsx), [availability](../README.md).)

**Short introduction**

> Meet Auspice: a modern almanac for a little perspective. Draw free tarot cards, explore their meanings, and leave with a question to consider. No account needed; spreads are unsaved. Try it: https://auspice-red.vercel.app/free-tarot

**Educational post**

> Try changing “Will this work out?” to “What would help me prepare?”
>
> A question you can participate in gives a tarot exercise room to be useful. Our guide includes examples for work, relationships and everyday choices, while keeping interpretation separate from evidence.
>
> https://auspice-red.vercel.app/guides/better-tarot-questions

**Home-planner demonstration caption**

> Looking at a possible home? Start with what you can notice: light, noise, and how you would move through an ordinary day.
>
> Auspice's free home planner lets you compare up to three places, edit a viewing checklist and add a symbolic, entry-aligned note. No property scores or compass calculations. Your draft is unsaved.
>
> https://auspice-red.vercel.app/sanctuary?tool=homes

**Date-planner demonstration caption**

> Give a meaningful day a little room. Choose a date, name the occasion and write down what still needs arranging.
>
> Auspice's free date planner uses a real calendar. It does not calculate auspicious dates or rank good and bad days. Your draft is unsaved; calendar-file export is available in a browser.
>
> https://auspice-red.vercel.app/sanctuary?tool=dates

**Permissioned community feedback request**

> I work on Auspice, a reflection app with a free guest tarot table. I would value feedback on one thing: after revealing a card, is it clear what to do next?
>
> The exercise shows upright card meanings and spread positions. It needs no account, stays unsaved and makes no prediction promise. Account signup is temporarily unavailable; the guest table remains open.
>
> https://auspice-red.vercel.app/free-tarot

Use the last message only where the community's current rules permit promotion and identify the sender's real affiliation. The acquisition notes also provide a consented-audience newsletter and a personalized educator invitation; neither constitutes permission to contact anyone. Legacy account price-preference records are not an email list or contact consent.

The initial hypothesis is comprehension: can a willing reader explain what the guest table does, what is saved, and what it cannot establish? A small proposed study with **8–12 opt-in participants** can surface repeated confusion; its purpose is qualitative learning, not a market-demand percentage. Later account research can define activation as a completed saved reading within seven days and meaningful return as another saved reading or journal note on a different day within thirty days. Those are proposed definitions, not metrics supplied by the current collector. Any later numerical continuation threshold should be recorded as an operating choice and evaluated with its actual denominator.

Today's guide counters provide only daily guide-view and guide-to-sanctuary events. They do not identify people, attribute social channels, count guest draws, measure return, or demonstrate paid conversion; even their click/view ratio can exceed one. Search Console adds search impressions and clicks by the canonical page, not product completion. Keep the weekly report modest: observation window and environment, the available counts, actual reader questions, changes made and unknowns. Adding campaign parameters alone will not create attribution in the current system. ([Guide measurement](../docs/operations/guide-measurement.md), [Search Console definitions](https://support.google.com/webmasters/answer/7042828?hl=en).)

Guest distribution needs verified guest interactions and honest copy. Account promotion additionally needs working production identity and email flows. Membership requires verified checkout, entitlements, usage and billing lifecycle behavior. Paid acquisition should wait for measured costs, useful recurrence, an approved budget and stop conditions. Future event collection must answer a defined question and exclude personal questions, home observations, birth information and journal text. No traffic, ranking, conversion, acquisition-cost or renewal forecast is established by this work. ([Operational constraints](../docs/operations/deployment.md), [measurement boundary](../docs/operations/guide-measurement.md).)

## Conclusion

The almanac should become recognizable through a repeatable useful act, not through a larger number of claims. If people understand the tools but do not find a reason to return, the next investment belongs in usefulness and workflow rather than more pages or a cheaper subscription. Keeping the paid proposal narrow now preserves the freedom to learn that lesson without selling an unbuilt promise.

A first month can succeed by producing a trustworthy guest experience, a clear search entry and an honest account of what readers need next—even before account acquisition or subscription sales are possible. The decision to expand should follow that evidence, with source implementation, deployed behavior, search appearance and business results recorded as separate stages.
