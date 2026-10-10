export type HomeObservation = {
  id: number;
  name: string;
  light: string;
  noise: string;
  layout: string;
};

export type HomeCheck = { id: number; label: string; homes: number[] };

export const plannerDateLimits = { min: "1900-01-01", max: "2100-12-31" };

// Civil dates use UTC only for arithmetic, so daylight-saving changes cannot
// move an all-day event or the calendar's weekday into a neighboring day.
export function parsePlannerDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError("Invalid date");
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RangeError("Invalid date");
  }
  return date;
}

export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addPlannerDays(value: string, days: number): string {
  const date = parsePlannerDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function shiftPlannerMonth(value: string, offset: number): string {
  const date = parsePlannerDate(`${value.slice(0, 7)}-01`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 10);
}

export function plannerMonthDays(month: string): (string | null)[] {
  const first = parsePlannerDate(`${month.slice(0, 7)}-01`);
  const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const days: (string | null)[] = Array.from({ length: first.getUTCDay() }, () => null);
  for (let day = 1; day <= count; day++) days.push(`${month.slice(0, 7)}-${String(day).padStart(2, "0")}`);
  while (days.length % 7) days.push(null);
  return days;
}

export function formatPlannerDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(parsePlannerDate(value));
}

const clean = (value: string, max: number) => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);

export function homeReadingContext(homes: HomeObservation[], checks: HomeCheck[], focus: { home: string; zone: string; note: string }): string {
  const lines = ["My home observations; not a property assessment."];
  for (const [index, home] of homes.slice(0, 3).entries()) {
    lines.push(`${index + 1}. ${clean(home.name, 40) || `Home ${index + 1}`}\nLight: ${clean(home.light, 65) || "unknown"}; noise: ${clean(home.noise, 65) || "unknown"}; layout: ${clean(home.layout, 130) || "unknown"}.`);
  }
  lines.push("Checks: listed home numbers = observed; others = unconfirmed.");
  for (const check of checks.slice(0, 6)) {
    if (check.label.trim()) lines.push(`${clean(check.label, 50)}: ${homes.slice(0, 3).flatMap((home, i) => check.homes.includes(home.id) ? [i + 1] : []).join(", ") || "none"}.`);
  }
  if (focus.note.trim()) lines.push(`Entry-aligned note, ${clean(focus.home, 40)} / ${clean(focus.zone, 35)}: ${clean(focus.note, 120)}.`);
  lines.push("Symbolic reflection only; no scores or compass calculations.");
  return lines.join("\n");
}

export function dateReadingContext(date: string, event: string, note: string): string {
  const label = formatPlannerDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return `I am planning ${clean(event, 60)} for ${label} (${date}).\nMy planning notes: ${clean(note, 600) || "None added yet."}\nHelp me reflect on readiness and practical next steps. Auspicious-date calculations are unavailable; do not invent a favorable or unfavorable date rating.`;
}

function escapeCalendarText(value: string): string {
  return clean(value, 2000).replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

// RFC 5545 folds at 75 octets, without splitting a multi-byte character.
function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  const folded: string[] = [];
  let part = "";
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      folded.push(part);
      part = " ";
      bytes = 1;
    }
    part += character;
    bytes += size;
  }
  folded.push(part);
  return folded.join("\r\n");
}

export function createPlannerCalendar({ date, event, note, uid, now = new Date() }: {
  date: string; event: string; note: string; uid: string; now?: Date;
}): string {
  parsePlannerDate(date);
  if (date < plannerDateLimits.min || date > plannerDateLimits.max) throw new RangeError("Date outside planner range");
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(uid)) throw new RangeError("Invalid calendar identifier");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Auspice//Personal planning//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:${uid}@auspice`, `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${addPlannerDays(date, 1).replace(/-/g, "")}`,
    `SUMMARY:${escapeCalendarText(event)}`, `DESCRIPTION:${escapeCalendarText(`${note}\nPlanned with Auspice. Planning aid; auspicious-date calculations are not available.`)}`,
    "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR",
  ];
  return `${lines.map(foldCalendarLine).join("\r\n")}\r\n`;
}
