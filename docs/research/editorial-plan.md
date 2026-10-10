# Guide library editorial record

Date: October 10, 2026; revised for the supplied almanac launch. Author identity shown publicly on guides: **Auspice Editorial**, an organizational byline. No practitioner review or endorsement is claimed. See the [launch strategy report](../../reports/Auspice%20almanac%20launch%20strategy.md) for the current 30-day sequence and prepared, unsent channel copy.

## Implemented content

Nine original guides live in `lib/guides.ts`. The index and article pages are server components under `app/guides/`. Each article contains four substantive sections, an exercise or worked example, supporting source links, a tradition-specific sanctuary link, and related reading. Body lengths at creation are 411–437 words. Content is written for the question at hand rather than generated from a repeated sign/location template.

| Public route | Reader outcome |
| --- | --- |
| `/guides/tarot-career-reflection` | Separate a career question into three reflection positions and choose a reversible experiment. |
| `/guides/better-tarot-questions` | Form a focused question about the reader's own participation and distinguish observation from interpretation. |
| `/guides/i-ching-three-coin-method` | Record six line values bottom-to-top and transform changing lines without confusing the original cast. |
| `/guides/i-ching-questions` | Record context and a clear question, then revisit the reading at a meaningful review point. |
| `/guides/feng-shui-bedroom-layout` | Compare a feasible room arrangement with a stated intention and ordinary usability constraints. |
| `/guides/feng-shui-house-viewing` | Separate observations, impressions, and unknowns while identifying practical home needs. |
| `/guides/understanding-your-sun-sign` | Distinguish tropical signs from constellations and reflect without treating a sign as a fixed identity. |
| `/guides/astrology-unknown-birth-time` | Preserve uncertainty in birth data and recognize the limits of time-dependent chart claims. |
| `/guides/reflective-reading-journal` | Save the original question and result separately from interpretations and later outcomes. |

## Source scope

Sources were observed through public web search/open on October 10, 2026. Some Astrodienst canonical pages challenge automated access; their relevant first-party FAQ text was available in indexed results. No external source assets, long quotations, or modern translations are reproduced.

- [The Metropolitan Museum of Art: tarot history](https://www.metmuseum.org/perspectives/tarot-2) supports brief historical context in the tarot articles. The two spreads and question exercises are original; they are not represented as historical methods from this source.
- [I Ching with Clarity: coin casting](https://www.onlineclarity.co.uk/learn/beginners/casting-a-hexagram-with-3-coins/) supports the heads-3/tails-2 convention, values 6–9, and bottom-up recording. [Its beginner reading introduction](https://www.onlineclarity.co.uk/reading/free-online-i-ching/) supports the distinction between primary and relating hexagrams. The example sequence is explicitly a teaching example, not a personal draw.
- [I Ching with Clarity: questions](https://www.onlineclarity.co.uk/learn/beginners/your-question/) supports writing a question before casting and concentrating on one's own understanding and choices. Article scenarios and wording are original.
- [Anjie Cho: commanding position](https://www.anjiecho.com/holistic-spaces-blog/feng-shui-to-welcome-2022) supports the narrowly attributed bed/door/wall arrangement. The articles do not adopt the source's physiological or therapeutic claims and do not imply this principle represents every feng shui school.
- [Astrodienst: precession](https://www.astro.com/faq/fq_ua_precession_e.htm) supports tropical zodiac coordinate conventions. [Astrodienst: birth time](https://www.astro.com/faq/fq_de_time_e.htm) supports time sensitivity and its explicitly hypothetical unknown-time behavior. Auspice does not imply it implements a full natal chart or the same calculation service.
- [University of Edinburgh: reflection framework](https://reflection.ed.ac.uk/reflectors-toolkit/reflecting-on-experience/what-so-what-now-what) supports a brief description of describing, interpreting, and considering next action. The journal template and examples are original.

## Publishing and maintenance

The array exports the fields required for sitemap generation, plus tool, date, and optional per-section source references. Article pages export static params, await Next.js route params, return `notFound()` for unknown slugs, and provide unique titles, descriptions, canonical URLs, Open Graph metadata, and truthful Article/BreadcrumbList JSON-LD. No invented ratings, reviewers, credentials, or outcome statistics appear.

Canonical URLs use `NEXT_PUBLIC_SITE_URL` with the coordinated production fallback `https://auspice-red.vercel.app`. Set the final production URL before the release build. Root sitemap/robots configuration, Search Console ownership, actual indexing, and production verification belong to the coordinating workstream; their existence is not established by these pages.

The byline and displayed date derive from the actual editorial identity and guide data. A future factual revision should update the date deliberately rather than refresh dates automatically for search engines. Keep citations next to the relevant section and preserve the distinction between sourced method details and Auspice's interpretation exercises. Link checks and a content review should accompany substantial edits.

Future expansion should answer demonstrated reader questions. Useful candidates are an illustrated changing-line worksheet, a fully sourced tarot-deck structure guide, and accessible room-plan examples. Do not expand to thousands of sign/city combinations without distinct useful content, and do not copy copyrighted card artwork or translations without appropriate rights.

## Almanac launch content and availability

The current launch workstream adds `/free-tarot`, a public search entry with the real guest card table, instructions, spread comparisons, limits and links into the existing guides. The source now renders the shared table under a subordinate heading and uses page-specific metadata and visible breadcrumb markup. This is implementation-in-progress evidence, not confirmation of deployment, rendered device behavior or search indexing. Keep the private sanctuary and account-data boundary separate from the indexable educational page. [Public page source](../../app/free-tarot/page.tsx), [guest table](../../components/TarotTable.tsx).

The page should answer the reader's whole immediate question: how to choose a one-card, three-card or Celtic Cross spread; how to reveal and revisit card meanings; what a position means; how to form a useful question; and what is or is not saved. State that cards are upright and guest spreads are unsaved. An illustrative spread must be labeled as an example rather than passed off as the visitor's draw. Card meanings and reflection exercises are original prompts, not claims of prediction or a professionally reviewed historical interpretation.

Use the supplied paper, ink, cinnabar and almanac typography to make reading and tool use coherent. The seal is brand identity, not an authenticity credential. The homepage, captions and social previews must not reuse prototype personal profiles, property scores, planetary placements or auspicious-day claims. Home content should discuss entered light/noise/layout observations; date content should describe a real calendar and practical intention. Drafts are not saved or synchronized. [Design boundaries](design-implementation.md).

Publication priorities are the free-tarot page, contextual links from the two tarot guides and journal guide, and one clearly explained home-viewing exercise. This replaces the earlier suggestion of an arbitrary 12-guide launch target. Add later content for actual reader questions or observed relevant search intent, not page volume. Each new page needs a useful purpose beyond changing a sign, city or date in a template. [Google's content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Keep visible Q&A for readers, but do not promise FAQ rich results: Google retired that feature in May 2026 and removed its documentation in June. Keep guide Article/BreadcrumbList markup relevant and truthful. Canonical links, internal URLs and sitemap entries must agree; Google ignores sitemap priority/changefreq, and update dates must reflect substantive work. [Google update history](https://developers.google.com/search/updates), [structured-data policy](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Marketing availability needs the same editorial care as method descriptions. Guest tools and guides are the current public offer. Production account access remains blocked until operations verifies the correction; billing is not active. Plus public copy may propose **30 personal readings per month at $11.99/month or $107.99 billed annually**, but must not guarantee deeper output, exclusive synthesis, saved planner context, or continuing personal memory. The current pricing page has no subscription, trial, email-waitlist or interest form. The retained legacy component is not rendered there; its authenticated endpoint only stores a signed-in plan preference, not contact consent, a notification subscription or payment. [Pricing decision](product-strategy.md), [pricing page](../../app/pricing/page.tsx), [availability record](../../README.md).

For the first month, prepare one introduction, a question-framing exercise, a home-viewing example and a date-planning demonstration. Use actual verified product captures or clearly labeled illustrations with synthetic input. Only an authorized owner should send or publish the prepared material. Record what readers actually ask, improve the relevant page, and avoid attributing reviews or expertise to nonexistent people. The current identifier-free guide counters cannot measure audience size, guest completion, return behavior or paid conversion. [Measurement limits](../operations/guide-measurement.md).

## Verification performed

On October 10, 2026, `npx next typegen` refreshed stale generated route types and `npm run typecheck` passed. Against the coordinator's development server at `http://localhost:3127`, `/guides` and all nine article routes returned HTTP 200. The index linked every article. Every article rendered the matching Article JSON-LD headline, its `https://auspice-red.vercel.app/guides/{slug}` canonical URL, and the expected sanctuary tool link. An unknown guide slug returned HTTP 404. These checks verify server-rendered content and route behavior; they do not establish indexing, practitioner review, or completion of the sanctuary interaction after following the link.
