# Auspice tradition methods

Implementation reviewed October 10, 2026. These are reproducible methods for selecting symbolic material, not evidence that divination predicts events. `lib/traditions.ts` supplies the selected symbols and method limits to the reading generator. It must run on the Node.js server because random selections use `node:crypto.randomInt`.

## Tarot

The deck has 78 unique names: 22 major cards and four 14-card suits, Wands, Cups, Swords, and Pentacles. Each suit contains Ace through Ten, Page, Knight, Queen, and King. Naming follows the Waite–Smith convention; see the classic [Pictorial Key to the Tarot, Part III](https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot/Part_3). Card details are original, short reflection prompts, not copied fortune-telling passages or claims about events. Auspice currently uses upright cards only and says so.

`drawTarotCards(3)` performs the first three steps of a Fisher–Yates shuffle with cryptographically generated bounded integers. Selection is without replacement, so a three-card reading cannot repeat a card. `drawTarot()` samples one card from the same full deck. No name, birth date, or question text changes the probabilities. A new call is a new draw: callers must persist the result with the reading rather than redraw it while rendering or retrying generation. The three positions are Auspice's situation, perspective, and next-step prompts, not a claim of a universal traditional spread. Node documents the bounded API and its avoidance of modulo bias in [crypto.randomInt](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback).

## I Ching

A cast uses 18 independent binary coin selections, grouped into six lines. Each coin is valued 2 or 3. The three-coin totals are 6 (old/changing yin), 7 (young/stable yang), 8 (young/stable yin), and 9 (old/changing yang). The lines are recorded bottom first. The three-coin distribution is 1/8, 3/8, 3/8, 1/8 respectively; it is not the yarrow-stalk distribution. Only 6 and 9 reverse polarity when forming the relating hexagram. See the classic Wilhelm–Baynes translation's [Consulting the Oracle appendix and hexagram index](https://clovemedia.github.io/i_ching/I_Ching_Wilhelm_Baynes_Translation.html). The hosted transcription is a reference; Auspice does not bundle its copyrighted commentary.

The 64-entry King Wen table was independently checked against the first six line labels in every chapter of the original Chinese [Zhouyi text at Project Gutenberg](https://www.gutenberg.org/cache/epub/25501/pg25501-images.html): labels containing 九 establish yang, and 六 establishes yin. The resulting six bits run **bottom to top**, with 1 for yang and 0 for yin. The tests use the classic's separate lower/upper trigram matrix as a second fixture. This catches a common defect in which a valid-looking pattern receives the number of its reversed or transposed counterpart.

Examples: `111000` is hexagram 11, with heaven below earth; `000111` is hexagram 12. `101010` is hexagram 63 and `010101` is hexagram 64. Six 9s cast hexagram 1 and relate to 2; six 6s do the reverse. Changing line numbers are one-based, with line 1 at the bottom. A cast with no changing lines retains the same relating hexagram.

The generator receives the exact six totals, names, trigram identities, changing positions, and relating hexagram. English titles are concise naming aids rather than a canonical translation. No classical changing-line commentary is supplied, so the generated reading must not invent a quotation or attribute a newly generated interpretation to the original text. A relating hexagram is offered as another reflective perspective, not a prediction that a specific event will occur.

## Astrology

`estimateSunSign` accepts a strict Gregorian `YYYY-MM-DD` birth date, rejects nonexistent dates and future dates, and returns a **seasonal tropical-zodiac calendar estimate**. The conventional starts are January 20, February 19, March 21, April 20, May 21, June 21, July 23, August 23, September 23, October 23, November 22, and December 22. These are implementation approximations, not ephemeris-derived ingress dates. The tropical system relates the zodiac to the solar seasons; see [Astrodienst's explanation of the zodiac](https://www.astro.com/astrowiki/en/Zodiac).

Every result carries the approximation notice. Actual Sun-sign changes vary with year and time; a boundary birth requires a calculated position and an unambiguous birth instant. Astrodienst explains the limitation of fixed date lists in its [birth and Sun-sign FAQ](https://www.astro.com/faq/fq_ua_general_e.htm?lang=i&nho2=2&nhor=3). Auspice does not calculate Moon signs, rising signs, chart houses, planetary aspects, or transits. These must not be guessed from the date. Missing birth dates produce an explicit unknown instead of an invented sign. Sign themes are symbolic prompts, not established personality facts. Exact natal charts require a separately verified ephemeris implementation and birth-time/location workflow.

## Feng shui

The supplied map is explicitly **BTB and aligned to the formal entrance**, with the user looking inward. It is not a compass-school, Kua, or Flying Stars calculation. [Mindful Design School describes this entrance convention](https://mindfuldesignschool.com/blog/q-and-a-doors-bagua), and practitioner [R. D. Chin describes the relative bagua areas](https://rdchin.com/about-press-on-rd/). From left to right, the near row is knowledge, career, and helpful people; the middle row is family, center, and creativity; the far row is prosperity, recognition, and relationships. These are symbolic associations, not guarantees about money, health, or relationships.

The method also supplies practical observation prompts about daylight, glare, noise, ventilation, circulation, seating, and privacy. They invite the user to record what they actually observe and compare reversible changes. They do not report measurements, analyze an uploaded floor plan, rank properties, or identify a physical energy field. No specific area of a user's home is asserted without the necessary layout. Traditional references establish the practice's own conventions, not scientific validation of its claims. Major housing decisions still need ordinary inspection and practical evaluation.

## Synthesis and integration

`buildSymbols(tradition, birthDate?, context?)` accepts `tarot`, `iching`, `astrology`, `fengshui`, or `synthesis` and returns `{ name, detail }[]`. Synthesis selects one tarot card and one I Ching cast, adds the approximate-or-unknown astrology context, and includes the feng shui prompts. Its first symbol instructs the generator to preserve differences between the traditions. Apparent agreement does not make a prediction more certain.

Invalid supplied birth dates throw `RangeError` in astrology and synthesis. The API should validate these before reserving or charging a reading and return a useful client error. Random symbols must be generated once per reading attempt and stored with it; generation retries must reuse the saved symbols. The engine has no database writes, external model calls, or client telemetry.

Verification: run `npx tsx --test tests/traditions.test.ts`. Coverage includes the entire deck, nonrepeating draws, coin probabilities by enumeration, all 64 independent trigram mappings, known changing-line examples, all 4,096 line combinations, date validation and annual wrap, and the five-tradition interface. These tests establish method invariants; they do not establish predictive efficacy or verify generated prose.
