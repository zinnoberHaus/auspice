import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../app/api/draw/route";
test("guest spreads use a complete draw without duplicate cards and retain the single-card API", async () => {
  const single = GET(new Request("https://auspice.test/api/draw"));
  assert.equal(single.headers.get("Cache-Control"), "no-store");
  assert.equal(typeof (await single.json()).name, "string");
  for (const [spread, count] of [["one", 1], ["three", 3], ["cross", 10]] as const) {
    const response = GET(new Request(`https://auspice.test/api/draw?spread=${spread}`));
    const { cards } = await response.json();
    assert.equal(cards.length, count);
    assert.equal(new Set(cards.map((card: { name: string }) => card.name)).size, count);
  }
});
test("guest draw rejects unexpected or inherited spread names", () => {
  for (const spread of ["0", "10000", "constructor", "__proto__"]) {
    assert.equal(GET(new Request(`https://auspice.test/api/draw?spread=${spread}`)).status, 400);
  }
});
