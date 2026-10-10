import assert from "node:assert/strict";
import test from "node:test";
import {
  addPlannerDays, createPlannerCalendar, dateReadingContext, formatPlannerDate,
  homeReadingContext, localDateKey, parsePlannerDate, plannerMonthDays, shiftPlannerMonth,
} from "../lib/almanac-planning";

test("civil calendar dates preserve leap days, month boundaries and weekdays", () => {
  assert.equal(formatPlannerDate("2026-10-10", { weekday: "long" }), "Saturday");
  assert.equal(addPlannerDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addPlannerDays("2024-02-29", 1), "2024-03-01");
  assert.equal(addPlannerDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addPlannerDays("2026-03-08", 1), "2026-03-09");
  assert.equal(shiftPlannerMonth("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftPlannerMonth("2026-01-31", -1), "2025-12-01");
  assert.equal(localDateKey(new Date(2026, 9, 10, 23, 59)), "2026-10-10");
  for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "2026-00-01", "2026-1-1", "10/10/2026", "2026-10-10T12:00:00Z", "invalid"]) {
    assert.throws(() => parsePlannerDate(value), RangeError, value);
  }
});

test("month grids align Sunday first and contain every actual date once", () => {
  const february = plannerMonthDays("2024-02-01");
  assert.deepEqual(february.slice(0, 4), [null, null, null, null]);
  assert.equal(february[4], "2024-02-01");
  assert.equal(february.filter(Boolean).length, 29);
  const august = plannerMonthDays("2026-08-01");
  assert.equal(august.length, 42);
  assert.equal(august[6], "2026-08-01");
  assert.equal(new Set(august.filter(Boolean)).size, 31);
  assert.equal(plannerMonthDays("2026-02-01").length, 28);
});

test("calendar export produces an all-day event with an exclusive end date", () => {
  const calendar = createPlannerCalendar({ date: "2026-12-31", event: "Move in", note: "Collect the keys", uid: "test-123", now: new Date("2026-10-10T01:02:03Z") });
  assert.match(calendar, /DTSTAMP:20261010T010203Z\r\n/);
  assert.match(calendar, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101\r\n/);
  assert.match(calendar, /UID:test-123@auspice/);
  assert.match(calendar, /SUMMARY:Move in/);
  assert.match(calendar, /TRANSP:TRANSPARENT/);
  assert.ok(calendar.endsWith("END:VCALENDAR\r\n"));
  assert.doesNotMatch(calendar, /TZID|ATTENDEE|VALARM/);
});

test("calendar notes cannot inject properties and folding preserves Unicode at 75 octets", () => {
  const event = "Family, friends; home\\new";
  const note = "A note\r\nEND:VEVENT\nBEGIN:VALARM\rACTION:EMAIL\n" + "家🌱é".repeat(90);
  const calendar = createPlannerCalendar({ date: "2024-02-29", event, note, uid: "safe" });
  const unfolded = calendar.replace(/\r\n /g, "");
  assert.match(unfolded, /SUMMARY:Family\\, friends\\; home\\\\new/);
  assert.ok(unfolded.includes("DESCRIPTION:A note\\nEND:VEVENT\\nBEGIN:VALARM\\nACTION:EMAIL\\n"));
  assert.ok(unfolded.includes("家🌱é".repeat(90)));
  assert.equal(calendar.split("\r\n").filter((line) => line === "END:VEVENT").length, 1);
  assert.ok(!calendar.split("\r\n").some((line) => line === "BEGIN:VALARM"));
  for (const line of calendar.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75, line);
  assert.throws(() => createPlannerCalendar({ date: "2026-10-10", event: "Plan", note: "", uid: "bad\nUID:injected" }), RangeError);
  assert.throws(() => createPlannerCalendar({ date: "1899-12-31", event: "Plan", note: "", uid: "safe" }), RangeError);
});

test("reading handoff preserves observations and stays inside the actual API context limit", () => {
  const homes = [1, 2, 3].map((id) => ({ id, name: String(id).repeat(40), light: "l".repeat(65), noise: "n".repeat(65), layout: "p".repeat(130) }));
  const checks = [1, 2, 3, 4, 5, 6].map((id) => ({ id, label: "c".repeat(50), homes: [1, 2, 3] }));
  const context = homeReadingContext(homes, checks, { home: "h".repeat(40), zone: "z".repeat(35), note: "f".repeat(120) });
  assert.ok(context.length <= 1800, `Context length ${context.length}`);
  assert.ok(context.includes("f".repeat(120)));
  assert.ok(context.endsWith("Symbolic reflection only; no scores or compass calculations."));
  for (const home of homes) assert.ok(context.includes(home.name));
  const unknown = homeReadingContext([{ id: 7, name: "Elm", light: "", noise: "", layout: "" }], [{ id: 1, label: "Visit", homes: [] }], { home: "Elm", zone: "Center", note: "" });
  assert.match(unknown, /Light: unknown; noise: unknown; layout: unknown/);
  assert.match(unknown, /Visit: none/);
  assert.doesNotMatch(unknown, /favorable|score:|rating:/i);
});

test("date reading includes the chosen date, actual weekday, event and user note with limits", () => {
  const context = dateReadingContext("2026-10-10", "Move in", "Confirm the lift and keys.");
  assert.match(context, /Saturday, October 10, 2026 \(2026-10-10\)/);
  assert.match(context, /Move in/);
  assert.match(context, /Confirm the lift and keys\./);
  assert.match(context, /Auspicious-date calculations are unavailable/);
  assert.ok(dateReadingContext("2026-10-10", "Wedding", "n".repeat(600)).length < 1800);
});
