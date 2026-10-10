import Link from 'next/link';
import TarotTable from '@/components/TarotTable';
import { jsonLd, publicPageMetadata, siteUrl } from '@/lib/site';
import styles from './tarot.module.css';

export const metadata = publicPageMetadata({
  title: 'Free Tarot Reading — One Card, Three Cards & Celtic Cross',
  description: 'Draw a free tarot spread from all 78 cards. Turn each card for its meaning, then reflect on your question. No account or payment needed; spreads are unsaved.',
  path: '/free-tarot',
});

export default function FreeTarot() {
  return <>
    <a className={styles.skip} href="#main-content">Skip to the tarot table</a>
    <header className="public-header">
      <Link className="public-brand" href="/">Auspice <span aria-hidden="true">吉</span></Link>
      <nav className="public-nav" aria-label="Main navigation"><Link href="/guides">The library</Link><Link href="/pricing">Membership</Link><Link href="/sanctuary">Open almanac</Link></nav>
    </header>
    <main className={styles.main} id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Auspice', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Free tarot reading', item: `${siteUrl}/free-tarot` },
        ],
      }) }} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Auspice</Link><span aria-hidden="true">/</span><span aria-current="page">Free tarot</span></nav>
      <header className={styles.intro}>
        <h1>A free tarot reading.<br />A fresh way into your question.</h1>
        <p>A career crossroads, a conversation, or an ordinary Tuesday. Hold one question in mind, choose a spread, and turn the cards for a few prompts to think with.</p>
        <p className={styles.note}>All 78 cards · No account or payment · Your spread stays unsaved</p>
      </header>
      <TarotTable headingLevel={2} />
      <section className={styles.explanation} aria-labelledby="how-to">
        <div><h2 id="how-to">How to read your spread</h2><p>You do not need to know every card. Begin with what you notice, then use the card meaning and its position to open up a question.</p><Link href="/guides/better-tarot-questions">Learn to ask a useful tarot question</Link></div>
        <ol>
          <li><h3>Choose something you can explore</h3><p>Try “What could help me approach this conversation?” Hold the question privately; this table does not ask you to type or submit it.</p></li>
          <li><h3>Shuffle, then turn each card</h3><p>Each draw chooses from the complete 78-card deck. Cards appear upright, with no repeats within a spread. Select a revealed card to read its meaning again.</p></li>
          <li><h3>Find one small next step</h3><p>Separate the symbol from the facts you know. Note a question to ask, an assumption to check, or a small action you can take. You decide what is useful.</p></li>
        </ol>
      </section>
      <section className={styles.spreads} aria-labelledby="spreads-heading">
        <h2 id="spreads-heading">Which tarot spread should I choose?</h2>
        <div><article><h3>One card</h3><p>A single perspective for a short pause. Ask what deserves your attention, read the meaning, and let one observation be enough.</p></article>
          <article><h3>Three cards</h3><p>Situation, perspective, next step. A useful starting point when you want to consider both where you are and how you could respond.</p><Link href="/guides/tarot-career-reflection">Try a career reflection exercise</Link></article>
          <article><h3>Celtic Cross</h3><p>Ten positions for a longer reflection, including the challenge, your approach, surroundings, hopes and fears. Treat future-facing positions as possibilities to consider.</p></article></div>
      </section>
      <section className={styles.faq} aria-labelledby="questions-heading">
        <h2 id="questions-heading">Before you begin</h2>
        <details><summary>Is this tarot reading really free?</summary><p>Yes. This card table needs no account or payment. You can choose a new spread whenever you like. It gives card meanings and reflection prompts; it does not create a saved personal interpretation.</p></details>
        <details><summary>Can tarot tell me what will happen?</summary><p>Auspice uses tarot for symbolic reflection, not verified predictions. A card cannot establish another person’s thoughts or decide a medical, legal, financial or property question. Use reliable information and appropriate advice for those decisions.</p></details>
        <details><summary>Will my cards be saved?</summary><p>No. Leaving or refreshing the page clears the spread. If you want to revisit it, write down the card names, positions and your own observations. <Link href="/guides/reflective-reading-journal">Our journal guide</Link> offers a simple format you can use anywhere.</p></details>
        <details><summary>How is this different from a personal reading?</summary><p>The free table lets you interpret a draw yourself. Personal readings use a submitted question, draw a separate set of symbols and save a written interpretation in an account. Account access is temporarily unavailable; the guest card table remains open. <Link href="/pricing">See membership and availability</Link>.</p></details>
      </section>
      <aside className={styles.next}><h2>Bring your question into everyday life.</h2><p>Compare what you notice about a home, or make room for an intention on your calendar.</p><div><Link href="/sanctuary?tool=homes">Open the home planner</Link><Link href="/sanctuary?tool=dates">Open the date planner</Link></div><small>Guest planner drafts are unsaved. These tools do not score properties or calculate auspicious dates.</small></aside>
    </main>
    <footer className="public-footer"><Link href="/">Auspice</Link><nav aria-label="Footer navigation"><Link href="/guides">Guides</Link>{' · '}<Link href="/privacy">Privacy</Link>{' · '}<Link href="/terms">Terms</Link></nav></footer>
  </>;
}
