"use client";

import { useState } from "react";
import styles from "./tarot-table.module.css";

type Spread = "one" | "three" | "cross";
type Card = { name: string; detail: string };
const positions: Record<Spread, string[]> = {
  one: ["A perspective"],
  three: ["Situation", "Perspective", "Next step"],
  cross: ["The present", "The challenge", "The foundation", "The recent past", "What is possible", "What comes next", "Your approach", "Your surroundings", "Hopes & fears", "A possible direction"],
};
const spreads: { id: Spread; label: string }[] = [{ id: "one", label: "One card" }, { id: "three", label: "Three cards" }, { id: "cross", label: "Celtic Cross · 10" }];

function CardFace({ name, number }: { name: string; number: number }) {
  return <><span className={styles.cardNumber}>{String(number).padStart(2, "0")}</span><svg className={styles.art} viewBox="0 0 70 70" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="35" cy="35" r="24"/><circle cx="35" cy="35" r="18"/><path d="M35 5v60M5 35h60M14 14l42 42M14 56l42-42"/><path d="m35 19 5 11 12 5-12 5-5 11-5-11-12-5 12-5Z" fill="currentColor" stroke="none"/></svg><span className={styles.cardName}>{name}</span></>;
}

export default function TarotTable({ headingLevel = 1 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const [spread, setSpread] = useState<Spread>("three");
  const [cards, setCards] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const labels = positions[spread];
  async function shuffle() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/draw?spread=${spread}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Draw failed");
      const data = await response.json();
      setCards(data.cards); setRevealed([]); setSelected(0);
    } catch { setError("The cards couldn’t be drawn. Please try again."); }
    finally { setBusy(false); }
  }
  const showing = cards[selected] && revealed.includes(selected);
  return <section className={styles.table} aria-labelledby="tarot-table-title">
    <div className={styles.heading}><div><p className={styles.label}>Cast / tarot</p><Heading id="tarot-table-title">Lay the question on the table.</Heading><p>A free, unsaved spread. Turn the cards at your own pace.</p></div><a href="/guides/better-tarot-questions">A guide to asking ↗</a></div>
    <div className={styles.toolbar}>
      <div className={styles.spreads} role="group" aria-label="Choose a tarot spread">{spreads.map(item => <button key={item.id} aria-pressed={spread === item.id} disabled={busy} onClick={() => { setSpread(item.id); setCards([]); setRevealed([]); setSelected(0); setError(""); }}>{item.label}</button>)}</div>
      <button className={styles.shuffle} disabled={busy} onClick={shuffle}>{busy ? "Shuffling…" : cards.length ? "Shuffle a new spread" : "Shuffle & lay the cards"}</button>
    </div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <div className={styles.workspace}>
      <div className={`${styles.cloth} ${spread === "cross" ? styles.cross : styles.row}`} aria-label={`${spreads.find(item => item.id === spread)?.label} spread`}>
        {labels.map((label, index) => <div key={`${spread}-${index}`} className={styles.slot} data-position={index + 1}>
          <button disabled={busy || !cards.length} className={`${styles.card} ${revealed.includes(index) ? styles.front : styles.back} ${cards.length && selected === index ? styles.selected : ""}`} aria-label={revealed.includes(index) ? `${index + 1}. ${label}: ${cards[index].name}. Show meaning` : `Reveal card ${index + 1}: ${label}`} aria-pressed={cards.length ? selected === index && revealed.includes(index) : undefined} onClick={() => { setSelected(index); setRevealed(previous => previous.includes(index) ? previous : [...previous, index]); }}>
            {revealed.includes(index) ? <CardFace name={cards[index].name} number={index + 1}/> : <><span className={styles.backSeal} aria-hidden="true">吉</span><span>{cards.length ? "Turn this card" : "Awaiting a draw"}</span></>}
          </button><span className={styles.position}>{index + 1}. {label}</span>
        </div>)}
        <div className={styles.clothNote}>{!cards.length ? "Hold a question in mind, then shuffle." : `${revealed.length} of ${cards.length} cards turned`}</div>
      </div>
      <aside className={styles.detail} aria-live="polite">
        {showing ? <><p className={styles.label}>{selected + 1} / {labels[selected]}</p><div className={`${styles.card} ${styles.front} ${styles.detailCard}`} aria-hidden="true"><CardFace name={cards[selected].name} number={selected + 1}/></div><h2>{cards[selected].name}</h2><p className={styles.meaning}>{cards[selected].detail}</p><h3>A question to sit with</h3><p>What does this image bring to mind about {labels[selected].toLowerCase()}? Notice your first response before deciding what it means to you.</p></> : <><span className={styles.emptyMark} aria-hidden="true">問</span><h2>{cards.length ? "Begin anywhere." : "A little room for possibility."}</h2><p>{cards.length ? "Choose a card to turn it over. Its meaning and position will appear here." : "Each spread is drawn from the complete 78-card deck, without repeating a card within the spread."}</p></>}
        <div className={styles.method}>Cards are drawn upright. Position meanings are prompts for reflection, not a prediction of events.</div>
      </aside>
    </div>
    <p className={styles.footnote}>This card table is separate from a saved personal reading, which draws its own cards. Leaving this page clears this spread.</p>
  </section>;
}
