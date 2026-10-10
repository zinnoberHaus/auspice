# Guide library editorial record

Date: October 10, 2026. Author identity shown publicly: **Auspice Editorial**, an organizational byline. No practitioner review or endorsement is claimed.

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

## Verification performed

On October 10, 2026, `npx next typegen` refreshed stale generated route types and `npm run typecheck` passed. Against the coordinator's development server at `http://localhost:3127`, `/guides` and all nine article routes returned HTTP 200. The index linked every article. Every article rendered the matching Article JSON-LD headline, its `https://auspice-red.vercel.app/guides/{slug}` canonical URL, and the expected sanctuary tool link. An unknown guide slug returned HTTP 404. These checks verify server-rendered content and route behavior; they do not establish indexing, practitioner review, or completion of the sanctuary interaction after following the link.
