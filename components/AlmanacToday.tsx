"use client";

import { useEffect, useState } from "react";
import styles from "./almanac-today.module.css";

type Destination = "tarot" | "iching" | "astrology" | "fengshui" | "synthesis" | "journal" | "homes" | "dates";
const practices: { id: Destination; mark: string; name: string; description: string }[] = [
  { id: "tarot", mark: "✧", name: "Tarot", description: "A card, a question, another way to see." },
  { id: "iching", mark: "易", name: "I Ching", description: "Six lines to sit with what is changing." },
  { id: "astrology", mark: "☉", name: "Astrology", description: "Explore the symbolism of your sun sign." },
  { id: "fengshui", mark: "宅", name: "Feng shui", description: "Read your space with a little more care." },
];

export default function AlmanacToday({ onSelect, name }: { onSelect: (tool: Destination) => void; name?: string }) {
  const [date, setDate] = useState<Date | null>(null);
  const [card, setCard] = useState<{ name: string; detail: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setDate(new Date()); }, []);
  async function draw() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/draw", { cache: "no-store" });
      if (!response.ok) throw new Error("Your card couldn’t be drawn. Please try again.");
      setCard(await response.json());
    } catch { setError("Your card couldn’t be drawn. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className={styles.almanac}>
    <section className={styles.opening}>
      <div className={styles.date}>
        <p className={styles.label}>The almanac{name ? ` · for ${name.split(" ")[0]}` : " · a daily practice"}</p>
        <h1>{date ? date.toLocaleDateString("en", { weekday: "long" }) : "Today"}</h1>
        <p className={styles.fullDate}>{date ? date.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" }) : "Make a little room for reflection."}</p>
        <div className={styles.dateNotes}>
          <span className={styles.cjk}>日常</span><span>Old traditions. Your everyday life.</span>
          <span className={styles.cjk}>問</span><span>Start with the question you are carrying.</span>
        </div>
      </div>
      <div className={styles.invitation}>
        <p className={styles.label}>A thought to begin with</p>
        <h2>You don’t have to see the whole path to take one considered step.</h2>
        <button className={styles.council} onClick={() => onSelect("synthesis")}>
          <span className={styles.seal}>合</span>
          <span><strong>Let the traditions meet</strong><small>One question, several perspectives. Make room for where they differ.</small></span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
    <section className={styles.dailyGrid} aria-label="Your daily practice">
      <div className={styles.intentions}>
        <div><h2><span className={styles.cjk}>宜</span> Make room for</h2><ul><li>A question with room to grow</li><li>One small, practical step</li><li>A quieter corner</li><li>Your own judgment</li></ul></div>
        <div><h2 className={styles.caution}><span className={styles.cjk}>忌</span> Leave behind</h2><ul><li>The need for a certain answer</li><li>A decision made in a rush</li><li>Someone else’s expectations</li><li>The idea that a card decides</li></ul></div>
        <p>Reflection prompts, rather than a prediction for this date.</p>
      </div>
      <div className={styles.cardSection}>
        <p className={styles.label}>A card for this moment</p>
        <div className={styles.cardRow}>
          <button className={`${styles.card} ${card ? styles.revealed : ""}`} onClick={draw} disabled={busy} aria-label={card ? "Draw another tarot card" : "Draw a tarot card"}>
            <span aria-hidden="true">{card ? "☉" : "吉"}</span><small>{busy ? "Drawing…" : card ? "Your card" : "Turn a card"}</small>
          </button>
          <div aria-live="polite"><h2>{card?.name || "An open mind."}</h2><p>{card?.detail || "A free draw from all 78 cards. Notice what its imagery brings to mind."}</p><button className={styles.textButton} onClick={draw} disabled={busy}>{busy ? "Drawing…" : card ? "Draw again ↗" : "Draw a card ↗"}</button></div>
        </div>
        {error && <p role="alert">{error}</p>}
        <small className={styles.note}>A fresh random draw each time. Guest draws aren’t saved.</small>
      </div>
      <div className={styles.journal}>
        <p className={styles.label}>Leave yourself a note</p>
        <span className={styles.journalMark} aria-hidden="true">記</span>
        <h2>What is asking for your attention?</h2>
        <p>Your readings and the thoughts you leave beside them, together in one private place.</p>
        <button className={styles.textButton} onClick={() => onSelect("journal")}>Open your journal ↗</button>
      </div>
    </section>
    <section className={styles.practices}>
      <div className={styles.sectionHead}><h2>Four ways into a question</h2><span className={styles.label}>Different traditions, distinct voices</span></div>
      <div className={styles.practiceGrid}>{practices.map(practice => <button key={practice.id} onClick={() => onSelect(practice.id)}><span className={styles.practiceMark} aria-hidden="true">{practice.mark}</span><h3>{practice.name}</h3><p>{practice.description}</p><span className={styles.explore}>Explore <span aria-hidden="true">↗</span></span></button>)}</div>
    </section>
    <section className={styles.lifeGrid} aria-label="Bring it into everyday life">
      <button onClick={() => onSelect("homes")}><span className={styles.cjk}>宅</span><div><h2>A place to call home</h2><p>Put your notes about light, layout and daily life side by side.</p></div><span aria-hidden="true">↗</span></button>
      <button onClick={() => onSelect("dates")}><span className={styles.cjk}>時</span><div><h2>Make room on the calendar</h2><p>Choose a date, name your intention, and plan a next step.</p></div><span aria-hidden="true">↗</span></button>
    </section>
    <footer className={styles.footer}><span>Wisdom to explore. Space to decide.</span><a href="/guides">Read the practice guides ↗</a></footer>
  </div>;
}
