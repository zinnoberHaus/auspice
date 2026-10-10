"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownToLine, ArrowRight, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  addPlannerDays, createPlannerCalendar, dateReadingContext, formatPlannerDate,
  homeReadingContext, localDateKey, parsePlannerDate, plannerDateLimits,
  plannerMonthDays, shiftPlannerMonth, type HomeCheck, type HomeObservation,
} from "@/lib/almanac-planning";
import styles from "./almanac-tools.module.css";

type PlannerProps = { onAsk: (question: string, context?: string) => void };

const zones = [
  { name: "Wealth & resources", position: "Far left", prompt: "What needs a home here? Consider storage and the things you use often." },
  { name: "Recognition", position: "Far center", prompt: "What would you like this space to express? Notice what is visible on arrival." },
  { name: "Relationships", position: "Far right", prompt: "Is there a comfortable place to sit, connect, or have some privacy?" },
  { name: "Family & roots", position: "Middle left", prompt: "What feels familiar or grounding? Make room for objects that matter to you." },
  { name: "Center & balance", position: "Center", prompt: "Can you move comfortably through this area? Notice obstacles and clear routes." },
  { name: "Creativity", position: "Middle right", prompt: "Where could an unfinished project, a hobby, or a little play belong?" },
  { name: "Knowledge", position: "Near left", prompt: "Is there somewhere comfortable to read or concentrate? Check light and noise." },
  { name: "Career & path", position: "Near center", prompt: "How does the entrance work day to day? Consider keys, shoes, and a clear route inside." },
  { name: "Helpful people", position: "Near right", prompt: "What makes arriving and welcoming someone easier? Notice access and useful storage." },
];

const newHome = (id: number): HomeObservation => ({ id, name: "", light: "", noise: "", layout: "" });
const homeLabel = (home: HomeObservation, index: number) => home.name.trim() || `Home ${index + 1}`;

export function HomePlanner({ onAsk }: PlannerProps) {
  const [homes, setHomes] = useState<HomeObservation[]>([newHome(1)]);
  const nextHome = useRef(2);
  const nextCheck = useRef(5);
  const [checks, setChecks] = useState<HomeCheck[]>([
    { id: 1, label: "Visit at the times I will be home", homes: [] },
    { id: 2, label: "Check daylight and window glare", homes: [] },
    { id: 3, label: "Listen with the windows open and closed", homes: [] },
    { id: 4, label: "Walk the routes between rooms", homes: [] },
  ]);
  const [focusHome, setFocusHome] = useState(1);
  const [zone, setZone] = useState(4);
  const [zoneNotes, setZoneNotes] = useState<Record<string, string>>({});
  const activeHome = homes.find((home) => home.id === focusHome) || homes[0];
  const activeIndex = homes.indexOf(activeHome);
  const noteKey = `${activeHome.id}:${zone}`;
  const note = zoneNotes[noteKey] || "";
  const id = useId();

  function updateHome(homeId: number, field: keyof Omit<HomeObservation, "id">, value: string) {
    setHomes((current) => current.map((home) => home.id === homeId ? { ...home, [field]: value } : home));
  }

  function removeHome(homeId: number) {
    if (homes.length === 1) return;
    const remaining = homes.filter((home) => home.id !== homeId);
    setHomes(remaining);
    if (focusHome === homeId) setFocusHome(remaining[0].id);
    setChecks((current) => current.map((check) => ({ ...check, homes: check.homes.filter((id) => id !== homeId) })));
    setZoneNotes((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${homeId}:`))));
  }

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Home & place · a closer look</p>
        <h1 id={`${id}-title`}>Make room for <em>your life.</em></h1>
        <p className={styles.lead}>Compare what you notice in up to three homes. Begin with the everyday: the light, the quiet, the way a room lets you move.</p>
      </header>

      <form onSubmit={(event) => {
        event.preventDefault();
        onAsk(homes.length > 1 ? "Help me compare these homes using my observations and an entry-aligned feng shui reflection." : "How could this home better support my everyday life? Use my observations and an entry-aligned feng shui reflection.",
          homeReadingContext(homes, checks, { home: homeLabel(activeHome, activeIndex), zone: zones[zone].name, note }));
      }}>
        <div className={styles.sectionHeading}>
          <div><h2>Your homes, side by side</h2><p>A nickname is enough; no address needed.</p></div>
          <button className={styles.secondaryButton} type="button" disabled={homes.length >= 3} onClick={() => setHomes((current) => [...current, newHome(nextHome.current++)])}>
            <Plus size={15} aria-hidden="true" /> {homes.length >= 3 ? "Three homes added" : "Add a home"}
          </button>
        </div>

        <div className={styles.homeGrid}>
          {homes.map((home, index) => (
            <fieldset className={styles.homeCard} key={home.id}>
              <legend className={styles.srOnly}>Home {index + 1} observations</legend>
              <div className={styles.cardTop}>
                <span className={styles.homeNumber} aria-hidden="true">0{index + 1}</span>
                <span className={styles.eyebrow}>Your observations</span>
                {homes.length > 1 && <button type="button" className={styles.iconButton} aria-label={`Remove ${homeLabel(home, index)}`} onClick={() => removeHome(home.id)}><X size={17} aria-hidden="true" /></button>}
              </div>
              <label className={styles.field}><span>Home name</span><input required maxLength={40} value={home.name} placeholder="A name you recognize" onChange={(event) => updateHome(home.id, "name", event.target.value)} /></label>
              <label className={styles.field}><span>Natural light</span><input maxLength={65} value={home.light} placeholder="When and where is it bright?" onChange={(event) => updateHome(home.id, "light", event.target.value)} /></label>
              <label className={styles.field}><span>Noise & quiet</span><input maxLength={65} value={home.noise} placeholder="What can you hear, and when?" onChange={(event) => updateHome(home.id, "noise", event.target.value)} /></label>
              <label className={styles.field}><span>Layout & daily life</span><textarea rows={3} maxLength={130} value={home.layout} placeholder="Room to work, rest, cook, move…" onChange={(event) => updateHome(home.id, "layout", event.target.value)} /></label>
            </fieldset>
          ))}
          {homes.length < 3 && <button type="button" className={styles.addHomeCard} onClick={() => setHomes((current) => [...current, newHome(nextHome.current++)])}>
            <Plus size={24} strokeWidth={1} aria-hidden="true" /><span>Another possibility</span><small>Add a home to compare</small>
          </button>}
        </div>

        <section className={styles.checkSection} aria-labelledby={`${id}-checklist`}>
          <div className={styles.sectionHeading}><div><h2 id={`${id}-checklist`}>A checklist for the viewing</h2><p>Edit the prompts. Check only what you have observed; an empty box means unconfirmed.</p></div></div>
          <div className={styles.checkTable}>
            <div className={styles.checkHeader} style={{ gridTemplateColumns: `minmax(0, 1fr) repeat(${homes.length}, 48px) 32px` }}>
              <span>What matters to you</span>{homes.map((home, index) => <span key={home.id} title={homeLabel(home, index)}>0{index + 1}</span>)}<span />
            </div>
            {checks.map((check, index) => <div key={check.id} className={styles.checkRow} style={{ gridTemplateColumns: `minmax(0, 1fr) repeat(${homes.length}, 48px) 32px` }}>
              <textarea className={styles.checkText} rows={2} aria-label={`Checklist item ${index + 1}`} maxLength={50} value={check.label} placeholder="Add your own check" onChange={(event) => setChecks((current) => current.map((item) => item.id === check.id ? { ...item, label: event.target.value } : item))} />
              {homes.map((home, homeIndex) => <label className={styles.checkControl} key={home.id}>
                <input type="checkbox" checked={check.homes.includes(home.id)} aria-label={`${check.label || `Checklist item ${index + 1}`} observed in ${homeLabel(home, homeIndex)}`} onChange={(event) => setChecks((current) => current.map((item) => item.id === check.id ? { ...item, homes: event.target.checked ? [...item.homes, home.id] : item.homes.filter((id) => id !== home.id) } : item))} />
              </label>)}
              <button className={styles.iconButton} type="button" aria-label={`Remove checklist item ${index + 1}`} onClick={() => setChecks((current) => current.filter((item) => item.id !== check.id))}><X size={15} aria-hidden="true" /></button>
            </div>)}
          </div>
          <button className={styles.textButton} type="button" disabled={checks.length >= 6} onClick={() => setChecks((current) => [...current, { id: nextCheck.current++, label: "", homes: [] }])}><Plus size={14} aria-hidden="true" /> {checks.length >= 6 ? "Six checklist items added" : "Add a check"}</button>
        </section>

        <section className={styles.spaceSection} aria-labelledby={`${id}-space`}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>An entry-aligned lens</p><h2 id={`${id}-space`}>Look inside the space.</h2></div>
            <label className={styles.compactField}><span>Explore a home</span><select value={activeHome.id} onChange={(event) => setFocusHome(Number(event.target.value))}>{homes.map((home, index) => <option value={home.id} key={home.id}>{homeLabel(home, index)}</option>)}</select></label>
          </div>
          <div className={styles.spaceGrid}>
            <div>
              <div className={styles.bagua} role="group" aria-label="Entry-aligned bagua: choose a symbolic area">
                {zones.map((area, index) => <button className={`${styles.baguaCell} ${index === zone ? styles.baguaSelected : ""}`} type="button" key={area.name} aria-pressed={index === zone} onClick={() => setZone(index)}><small>{area.position}</small><span>{area.name}</span>{zoneNotes[`${activeHome.id}:${index}`] && <small>Note added</small>}</button>)}
              </div>
              <p className={styles.entryEdge}>↑ Align this edge with the entrance wall</p>
            </div>
            <div className={styles.spaceNote}>
              <span className={styles.eyebrow}>Your selected area</span><h3>{zones[zone].name}</h3><p>{zones[zone].prompt}</p>
              <label className={styles.field}><span>A note for this area</span><textarea rows={3} maxLength={120} value={note} placeholder="What do you notice, or want to try?" onChange={(event) => setZoneNotes((current) => ({ ...current, [noteKey]: event.target.value }))} /></label>
              <p className={styles.caption}>The BTB bagua is a symbolic, entry-aligned reflection. It does not measure energy or assess a property. No compass or flying-star calculations are made here.</p>
            </div>
          </div>
        </section>
        <footer className={styles.actionFooter}>
          <div><p>Bring your observations into a reading.</p><small>Includes the home cards, checklist, and currently selected area note. You can review and edit before asking.</small></div>
          <button type="submit" className={styles.primaryButton}>Reflect on these homes <ArrowRight size={16} aria-hidden="true" /></button>
        </footer>
      </form>
      <p className={styles.draftNotice}>An unsaved draft, kept in this open planner. It is not synced to your account; refreshing clears it.</p>
    </section>
  );
}

const events = [
  { name: "Move in", verb: "settle in", prompt: "Confirm access, transport, utilities, and time to unpack. Leave room to rest." },
  { name: "Sign a lease", verb: "begin a chapter", prompt: "Leave time to read the terms, ask questions, and confirm everyone’s availability." },
  { name: "Start a job", verb: "begin again", prompt: "Confirm the start time, the journey, and what you need to bring for your first day." },
  { name: "Wedding", verb: "come together", prompt: "Check the people, place, travel, and practical arrangements that matter to you." },
  { name: "Personal milestone", verb: "mark a moment", prompt: "Decide what would make this moment meaningful and how much preparation it needs." },
];

export function DatePlanner({ onAsk }: PlannerProps) {
  const [today, setToday] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
  const [note, setNote] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [desktop, setDesktop] = useState(false);
  const calendar = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const id = useId();
  const event = events[eventIndex];

  useEffect(() => {
    const date = localDateKey(new Date());
    setDesktop(/\bElectron\//i.test(navigator.userAgent));
    setToday(date);
    setSelected(date);
    setMonth(`${date.slice(0, 7)}-01`);
  }, []);

  useEffect(() => {
    if (pendingFocus.current) {
      calendar.current?.querySelector<HTMLButtonElement>(`button[data-date="${pendingFocus.current}"]`)?.focus();
      pendingFocus.current = null;
    }
  }, [selected, month]);

  function selectDate(date: string) {
    if (date < plannerDateLimits.min || date > plannerDateLimits.max) return;
    setSelected(date);
    setMonth(`${date.slice(0, 7)}-01`);
    setDownloadStatus("");
  }

  function calendarKey(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const weekday = parsePlannerDate(date).getUTCDay();
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const next = addPlannerDays(date, offsets[event.key]);
    if (next < plannerDateLimits.min || next > plannerDateLimits.max || next === date) return;
    pendingFocus.current = next;
    selectDate(next);
  }

  function downloadCalendar() {
    if (!selected) return;
    try {
      const text = createPlannerCalendar({ date: selected, event: event.name, note, uid: crypto.randomUUID() });
      const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `auspice-plan-${selected}.ics`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadStatus("Calendar file prepared. Open the .ics file to add this all-day plan to your calendar.");
    } catch {
      setDownloadStatus("The calendar file could not be prepared. You can add the selected date and note to your calendar manually.");
    }
  }

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Date & intention · personal planning</p>
        <h1 id={`${id}-title`}>Make time to <em>{event.verb}.</em></h1>
        <p className={styles.lead}>Choose a date, make a little space, and consider what you need for the moment ahead.</p>
        <p className={styles.limit}>Planning aid; auspicious-date calculations are not available.</p>
      </header>
      <div className={styles.eventChoices} role="group" aria-label="What are you planning?">{events.map((choice, index) => <button type="button" key={choice.name} className={`${styles.eventChoice} ${index === eventIndex ? styles.eventSelected : ""}`} aria-pressed={eventIndex === index} onClick={() => { setEventIndex(index); setDownloadStatus(""); }}>{index === eventIndex && <Check size={14} aria-hidden="true" />}{choice.name}</button>)}</div>

      {month && selected ? <div className={styles.dateLayout}>
        <div className={styles.calendarPanel}>
          <div className={styles.calendarToolbar}>
            <h2 id={`${id}-month`} aria-live="polite">{formatPlannerDate(month, { month: "long", year: "numeric" })}</h2>
            <div className={styles.calendarNav}>
              <button type="button" className={styles.iconButton} aria-label="Previous month" disabled={month <= plannerDateLimits.min} onClick={() => setMonth(shiftPlannerMonth(month, -1))}><ChevronLeft size={19} aria-hidden="true" /></button>
              <button type="button" className={styles.iconButton} aria-label="Next month" disabled={month >= "2100-12-01"} onClick={() => setMonth(shiftPlannerMonth(month, 1))}><ChevronRight size={19} aria-hidden="true" /></button>
            </div>
          </div>
          <div className={styles.calendarGrid} ref={calendar} role="group" aria-labelledby={`${id}-month`}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span className={styles.weekday} key={day} aria-hidden="true">{day}</span>)}
            {plannerMonthDays(month).map((date, index) => date ? <button type="button" data-date={date} key={date}
              className={`${styles.day} ${date === selected ? styles.selectedDay : ""} ${date === today ? styles.today : ""}`}
              tabIndex={date === selected || (selected.slice(0, 7) !== month.slice(0, 7) && date.endsWith("-01")) ? 0 : -1}
              aria-label={formatPlannerDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              aria-pressed={date === selected} aria-current={date === today ? "date" : undefined}
              onClick={() => selectDate(date)} onKeyDown={(event) => calendarKey(event, date)}>
              <span>{Number(date.slice(8))}</span><small>{date === selected ? "Selected" : date === today ? "Today" : ""}</small>
            </button> : <span className={styles.emptyDay} key={`empty-${index}`} aria-hidden="true" />)}
          </div>
          <div className={styles.calendarBottom}>
            <button type="button" className={styles.textButton} onClick={() => { const date = localDateKey(new Date()); setToday(date); selectDate(date); }}>Go to today</button>
            <label className={styles.jumpDate}><span>Jump to date</span><input type="date" value={selected} min={plannerDateLimits.min} max={plannerDateLimits.max} onChange={(event) => { if (event.target.value && event.target.validity.valid) selectDate(event.target.value); }} /></label>
          </div>
          <p className={styles.caption}>Use the arrow keys to explore dates. Dates follow your local calendar; no days are scored or ranked.</p>
        </div>

        <aside className={styles.dateAside} aria-label="Your selected plan">
          <div className={styles.selectedPanel}>
            <div className={styles.selectedHeading} aria-live="polite"><p className={styles.eyebrow}>{formatPlannerDate(selected, { weekday: "long" })}</p><h2>{formatPlannerDate(selected, { month: "long", day: "numeric" })}</h2><span className={styles.year}>{selected.slice(0, 4)} · {event.name}</span></div>
            <label className={styles.field}><span>Your intention & practical notes</span><textarea maxLength={600} rows={5} placeholder="What matters about this moment? What still needs arranging?" value={note} onChange={(event) => { setNote(event.target.value); setDownloadStatus(""); }} /></label>
            <button type="button" className={styles.primaryButton} onClick={() => onAsk(`Help me reflect on my plans to ${event.verb} on ${formatPlannerDate(selected, { month: "long", day: "numeric", year: "numeric" })}.`, dateReadingContext(selected, event.name, note))}>Reflect on this plan <ArrowRight size={16} aria-hidden="true" /></button>
            {desktop ? <p className={styles.caption}>To export a calendar file, use File → Open in browser.</p> : <button type="button" className={styles.secondaryButton} onClick={downloadCalendar}><ArrowDownToLine size={16} aria-hidden="true" /> Download calendar file</button>}
            <p className={styles.caption}>{desktop ? "Re-enter your plan in the browser; drafts do not sync. " : "An all-day .ics event with your note. "}The reading opens with your plan ready to review and edit.</p>
            <p className={styles.downloadStatus} role="status">{downloadStatus}</p>
          </div>
          <div className={styles.beforePanel}><span className={styles.eyebrow}>Before you choose</span><h3>Give the day some room.</h3><p>{event.prompt}</p></div>
        </aside>
      </div> : <p className={styles.loading} role="status">Opening your local calendar…</p>}
      <p className={styles.draftNotice}>An unsaved draft, kept in this open planner. It is not synced to your account; refreshing clears it.</p>
    </section>
  );
}
