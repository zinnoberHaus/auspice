# Auspice almanac acquisition and SEO

Research checked October 10, 2026. Scope: an actionable launch recommendation, not evidence of demand, indexing, or a completed release. Product observations below refer to the local working tree inspected on this date; concurrent implementation may subsequently change them. No messages were sent, no accounts were created, and nothing was published by this research task.

## 1. Which SEO changes should ship with the almanac launch?

### Takeaway

Give the working guest experience an indexable public entry page and make the homepage, pricing, and search/social descriptions tell the same truthful story. Prioritize accessible content, an obvious useful action, and verified crawlability over additional schema or large numbers of thin pages.

### Cited Findings

- The present sanctuary has `noindex, nofollow`, is disallowed in robots, and contains the guest tools behind `?tool=` selections. The public sitemap includes the homepage, pricing, guides, download, legal pages, and nine guide articles, but no dedicated free-tool page. These are source observations, not an inspection of Google's index. [Sanctuary route](../../app/sanctuary/page.tsx), [robots](../../app/robots.ts), [sitemap](../../app/sitemap.ts).
- Current global metadata still describes a quiet reading space and private journal. The pricing page offers a free-account CTA; its interest button calls an authenticated endpoint and points anonymous visitors to sign-in. Production signup is documented as blocked, and billing is inactive. [Metadata](../../app/layout.tsx), [pricing](../../app/pricing/page.tsx), [interest component](../../app/pricing/interest.tsx), [release status](../../README.md).
- Google includes functional interactive tools among the main content that can fulfill a page's purpose. Its guidance emphasizes original usefulness, accurate authorship, and satisfying the intended audience; it rejects fabricated expertise. [People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- Google recommends concise, descriptive, distinct titles and a clear main heading. It can construct a different search title using page headings, `og:title`, or other signals. There is no fixed title-character limit; display truncation depends on available width. [Title links](https://developers.google.com/search/docs/appearance/title-link).
- Search snippets usually come from page content; a relevant meta description may be used instead. Descriptions should be specific to their pages. Google does not prescribe a universal description-character limit. [Snippets](https://developers.google.com/search/docs/appearance/snippet).
- Google can render JavaScript, but server-rendered or pre-rendered content remains useful for users and crawlers, including bots that do not execute JavaScript. Blocked pages and files are not rendered by Google Search. [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Crawlable links normally need an anchor with an `href`; important pages should have an internal link from another page, with useful descriptive text. [Link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- Self-referencing canonicals, internal links, redirects where appropriate, and sitemap URLs should agree. Canonical declarations express a preference, not a guarantee that Google selects that URL. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- Google ignores sitemap `priority` and `changefreq`. Accurate `lastmod` can describe a significant update, while submitting a sitemap is only a discovery hint. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- A robots-disallowed URL may still appear in results without its content; Google cannot observe `noindex` on a blocked page. Authentication must protect private data regardless of search directives. [Noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [private application controls](../../README.md).
- Structured data must represent relevant visible content and cannot contain invented reviews. Eligibility and valid markup do not guarantee a rich result. [Structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- **Current correction to older SEO advice:** Google stopped showing FAQ rich results on May 7, 2026 and removed the feature documentation on June 15. The former FAQ documentation now redirects to the update history. [Google's May 8 and June 15 changelog entries](https://developers.google.com/search/updates).
- Open Graph defines the basic title, type, image, and URL properties, with a description and image alternative text among the useful additional properties. This is share-preview metadata, not a promised Google ranking improvement. [Open Graph specification](https://ogp.me/).
- Google's page-experience guidance covers mobile usability, secure access, unobstructed main content, and Core Web Vitals. A high audit score does not guarantee rankings. [Page experience](https://developers.google.com/search/docs/appearance/page-experience).

### Inferences

The following is the proposed implementation order, not a claim that these changes are already shipped.

| Priority | Concrete change | Acceptance evidence |
| --- | --- | --- |
| P0 | Publish `/free-tarot` as a substantive server-rendered explanation plus the actual guest card table. Keep private reading/journal flows separate. | Anonymous production HTTP 200; unique heading, explanation, canonical and metadata in HTML; actual draw/reveal/error flow verified in a connected browser. |
| P0 | Replace the homepage's leading account promise with guest tarot, home comparison, and date planning. Include one primary free-tarot CTA and secondary guide link. | All primary CTAs end at usable guest experiences. Account availability is disclosed near any account-feature offer. |
| P0 | Split pricing into **Guest tools: free now**, **Account features: temporarily unavailable**, and **Plus: proposed, not on sale**. | No checkout, active-subscription, anonymous-waitlist, or email-notification promise without a verified working flow. No need to create an account to reach guest tools. |
| P0 | Add the free-tarot route to the sitemap and ordinary navigation. Add contextual links from the two tarot guides and journal exercise. | Links resolve to the intended canonical page; no client-only click handler is the sole navigation route. |
| P0 | Align the homepage, pricing, free-tarot page, layout fallback metadata and social images with the almanac identity. | Each rendered title/description matches the actual page; absolute canonical and OG URL resolve to the selected production origin; no preview hostname or personal data appears. |
| P1 | Review search exclusion deliberately. Private data keeps authentication and ownership checks. Public account/sanctuary shells can expose `noindex` to crawlers if removal from results is desired. | No blanket indexing of sanctuary query variants; no privacy claim based on robots. Any robots change gets an auth/privacy review. |
| P1 | Remove meaningless sitemap prioritization if convenient; add maintained, meaningful modification dates when available. | Dates reflect content changes, not every build or the current day. Legal and download pages can remain discoverable but are not acquisition priorities. |
| P1 | Preserve existing Article/BreadcrumbList guide markup. Use only suitable, truthful page/site markup on new pages. | Schema matches visible facts; no AggregateRating, Review, unavailable paid Offer, or FAQ-rich-result claim. |
| P1 | Verify Search Console ownership, submit the final sitemap, and inspect representative public pages. | Record actual property, inspection date, Google-selected canonical, fetch/render result, and sitemap processing status. Keep “submitted,” “crawlable,” and “indexed” separate. |
| P2 | Optimize genuine mobile friction: readable type, card controls, focus, layout stability, and appropriate font loading. | Connected-browser checks and performance evidence. Do not treat a build or HTTP probe as visual verification. |

Suggested metadata copy, subject to the actual shipped page:

| Page | Title | Description |
| --- | --- | --- |
| Home | `Auspice — A Modern Almanac for Everyday Reflection` | `Draw free tarot cards, compare homes, and make space for the days ahead. Explore practical guides in a quiet, paper-and-ink almanac.` |
| Free tarot | `Free Tarot Reading & Card Meanings | Auspice` | `Draw one card, three cards, or a Celtic Cross. Explore upright card meanings and reflection prompts for free, without an account. Your spread is not saved.` |
| Pricing | `Free Tools & Planned Membership | Auspice` | `Explore Auspice's free guest tools and proposed Plus membership. New account access is temporarily unavailable, and paid membership is not on sale.` |

Use the same honest page proposition in social titles. Create a restrained paper/ink/cinnabar image with the seal, page title and a real tool depiction or clearly labeled illustration. Do not place a person's questions, notes, birth information, home details, invented review score, or prototype personal profile in it. A practical production format is a 1200×630 image; that size is a design recommendation, not a universal protocol requirement.

### Gaps

- Search Console ownership, submitted sitemap history, indexing, search queries, rankings, Core Web Vitals field data, and existing backlinks were not accessible in this research. No organic-traffic baseline or keyword-volume/difficulty claim is justified.
- `/free-tarot` is a proposal at the time of this source review. The implementation workstream must verify the deployed result before anyone publishes a link to it.
- Rendered mobile/desktop verification is recorded as pending in the local design evidence. Source review cannot establish the visual quality or usability of the live experience. [Design verification record](../../docs/research/design-implementation.md).
- The final custom domain, if any, has not been supplied. Use the actual canonical production hostname consistently now; do not invent a future branded domain.

## 2. Who should the launch serve, and what should the free-tarot page provide?

### Takeaway

Position Auspice as a modern almanac for people who want a useful pause: a real card draw, a better question, and an ordinary next step. Start with tarot-curious reflective beginners; use the home and date planners as adjacent practical reasons to return, without presenting them as property assessment or auspicious-date calculation.

### Cited Findings

- The imported design establishes paper, ink, cinnabar, editorial typography, a real local calendar, guest card spreads, and practical home/date planners. It explicitly excludes prototype profiles, manufactured scores, full natal calculations, and auspicious dates. [Design implementation record](../../docs/research/design-implementation.md).
- The guest table offers one-card, three-card, and ten-card Celtic Cross spreads; cards are upright, not repeated within a spread, and unsaved. Its personal-reading flow is separate. These are implementation facts, not claims of predictive validity or live browser verification. [Guest table](../../components/TarotTable.tsx), [draw handler](../../app/api/draw/route.ts), [draw method](../../lib/traditions.ts).
- Home drafts hold real observations, an editable checklist, and symbolic entry-aligned notes. Date drafts hold the selected civil date, event and intention; browser calendar export and transfer to a reading are explicit. Drafts are not account-synced. [Planner implementation](../../components/AlmanacTools.tsx), [calendar/context helper](../../lib/almanac-planning.ts).
- Nine original guides already cover workable tarot questions, a career spread, I Ching casting/questions, home viewing/bedroom layout, limited astrology, and reflection journaling. Their organizational byline is Auspice Editorial, without a practitioner-review claim. [Editorial plan](../../docs/research/editorial-plan.md).
- The existing business recommendation is Free plus proposed USD $11.99/month or $107.99/year membership. It is a pricing hypothesis, with payment-readiness conditions and no evidence of willingness to pay. This task did not revalidate competitor prices or recommend a new paid offer. [Product strategy](../../docs/research/product-strategy.md).

### Inferences

All audiences, search intentions and channel choices below are hypotheses to validate. They are not measured audience segments or keyword-demand findings.

| Audience and job | Useful entry | Distinct promise | First outcome to observe |
| --- | --- | --- | --- |
| Tarot-curious beginner wanting a short reflective exercise | `/free-tarot`, better-questions guide | Clear spreads and readable meanings, without an account or outcome guarantee | Can reveal a spread and name one useful question in their own words |
| Someone at a work or everyday-life crossroads who already journals | Career-reflection and journal guides | Separate the drawn symbol, personal interpretation and a practical next step | Can choose a small, reversible action without treating the draw as evidence |
| Someone comparing places to live | Home-viewing guide → home planner | Compare light, noise and daily fit, with an optional symbolic lens | Enters their own observations and identifies a question for the next viewing |
| Someone organizing a move or meaningful event | Date planner demonstration → guest planner | A real calendar and intention, without fabricated good/bad-date scores | Chooses a date and writes an actual preparation note |

Use the first audience for the launch headline and initial distribution. Keep the other jobs visible lower on the homepage rather than making one hero promise five equally weighted products. Avoid an audience defined by crisis, urgent certainty, medical outcomes, investment returns, or supernatural threat.

Proposed positioning sentence:

> A modern almanac for everyday reflection: draw a card, look at a home more closely, or make room for a meaningful day.

Proposed homepage sequence:

1. **Hero:** “A little perspective for the day ahead.” Follow immediately with the concrete positioning sentence. Primary action: “Try free tarot.” Secondary: “Explore the guides.” Add “No account needed for guest tools.”
2. **An actual moment of use:** a real card-table demonstration or clearly labeled interface preview, with three short steps: choose a spread, reveal the cards, take one question with you. Do not display a predetermined card as the visitor's personal draw.
3. **Life beyond the card table:** two grounded tool stories—“Compare what you notice in a home” and “Plan a meaningful day.” Describe drafts as unsaved; make the date-calculation limit visible.
4. **Read the method:** link the relevant original guides, explain upright draws and symbolic reflection, and identify the actual editorial organization.
5. **Availability:** a concise separation between working guest tools, temporarily unavailable new-account access, and proposed membership. Avoid a blocked signup as the final CTA.

#### One substantive search page: `/free-tarot`

The intent hypothesis is “I want a free tarot draw and enough guidance to understand what to do with it.” Use one durable page to answer that whole job. Do not create separate nearly identical pages for each day, zodiac sign, city, or question.

- **H1:** “Free tarot cards, room to reflect.”
- **Hero explanation:** “Choose one card, a three-card spread, or a Celtic Cross. Turn the cards at your own pace and explore their meanings. No account needed; this spread is not saved.”
- **Actual tool near the top:** reuse the existing guest draw/reveal behavior. Preserve accessible names, errors, busy states and keyboard controls. If the table has its own H1, adapt the heading level or surrounding hierarchy rather than render two competing main titles.
- **Server-rendered supporting sections:** the original copy below; spread-position table; a worked example; four direct questions with answers; links to the two tarot guides and reflection journal guide. Keep this useful information present without requiring a draw or account.
- **Method disclosure:** complete 78-card deck, upright draws, no duplicate within one spread, meanings as original reflection prompts; avoid suggesting historical authenticity for every interface position or treating the output as a personal prediction.
- **Boundaries:** the free table is separate from a saved personal interpretation; no automatic save or export is promised. Explain current account availability only where a user would otherwise expect saving.
- **Editorial:** credit Auspice Editorial accurately, link to the relevant method/source material, and date substantive revisions honestly.

Original draft supporting copy, for editorial review rather than automatic publication:

> **Choose the amount of space you need.**
>
> One card is a small place to begin. Hold a question in mind, reveal the card, and notice a word or image that catches your attention. You do not need to agree with it. A useful reflection can begin with “That does not fit—what is missing?”
>
> Three cards give you a little structure: situation, perspective, and next step. Read each card in its position before trying to connect the whole spread. The first can help you describe the question, the second can suggest another way to look, and the third can invite a practical response. Those are prompts, not instructions you have to follow.
>
> The ten-card Celtic Cross offers more positions to explore. More cards do not make an answer more certain. Choose it when you have time to consider several aspects of a question, and return to the positions that feel relevant rather than forcing every detail into a single story.
>
> **Ask a question you can participate in.**
>
> Instead of asking whether a new role will work out, try “What would help me prepare for this change?” Instead of asking what another person secretly thinks, try “What do I need to communicate or clarify?” An open question gives you something you can investigate through conversation, observation, or a small action.
>
> **Turn a symbol into one ordinary next step.**
>
> Here is an invented teaching example, not your draw. Suppose Strength appears while you are thinking about a difficult conversation. You might notice the idea of patient courage and ask where firmness and kindness could sit together. A next step could be writing down the one thing you need to say, then choosing a calm time to discuss it. The card does not establish what the other person will do.
>
> Keep three things separate: what the card says, what you associate with it, and what you actually know about the situation. If an interpretation conflicts with evidence, do not discard the evidence. You can leave a card unresolved or decide that the exercise is not useful today.
>
> **What is free, and what is saved?**
>
> This table offers free guest draws with card meanings and reflection prompts. You can explore without creating an account. The spread is an unsaved draft; leaving or refreshing the page clears it. A saved personal reading is a separate experience and draws its own cards. New account access is temporarily unavailable.
>
> **What can a tarot reading tell me?**
>
> Auspice uses tarot as a symbolic reflection practice. It cannot establish facts about the future or another person's private thoughts. For a consequential decision, bring the exercise back to evidence, the people involved, and appropriate professional advice. A helpful result may be a clearer question rather than an answer.

The Strength example develops the product's own existing prompt; it must remain labeled as a teaching example and must never be injected as the visitor's result. [Original Strength prompt](../../lib/traditions.ts).

Suggested visible Q&A, without an FAQ-rich-result promise: “Do I need an account?”, “Are reversed cards included?”, “Will my spread be saved?”, and “Is this a prediction?” Their answers should be the actual product limits, not keyword variations.

### Gaps

- No interviews, audience-size estimates, search-demand data, conversion evidence, or user preference tests support these segments yet. They are deliberately narrow launch hypotheses.
- Ownership and existing audiences for X, Instagram, email, Pinterest, creator communities, or other channels were not established. Prepare assets for an actual owned or permissioned channel; do not create the impression that those channels already exist.
- A guest-visible newsletter/waitlist does not currently follow from the authenticated Plus-interest control. Do not advertise “we will email you” based on that control. [Current interest flow](../../app/pricing/interest.tsx).

## 3. What should the first 30 days produce, and how should results be measured?

### Takeaway

Run a small editorial launch around one useful guest page and the existing guides. Treat the first month as evidence gathering: verified functionality, search discovery, real reader questions, and qualified feedback—not a promised subscriber or ranking target.

### Cited Findings

- Current measurement counts public-guide `view` and `open_sanctuary` events by UTC day and allowlisted guide slug. It does not cover homepage, pricing, sanctuary, guest draws, or the proposed free-tarot page; it stores no visitor identifier or referrer. Repeat activity, bots, blocked requests, saturation and collection failure affect totals, and click/view ratios can exceed one. [Measurement runbook](../../docs/operations/guide-measurement.md).
- The current reporter can query a bounded 1–90-day window; selecting the intended production environment matters because local development, preview and production are isolated. Reading the CLI's defaults as production traffic would be incorrect. [Measurement runbook](../../docs/operations/guide-measurement.md), [deployment configuration](../../docs/operations/deployment.md).
- Search Console reports impressions, clicks and other search-performance dimensions; most data for URL variants is assigned to Google's chosen canonical. These metrics are not unique users or product completions. [Google performance definitions](https://support.google.com/webmasters/answer/7042828?hl=en).
- A URL-prefix Search Console property scopes the complete URL prefix, including protocol; adding a property requires a verification method. This fits the currently supplied public origin without asserting control over the platform's parent domain. [Search Console property setup](https://support.google.com/webmasters/answer/34592?hl=en).
- URL Inspection can examine an indexed URL and test current accessibility; a successful live test or indexing request does not guarantee indexing or appearance. [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en).
- Paid plans are not active and new-account access remains blocked. Browser rendering is separately unverified in the design record. These conditions constrain which acquisition claims and experiments are appropriate now. [README](../../README.md), [design verification](../../docs/research/design-implementation.md).

### Inferences

#### Thirty-day calendar

Day 1 means the first day of the approved implementation/launch window. External distribution rows are drafts for the owner to execute only after their stated gates pass. This research authorizes no sending or publication. Numeric activity counts below are manageable work allocations, not growth benchmarks.

| Day | Action and concrete deliverable | Evidence or gate |
| --- | --- | --- |
| 1 | Record the guest/account/payment availability matrix and a screenshot-free copy inventory. | Remove unsupported claims before promoting them. |
| 2 | Complete homepage, pricing and site metadata revisions. | Every CTA matches a working or explicitly unavailable state. |
| 3 | Build the dedicated free-tarot page and its original supporting content. | No thin redirect-only landing page. |
| 4 | Review methods, source links, spread copy, byline and teaching example. | No fabricated result, historical authority, review, or prediction. |
| 5 | Verify mobile/desktop use, keyboard operation, errors and guest draw behavior. | A connected-browser pass is required; a build is insufficient. |
| 6 | Verify public HTML, canonical, robots, social metadata, sitemap and internal links. | Production origin and status codes recorded. |
| 7 | Owner verifies Search Console property and submits sitemap; inspect home and free-tarot page. | Record real outcomes, including unavailable/pending states. |
| 8 | Owner publishes one introduction on an established channel using message A or B below. | Free-tarot URL actually live and guest flow verified. |
| 9 | Record questions and confusion from replies in a short anonymized issue list. | No personal questions or birth/home data copied into analytics. |
| 10 | Owner publishes the short “a better tarot question” exercise, linking the existing guide. | Educational value stands alone without visiting the app. |
| 11 | Owner invites up to three willing readers to try the guest table and describe friction. | Voluntary feedback; do not script praise or invent testimonials. |
| 12 | Fix the clearest usability or wording issue discovered. | Document what changed and why. |
| 13 | Prepare one real interface demonstration with synthetic or blank input and captions. | No private account, journal, or home details in the asset. |
| 14 | Read the first seven days of guide totals and available Search Console results. | Report counts, missing data, and observation dates—not conversion. |
| 15 | Owner shares the home-viewing checklist via an appropriate existing audience. | Explain that it compares observations, not property scores. |
| 16 | Owner invites one relevant educator/creator to critique the method presentation. | Clear affiliation; no request for a guaranteed link or favorable review. |
| 17 | Improve an existing guide using one actual reader question. | Substantive edit and accurate revision date. |
| 18 | Owner shares the date-planning demonstration and explicit calculation limit. | Browser export verified if shown; no auspicious-date claim. |
| 19 | Test the journey between the tarot page and the two related tarot guides. | Links remain useful with analytics blocked. |
| 20 | Owner posts one honest build note about translating almanac design into practical tools. | No invented usage, results or design-fidelity claims. |
| 21 | Review page/query search evidence and cumulative guide activity. | Investigate mismatched snippets or broken pages before changing strategy. |
| 22 | Conduct a small second round of willing-reader feedback around one unresolved task. | Keep raw sensitive details out of the shared report. |
| 23 | Improve the free-tarot page's most confusing section from that feedback. | Preserve a change log and the reason for each edit. |
| 24 | Check the account-access gate with the operations owner. | If still blocked, keep guest-first copy; do not announce account launch. |
| 25 | If account access is verified end to end, prepare a separate truthful account announcement; otherwise refine guest onboarding. | Verification includes real email delivery and identity flows, not only local fixtures. |
| 26 | Review paid-plan readiness separately. | Without verified checkout, entitlements, billing lifecycle and terms, keep prices proposed and take no payment. |
| 27 | Owner republishes the most useful exercise in a new format for the same intended audience. | Use an original example; avoid repetitive community posting. |
| 28 | Inspect search indexing/canonicals and mobile usability again after meaningful changes. | Record pending indexing without repeatedly treating requests as guarantees. |
| 29 | Write a one-page learning memo: useful tasks, confusing claims, search discovery, missing evidence. | Separate observations, interpretations, and decisions. |
| 30 | Choose the next four-week focus: improve this page, deepen one guide, or validate account adoption after unblock. | No scaled SEO or paid-acquisition expansion without an evidential reason. |

#### Ready-to-use channel messages

These are original drafts, not sent messages. Product claims derive from the implementation cited above. Use the proposed `/free-tarot` links only after that page is deployed and verified; before then, the existing guest destination is `https://auspice-red.vercel.app/sanctuary?tool=tarot`. Do not imply a drafted asset has already been published.

**A. Short social post**

> Meet Auspice: a modern almanac for a little perspective. Draw free tarot cards, explore their meanings, and leave with a question to consider. No account needed; spreads are unsaved. Try it: https://auspice-red.vercel.app/free-tarot

**B. Instagram caption or owned-community introduction**

> A card, a question, a little room to think.
>
> Auspice is a paper-and-ink almanac for everyday reflection. Choose one card, three cards, or a Celtic Cross; reveal each card and explore its meaning at your own pace.
>
> The guest table is free and does not require an account. It is an unsaved exercise, not a prediction. Try asking: “What deserves my attention, and what small step could I take?”
>
> https://auspice-red.vercel.app/free-tarot

Pair with an actual product capture after browser verification. Do not add “link in bio” unless the owner has actually configured that link.

**C. Educational post linking an existing guide**

> Try changing “Will this work out?” to “What would help me prepare?”
>
> A question you can participate in often gives a tarot exercise more room to be useful. Our guide includes examples for work, relationships, and everyday choices—and explains where interpretation stops and evidence begins.
>
> https://auspice-red.vercel.app/guides/better-tarot-questions

**D. Community feedback request, only where local rules permit it**

> I work on Auspice, a reflection app with a free guest tarot table. We have made the draw, upright card meanings, and spread positions visible, and kept the exercise unsaved and separate from a personal reading.
>
> I would value feedback on one thing: after revealing a card, is it clear what to do next? The tool is here: https://auspice-red.vercel.app/free-tarot
>
> Account signup is temporarily unavailable; the guest table does not require it. I am sharing as the maker, not as an independent reviewer.

Do not post this unchanged into multiple communities. Read each community's current rules and respond to actual discussion before considering a product link.

**E. Optional newsletter to an existing, consented audience**

> **Subject:** A small tarot exercise for the week ahead
>
> What would you like to make a little more room for this week?
>
> Auspice's free card table offers a quiet way to sit with that question. Choose a one-card or three-card spread, turn the cards, and note one practical action you could try. No account is needed, and your guest spread is not saved.
>
> Try the exercise: https://auspice-red.vercel.app/free-tarot
>
> You can also explore the home and date planners as unsaved drafts. New-account access is temporarily unavailable, and paid membership is not on sale.

Send only through a verified existing email channel with its working unsubscribe mechanism. This draft is not an instruction to create a mailing list, contact users, or email Plus-interest records.

**F. Creator/educator review invitation**

> **Subject:** Could you critique our beginner tarot exercise?
>
> Hello [name],
>
> I work on Auspice, a modern almanac for reflection. Your [specific piece, read by the sender] made me think you might have a useful perspective on our free guest tarot table.
>
> It shows upright card meanings and spread positions, without an account or a promise of prediction. I would value a critique of whether our method and limits are clear to a beginner: https://auspice-red.vercel.app/free-tarot
>
> There is no expectation of a post or endorsement. If this is outside your interests, no reply is needed.
>
> [Actual sender name and affiliation]

Personalize only from an actual source the sender has read. No payment, reciprocal link, practitioner approval, or prior relationship is implied.

#### Measurement and decision rules

| Question | Evidence available now or prerequisite | Interpretation boundary |
| --- | --- | --- |
| Can people discover public pages through Google? | Verified Search Console property; impressions/clicks by canonical page and query, where available | Search visibility, not visitors retained or product value established |
| Which guides are being opened and which tool links are used? | Existing daily guide-event report, explicitly pointed at production | Events, not unique people; ratios are directional and may exceed one |
| Do people complete a guest draw? | Not measured by the current collector; use voluntary observed usability sessions initially | Do not infer this from guide clicks, server requests, or page indexing |
| Which social channel sends useful traffic? | No current referrer/channel collection; use platform-native aggregate link data if the owner has access and label its limits | Campaign parameters alone do not create attribution; adding UTMs would not make the existing guide collector record them |
| Do readers return after seven or thirty days? | No supported person/cohort identity in the current measurement | Unknown; no retention percentage can be computed from daily counts |
| Do people create accounts and save readings? | Fix trusted-domain access, verify identity/email and account flows, then define a suitable measurement design | Account completion and saved readings cannot be inferred from the guest funnel |
| Does membership convert or retain? | Active verified billing and lifecycle evidence, followed by an appropriate measurement window | Unknown while billing is inactive; interest is not revenue or a subscription |

Minimal weekly record: observation window and environment; guide events by slug; available Search Console page/query counts; indexing or crawl issues; number of volunteered feedback conversations; the concrete usability questions reported; what changed; what remains unknown. Keep authentic feedback separate from invented sample copy and do not publish quotes without authorization.

Decision recommendations:

- **Guest-launch gate:** verified production guest interactions, accurate copy, resolved serious accessibility/usability defects, and public metadata/crawl checks. A signup fix is not required to distribute a clearly labeled guest tool.
- **Account-promotion gate:** trusted-domain correction plus verified end-to-end identity/email/account experience. When the gate passes, update copy and evidence together rather than merely removing the warning.
- **Membership gate:** verified payments, entitlement and quota enforcement, renewal/cancellation/failure behavior, terms and support. Until then, present proposed pricing without purchase or unavailable notification promises.
- **Editorial expansion gate:** an actual reader question, repeated usability problem, or relevant observed search intent that the existing pages do not answer. Improve an existing page when that would serve the reader better than a new URL.
- **Paid-acquisition gate:** verified conversion path, measured service costs and retention, a separately approved budget, and explicit stop conditions. Set no invented CPA, ROAS, traffic or ranking target in the first month.
- **Measurement extension gate:** state the question first. A future fixed-schema anonymous guest-completion counter could answer event-volume questions, but cannot establish unique-person conversion or retention. Review collection/privacy scope before adding it; do not log questions, home observations, dates of birth, journal content, or arbitrary URL/query strings.

### Gaps

- There is no supportable acquisition forecast, first-month traffic goal, signup rate, retention rate, CAC, paid renewal figure, or attributable revenue in the evidence reviewed. The calendar specifies work, not expected growth.
- Search Console setup, external posting, outreach, newsletter sending, and paid promotion were not performed. They require the actual owner's channel access and separately authorized execution.
- Production data was not queried during this task. Empty or absent report output would not prove that no humans visited; that result must be described using the collector's documented limits.
- The blocked new-account path and inactive billing remain operational gates until the implementation/operations owner supplies new evidence. This document does not change those states.
