import { randomInt } from "node:crypto";

/** Server-only symbol selection. Interpretations must not claim measured or predicted outcomes. */
export type Tradition = "tarot" | "iching" | "astrology" | "fengshui" | "synthesis";
export type TraditionSymbol = { name: string; detail: string };

const majorCards: ReadonlyArray<readonly [string, string]> = [
  ["The Fool", "Beginning with openness; consider both curiosity and the ground beneath your feet."],
  ["The Magician", "Using available tools; turn an intention into one deliberate action."],
  ["The High Priestess", "Listening inward; distinguish a quiet impression from information still missing."],
  ["The Empress", "Nurturing growth; notice what needs care, resources, and time."],
  ["The Emperor", "Structure and responsibility; consider which boundaries support you."],
  ["The Hierophant", "Learning from tradition; examine which inherited practices you choose to keep."],
  ["The Lovers", "Values and relationship; consider the commitments behind a choice."],
  ["The Chariot", "Direction and resolve; bring competing impulses toward a chosen purpose."],
  ["Strength", "Patient courage; consider an approach that combines firmness with kindness."],
  ["The Hermit", "Purposeful solitude; make room to hear your own considered judgment."],
  ["Wheel of Fortune", "Changing circumstances; distinguish what you can influence from what you cannot."],
  ["Justice", "Accountability and balance; examine evidence, consequences, and fairness."],
  ["The Hanged Man", "A deliberate pause; try viewing a stuck situation from another position."],
  ["Death", "An ending or transition as a metaphor; consider what you are ready to release. Not a prediction of death."],
  ["Temperance", "Integration and moderation; experiment with a pace you can sustain."],
  ["The Devil", "Attachments and constraints; examine a habit or bargain that reduces your freedom. Not a literal threat."],
  ["The Tower", "A challenged assumption; consider what would make your foundations more dependable. Not a disaster forecast."],
  ["The Star", "Renewal and hope; identify a small practice that helps you recover perspective."],
  ["The Moon", "Ambiguity and imagination; separate what you know from what you fear or project."],
  ["The Sun", "Clarity and vitality; notice what supports an honest sense of enjoyment."],
  ["Judgement", "Review and response; revisit an old story and decide how to act now."],
  ["The World", "Completion and integration; acknowledge a cycle and what you carry forward."],
];

const minorCards: Record<string, readonly string[]> = {
  Wands: [
    "A creative beginning; identify a spark you can put into practice.",
    "Planning beyond familiar ground; weigh a possible direction.",
    "Looking outward; consider the next stage of something already begun.",
    "A shared foundation; recognize support, belonging, or a milestone.",
    "Competing efforts; distinguish useful challenge from needless friction.",
    "Recognition; consider how to receive encouragement without depending on approval.",
    "Holding your position; choose which commitments deserve your effort.",
    "Momentum and communication; check that your pace leaves room for clarity.",
    "Persistence with boundaries; notice where recovery would help.",
    "An overloaded commitment; identify a task to share, simplify, or set down.",
    "An exploratory message or beginner's enthusiasm; try a small creative experiment.",
    "Eager movement; pair initiative with attention to consequences.",
    "Warm confidence; consider how to encourage yourself and others.",
    "Responsible vision; turn enthusiasm into a direction others can understand.",
  ],
  Cups: [
    "Emotional openness; make room for a feeling without forcing its meaning.",
    "Mutual connection; consider reciprocity, communication, and consent.",
    "Shared enjoyment; notice the relationships that make room for celebration.",
    "Emotional distance; explore whether you need rest or a fresh perspective.",
    "Disappointment; acknowledge a loss while noticing what remains available.",
    "Memory and familiarity; examine what the past offers and what has changed.",
    "Many imagined possibilities; clarify a wish before choosing.",
    "Leaving an unsatisfying pattern; consider what a meaningful next step requires.",
    "Contentment; name an enjoyment you can appreciate without excess.",
    "Shared belonging; reflect on the conditions that help relationships thrive.",
    "A tentative feeling or invitation; meet emotional curiosity gently.",
    "Following an ideal; balance a heartfelt invitation with realistic expectations.",
    "Attentive care; listen with empathy while respecting your own boundaries.",
    "Emotional steadiness; make space for feeling without surrendering judgment.",
  ],
  Swords: [
    "A clarifying thought; ask what evidence would sharpen your understanding.",
    "A difficult choice; identify information you have been avoiding.",
    "Painful clarity; acknowledge hurt without treating it as your whole future.",
    "Rest and reflection; consider a pause before responding.",
    "Conflict and its cost; examine whether winning serves the relationship or goal.",
    "A gradual transition; notice what support makes a difficult passage manageable.",
    "Strategy and discretion; check that your approach is honest and sustainable.",
    "A sense of constraint; separate actual limits from assumptions you can examine.",
    "An anxious thought pattern; name the worry and seek grounded support when needed.",
    "An exhausted pattern; consider what can end so recovery can begin. Not a prediction of harm.",
    "Curiosity and questioning; verify a message before acting on it.",
    "Fast conviction; leave room to listen before pressing ahead.",
    "Clear discernment; communicate a boundary with precision and care.",
    "Reasoned responsibility; use expertise and standards without dismissing context.",
  ],
  Pentacles: [
    "A practical opening; consider the time and resources needed to develop it.",
    "Juggling demands; look for a manageable rhythm rather than perfect balance.",
    "Shared craft; clarify roles and learn from another person's skill.",
    "Protecting resources; examine the balance between security and flexibility.",
    "A sense of scarcity or exclusion; identify practical assistance and available support.",
    "Giving and receiving; consider fairness, consent, and the terms of an exchange.",
    "Patient evaluation; review your effort before deciding what to continue.",
    "Practice and attention; choose one concrete skill to develop.",
    "Cultivated independence; recognize the habits and support behind your stability.",
    "Long-term foundations; consider shared resources, continuity, and responsibility.",
    "A practical learning opportunity; turn curiosity into a small measurable task.",
    "Steady follow-through; make progress through a realistic routine.",
    "Practical care; support wellbeing through thoughtful use of resources.",
    "Responsible stewardship; consider how to maintain what is entrusted to you.",
  ],
};

const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

/** Full Waite–Smith naming convention; original reflective prompts, upright orientation only. */
export const TAROT_DECK: ReadonlyArray<Readonly<TraditionSymbol>> = Object.freeze([
  ...majorCards.map(([name, detail]) => Object.freeze({ name, detail })),
  ...Object.entries(minorCards).flatMap(([suit, details]) => details.map((detail, i) => Object.freeze({ name: `${ranks[i]} of ${suit}`, detail }))),
]);

/** Partial Fisher–Yates sampling: every remaining card has the same chance; no repeats. */
export function drawTarotCards(count = 3): TraditionSymbol[] {
  if (!Number.isInteger(count) || count < 1 || count > TAROT_DECK.length) throw new RangeError("Draw between 1 and 78 cards.");
  const deck = [...TAROT_DECK];
  for (let i = 0; i < count; i++) {
    const selected = randomInt(i, deck.length);
    [deck[i], deck[selected]] = [deck[selected], deck[i]];
  }
  return deck.slice(0, count).map((card) => ({ ...card, detail: `Upright. ${card.detail}` }));
}

export function drawTarot(): TraditionSymbol {
  return drawTarotCards(1)[0];
}

export type IChingLine = 6 | 7 | 8 | 9;
export type Hexagram = { number: number; name: string; pattern: string; lower: string; upper: string };

// Each six-character pattern is BOTTOM TO TOP: 1 = yang, 0 = yin.
// Verified against the six line labels in every chapter of the Chinese Zhouyi.
const hexagramRows: ReadonlyArray<readonly [string, string]> = [
  ["111111", "Qian · The Creative"], ["000000", "Kun · The Receptive"],
  ["100010", "Zhun · Difficulty at the Beginning"], ["010001", "Meng · Youthful Learning"],
  ["111010", "Xu · Waiting"], ["010111", "Song · Conflict"],
  ["010000", "Shi · The Army"], ["000010", "Bi · Holding Together"],
  ["111011", "Xiao Chu · Small Restraint"], ["110111", "Lü · Treading"],
  ["111000", "Tai · Peace"], ["000111", "Pi · Standstill"],
  ["101111", "Tong Ren · Fellowship"], ["111101", "Da You · Great Possession"],
  ["001000", "Qian · Modesty"], ["000100", "Yu · Enthusiasm"],
  ["100110", "Sui · Following"], ["011001", "Gu · Repairing What Has Spoiled"],
  ["110000", "Lin · Approach"], ["000011", "Guan · Contemplation"],
  ["100101", "Shi He · Biting Through"], ["101001", "Bi · Grace"],
  ["000001", "Bo · Splitting Apart"], ["100000", "Fu · Return"],
  ["100111", "Wu Wang · Innocence"], ["111001", "Da Chu · Great Restraint"],
  ["100001", "Yi · Nourishment"], ["011110", "Da Guo · Great Exceeding"],
  ["010010", "Kan · Repeated Water"], ["101101", "Li · Clinging Fire"],
  ["001110", "Xian · Influence"], ["011100", "Heng · Duration"],
  ["001111", "Dun · Retreat"], ["111100", "Da Zhuang · Great Strength"],
  ["000101", "Jin · Progress"], ["101000", "Ming Yi · Darkening of the Light"],
  ["101011", "Jia Ren · The Family"], ["110101", "Kui · Opposition"],
  ["001010", "Jian · Obstruction"], ["010100", "Jie · Release"],
  ["110001", "Sun · Decrease"], ["100011", "Yi · Increase"],
  ["111110", "Guai · Breakthrough"], ["011111", "Gou · Coming to Meet"],
  ["000110", "Cui · Gathering Together"], ["011000", "Sheng · Pushing Upward"],
  ["010110", "Kun · Oppression"], ["011010", "Jing · The Well"],
  ["101110", "Ge · Revolution"], ["011101", "Ding · The Cauldron"],
  ["100100", "Zhen · Thunder"], ["001001", "Gen · Keeping Still"],
  ["001011", "Jian · Gradual Development"], ["110100", "Gui Mei · The Marrying Maiden"],
  ["101100", "Feng · Abundance"], ["001101", "Lü · The Wanderer"],
  ["011011", "Xun · Gentle Wind"], ["110110", "Dui · Joyous Lake"],
  ["010011", "Huan · Dispersion"], ["110010", "Jie · Limitation"],
  ["110011", "Zhong Fu · Inner Truth"], ["001100", "Xiao Guo · Small Exceeding"],
  ["101010", "Ji Ji · After Completion"], ["010101", "Wei Ji · Before Completion"],
];

const trigramNames: Record<string, string> = {
  "111": "Qian / heaven", "000": "Kun / earth", "100": "Zhen / thunder", "010": "Kan / water",
  "001": "Gen / mountain", "011": "Xun / wind", "101": "Li / fire", "110": "Dui / lake",
};

export const HEXAGRAMS: ReadonlyArray<Readonly<Hexagram>> = Object.freeze(hexagramRows.map(([pattern, name], i) => Object.freeze({
  number: i + 1, name, pattern, lower: trigramNames[pattern.slice(0, 3)], upper: trigramNames[pattern.slice(3)],
})));
const hexagramByPattern = new Map(HEXAGRAMS.map((hexagram) => [hexagram.pattern, hexagram]));

export function lineFromCoins(coins: readonly number[]): IChingLine {
  if (coins.length !== 3 || !Array.from(coins).every((coin) => coin === 2 || coin === 3)) throw new RangeError("A line requires exactly three coins valued 2 or 3.");
  return coins.reduce((sum, coin) => sum + coin, 0) as IChingLine;
}

export function resolveIChing(lines: readonly number[]): {
  lines: IChingLine[]; primary: Readonly<Hexagram>; relating: Readonly<Hexagram>; changingLines: number[];
} {
  if (lines.length !== 6 || !Array.from(lines).every((line) => [6, 7, 8, 9].includes(line))) throw new RangeError("Provide six lines, each 6, 7, 8, or 9, in bottom-to-top order.");
  const primaryPattern = lines.map((line) => line % 2).join("");
  const relatingPattern = lines.map((line) => line === 6 ? 1 : line === 9 ? 0 : line % 2).join("");
  return {
    lines: [...lines] as IChingLine[],
    primary: hexagramByPattern.get(primaryPattern)!,
    relating: hexagramByPattern.get(relatingPattern)!,
    changingLines: lines.flatMap((line, index) => line === 6 || line === 9 ? [index + 1] : []),
  };
}

export function castIChing() {
  return resolveIChing(Array.from({ length: 6 }, () => lineFromCoins(Array.from({ length: 3 }, () => randomInt(2, 4)))));
}

function iChingSymbols(): TraditionSymbol[] {
  const cast = castIChing();
  return [
    { name: `Hexagram ${cast.primary.number} · ${cast.primary.name}`, detail: `Three-coin cast. Lower trigram: ${cast.primary.lower}; upper trigram: ${cast.primary.upper}. Lines bottom to top: ${cast.lines.join(", ")}. 6 = changing yin, 7 = stable yang, 8 = stable yin, 9 = changing yang.` },
    { name: cast.changingLines.length ? `Changing lines: ${cast.changingLines.join(", ")}` : "No changing lines", detail: "Line 1 is the bottom line and line 6 the top. Only 6 and 9 change polarity. No classical line commentary has been supplied: do not invent quotations or attribute generated reflections to the original text." },
    { name: `Relating hexagram ${cast.relating.number} · ${cast.relating.name}`, detail: cast.changingLines.length ? `After changing only the marked lines: lower ${cast.relating.lower}, upper ${cast.relating.upper}. A second perspective for reflection, not a promised future.` : "With no changing lines, the relating and primary hexagram are the same." },
  ];
}

const zodiacStarts: ReadonlyArray<readonly [number, string, string]> = [
  [120, "Aquarius", "community and independent perspective"], [219, "Pisces", "imagination and compassion"],
  [321, "Aries", "initiative and directness"], [420, "Taurus", "steadiness and what you value"],
  [521, "Gemini", "curiosity and communication"], [621, "Cancer", "care and belonging"],
  [723, "Leo", "expression and generosity"], [823, "Virgo", "discernment and useful routines"],
  [923, "Libra", "relationships and fairness"], [1023, "Scorpio", "depth and boundaries"],
  [1122, "Sagittarius", "exploration and meaning"], [1222, "Capricorn", "responsibility and patient effort"],
];

/** Calendar estimate only: no ephemeris, location, time, Moon, ascendant, houses, or transits. */
export function estimateSunSign(birthDate?: string): TraditionSymbol {
  if (!birthDate) return { name: "Birth date not provided", detail: "No personal Sun sign has been calculated. Offer a general reflection without assigning a zodiac sign, Moon sign, rising sign, chart houses, or transits." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new RangeError("Birth date must be a valid calendar date in YYYY-MM-DD format.");
  const [year, month, day] = birthDate.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) throw new RangeError("Birth date must be a valid calendar date in YYYY-MM-DD format.");
  const today = new Date().toISOString().slice(0, 10);
  if (birthDate > today) throw new RangeError("Birth date cannot be in the future.");
  const dateKey = month * 100 + day;
  const [, sign, theme] = [...zodiacStarts].reverse().find(([start]) => dateKey >= start) ?? zodiacStarts[11];
  return {
    name: `${sign} · approximate Sun sign`,
    detail: `A seasonal tropical-zodiac calendar estimate for ${birthDate}, using conventional date ranges, not an astronomical calculation. Near a sign boundary the result can differ by birth year, exact time, and time zone. Reflect on ${theme} as symbolism, not established personality facts. Moon, rising sign, chart houses, and transits have not been calculated and must not be inferred.`,
  };
}

function fengShuiSymbols(context = ""): TraditionSymbol[] {
  const comparison = /\b(house|home|apartment|property|move|moving|rent|buy|neighbou?rhood)\b/i.test(context);
  return [
    { name: "BTB bagua · entrance alignment", detail: "Use an entry-aligned BTB nine-area map as a symbolic reflection tool: stand at the formal front entrance facing inward, with the entrance wall along the near row. A floor plan is needed to locate areas in a specific home. This is not a compass-school or Flying Stars calculation." },
    { name: "Near row · knowledge, career, helpful people", detail: "From left to right when looking inward from the entrance: knowledge/self-cultivation, career/life path, helpful people/travel. Ask where your space supports learning, daily purpose, and connection." },
    { name: "Middle row · family, center, creativity", detail: "From left to right: family/new beginnings, center/wellbeing, children/creativity. Consider meaningful objects, clear walking routes, and room for activities you enjoy; these are prompts, not health claims." },
    { name: "Far row · prosperity, recognition, relationships", detail: "From left to right: wealth/prosperity, fame/recognition, partnership/relationships. Treat these as themes for intention and care, not promises of money, reputation, or romance." },
    { name: comparison ? "Compare homes through observation" : "Observe light, noise, and ventilation", detail: "Compare daylight and glare at the times you use a room, listen for traffic and neighbor noise, and check usable windows and ventilation. Record actual observations and unknowns. No floor plan, sensor readings, or site inspection has been analyzed; do not invent directions, scores, environmental measurements, or a best property." },
    { name: "Form and everyday use", detail: "Look at furniture layout, an unobstructed entrance, comfortable seating, privacy, and safe movement. Try reversible changes and compare comfort afterward. Symbolic qi language is not a scientific energy measurement or a substitute for a building inspection." },
  ];
}

export function buildSymbols(tradition: Tradition, birthDate?: string, context?: string): TraditionSymbol[] {
  switch (tradition) {
    case "tarot": return drawTarotCards(3).map((card, i) => ({ name: card.name, detail: `${["Situation", "Perspective", "Next step"][i]} position. ${card.detail}` }));
    case "iching": return iChingSymbols();
    case "astrology": return [estimateSunSign(birthDate)];
    case "fengshui": return fengShuiSymbols(context);
    case "synthesis": {
      const card = drawTarot();
      return [
      { name: "Separate traditions, shared reflection", detail: "These traditions use different methods. Compare their metaphors without claiming one proves another or that together they predict an outcome." },
      { name: card.name, detail: `Tarot perspective. ${card.detail}` },
      ...iChingSymbols(),
      estimateSunSign(birthDate),
      ...fengShuiSymbols(context),
      ];
    }
    default: throw new RangeError("Unsupported tradition.");
  }
}
