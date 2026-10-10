import assert from "node:assert/strict";
import test from "node:test";
import { buildSymbols, castIChing, drawTarot, drawTarotCards, estimateSunSign, HEXAGRAMS, lineFromCoins, resolveIChing, TAROT_DECK, type Tradition } from "../lib/traditions";

test("the complete tarot deck has 22 majors and 14 cards in each of four suits", () => {
  assert.equal(TAROT_DECK.length, 78);
  assert.equal(new Set(TAROT_DECK.map((card) => card.name)).size, 78);
  for (const suit of ["Wands", "Cups", "Swords", "Pentacles"]) {
    assert.equal(TAROT_DECK.filter((card) => card.name.endsWith(` of ${suit}`)).length, 14);
  }
  assert.equal(TAROT_DECK.filter((card) => !/ of (Wands|Cups|Swords|Pentacles)$/.test(card.name)).length, 22);
  assert.ok(TAROT_DECK.every((card) => card.detail.length > 20));
  assert.ok(Object.isFrozen(TAROT_DECK));
});

test("tarot draws sample the complete deck without replacement and reject invalid sizes", () => {
  assert.deepEqual(drawTarotCards(78).map((card) => card.name).sort(), TAROT_DECK.map((card) => card.name).sort());
  for (let i = 0; i < 100; i++) {
    const draw = drawTarotCards();
    assert.equal(draw.length, 3);
    assert.equal(new Set(draw.map((card) => card.name)).size, 3);
    assert.ok(draw.every((card) => card.detail.startsWith("Upright.")));
  }
  const single = drawTarot();
  assert.ok(TAROT_DECK.some((card) => card.name === single.name));
  for (const count of [0, -1, 79, 1.5, NaN, Infinity]) assert.throws(() => drawTarotCards(count), RangeError);
});

test("three fair coins produce the required 1:3:3:1 line distribution", () => {
  const counts = new Map<number, number>();
  for (const a of [2, 3]) for (const b of [2, 3]) for (const c of [2, 3]) {
    const line = lineFromCoins([a, b, c]);
    counts.set(line, (counts.get(line) ?? 0) + 1);
  }
  assert.deepEqual([...counts.entries()], [[6, 1], [7, 3], [8, 3], [9, 1]]);
  for (const coins of [[], [2, 3], [2, 3, 2, 3], [1, 3, 3], [2, 3, NaN], new Array<number>(3)]) assert.throws(() => lineFromCoins(coins), RangeError);
});

test("all 64 hexagrams match the independent classic upper/lower trigram lookup", () => {
  // Wilhelm/Baynes index: rows LOWER, columns UPPER, in this order.
  // https://clovemedia.github.io/i_ching/I_Ching_Wilhelm_Baynes_Translation.html
  const trigrams = ["111", "100", "010", "001", "000", "011", "101", "110"];
  const matrix = [
    [1, 34, 5, 26, 11, 9, 14, 43], [25, 51, 3, 27, 24, 42, 21, 17],
    [6, 40, 29, 4, 7, 59, 64, 47], [33, 62, 39, 52, 15, 53, 56, 31],
    [12, 16, 8, 23, 2, 20, 35, 45], [44, 32, 48, 18, 46, 57, 50, 28],
    [13, 55, 63, 22, 36, 37, 30, 49], [10, 54, 60, 41, 19, 61, 38, 58],
  ];
  const numbers = new Set<number>();
  for (let lower = 0; lower < 8; lower++) for (let upper = 0; upper < 8; upper++) {
    const lines = (trigrams[lower] + trigrams[upper]).split("").map((bit) => bit === "1" ? 7 : 8);
    const result = resolveIChing(lines);
    assert.equal(result.primary.number, matrix[lower][upper]);
    assert.equal(result.relating.number, result.primary.number);
    assert.deepEqual(result.changingLines, []);
    numbers.add(result.primary.number);
  }
  assert.equal(numbers.size, 64);
  assert.equal(new Set(HEXAGRAMS.map((hexagram) => hexagram.pattern)).size, 64);
});

test("changing lines preserve bottom-up numbering and flip only old yin/yang", () => {
  const allYang = resolveIChing([9, 9, 9, 9, 9, 9]);
  assert.equal(allYang.primary.number, 1);
  assert.equal(allYang.relating.number, 2);
  assert.deepEqual(allYang.changingLines, [1, 2, 3, 4, 5, 6]);
  assert.equal(resolveIChing([6, 6, 6, 6, 6, 6]).relating.number, 1);
  const peace = resolveIChing([7, 7, 7, 6, 6, 6]);
  assert.equal(peace.primary.number, 11);
  assert.equal(peace.relating.number, 1);
  assert.deepEqual(peace.changingLines, [4, 5, 6]);
  const firstChanges = resolveIChing([9, 8, 8, 8, 7, 8]);
  assert.equal(firstChanges.primary.number, 3);
  assert.equal(firstChanges.relating.number, 8);
  assert.deepEqual(firstChanges.changingLines, [1]);
  const lastChanges = resolveIChing([8, 7, 7, 8, 7, 9]);
  assert.equal(lastChanges.primary.number, 57);
  assert.equal(lastChanges.relating.number, 48);
  assert.deepEqual(lastChanges.changingLines, [6]);
  assert.equal(resolveIChing([7, 8, 7, 8, 7, 8]).primary.number, 63);
  assert.equal(resolveIChing([8, 7, 8, 7, 8, 7]).primary.number, 64);
});

test("every one of 4096 line combinations resolves; invalid casts fail", () => {
  for (let value = 0; value < 4096; value++) {
    const lines = Array.from({ length: 6 }, (_, i) => 6 + ((value >> (2 * i)) & 3));
    const cast = resolveIChing(lines);
    assert.ok(cast.primary.number >= 1 && cast.primary.number <= 64);
    assert.ok(cast.relating.number >= 1 && cast.relating.number <= 64);
    assert.equal(cast.changingLines.length, lines.filter((line) => line === 6 || line === 9).length);
  }
  for (const lines of [[], [7, 7, 7, 7, 7], [7, 7, 7, 7, 7, 10], [7, 7, 7, 7, 7, 7.5], [7, 7, 7, 7, 7, NaN], new Array<number>(6)]) assert.throws(() => resolveIChing(lines), RangeError);
  const randomCast = castIChing();
  assert.equal(randomCast.lines.length, 6);
  assert.deepEqual(resolveIChing(randomCast.lines), randomCast);
});

test("sun-sign estimates handle the yearly wrap and label their limitations", () => {
  const expected = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
  for (let month = 1; month <= 12; month++) {
    const estimate = estimateSunSign(`2000-${String(month).padStart(2, "0")}-10`);
    assert.equal(estimate.name, `${expected[month - 1]} · approximate Sun sign`);
    assert.match(estimate.detail, /not an astronomical calculation/);
    assert.match(estimate.detail, /have not been calculated and must not be inferred/);
  }
  assert.match(estimateSunSign("2000-03-20").name, /^Pisces/);
  assert.match(estimateSunSign("2000-03-21").name, /^Aries/);
  assert.match(estimateSunSign("2000-12-22").name, /^Capricorn/);
  assert.match(estimateSunSign().detail, /No personal Sun sign/);
});

test("birth dates reject impossible dates, normalized overflow, ambiguous formats and future dates", () => {
  assert.match(estimateSunSign("2000-02-29").name, /^Pisces/);
  assert.match(estimateSunSign("2024-02-29").name, /^Pisces/);
  for (const date of ["1900-02-29", "2023-02-29", "2000-04-31", "2000-13-01", "2000-00-01", "2000-01-00", "0000-01-01", "99-01-01", "01/02/2000", "2000-1-1", "2000-01-01T00:00:00Z", " 2000-01-01", "invalid", "9999-12-31"]) {
    assert.throws(() => estimateSunSign(date), RangeError, date);
  }
});

test("the requested interface returns grounded symbols for every tradition", () => {
  const traditions: Tradition[] = ["tarot", "iching", "astrology", "fengshui", "synthesis"];
  for (const tradition of traditions) {
    const symbols = buildSymbols(tradition, "2000-01-10", "Compare two apartments");
    assert.ok(symbols.length > 0);
    assert.ok(symbols.every((symbol) => symbol.name && symbol.detail));
  }
  const tarot = buildSymbols("tarot");
  assert.equal(new Set(tarot.map((card) => card.name)).size, 3);
  const fengshui = buildSymbols("fengshui", undefined, "Compare two houses");
  assert.ok(fengshui.some((symbol) => /BTB/.test(symbol.name)));
  assert.ok(fengshui.some((symbol) => /light, noise|daylight and glare/.test(symbol.detail)));
  assert.ok(fengshui.some((symbol) => /not a scientific energy measurement/.test(symbol.detail)));
  assert.throws(() => buildSymbols("unknown" as Tradition), RangeError);
});
