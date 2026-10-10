import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { publicPageMetadata } from '@/lib/site';
import styles from './pricing.module.css';

export const metadata = publicPageMetadata({
  title: 'Membership, Pricing & Availability',
  description: 'Explore free guest tarot and planning tools. See the free account allowance and proposed Auspice Plus pricing: $11.99 monthly or $107.99 annually. Plus is not on sale.',
  path: '/pricing',
});

export default function Pricing() {
  return <>
    <a className={styles.skipLink} href="#main-content">Skip to membership</a>
    <header className="public-header">
      <Link className="public-brand" href="/">Auspice <span aria-hidden="true">吉</span></Link>
      <nav className="public-nav" aria-label="Main navigation"><Link href="/guides">The library</Link><Link href="/sanctuary">The almanac</Link><Link href="/free-tarot">Free tarot</Link></nav>
    </header>
    <main className={styles.main} id="main-content" tabIndex={-1}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Auspice</Link><span aria-hidden="true">/</span><span aria-current="page">Membership</span></nav>
      <header className={styles.intro}>
        <p className={styles.kicker}>A practice at your pace</p>
        <h1>Begin with an open door.</h1>
        <p>Draw a card, consider a space, or make time for an intention. The guest almanac is free to explore.</p>
      </header>
      <aside className={styles.availability} id="availability" aria-labelledby="availability-title">
        <h2 id="availability-title">What is available today</h2>
        <p>Guest tools and guides are open. Account access, personal readings and saved journals are temporarily unavailable. Plus is proposed and cannot be purchased yet.</p>
      </aside>
      <section className={styles.plans} aria-label="Free features and proposed membership">
        <article className={styles.plan}>
          <p className={styles.status}>Available now · no account</p>
          <h2>The open almanac</h2>
          <p className={styles.price}>Free</p>
          <p className={styles.description}>A little room to explore.</p>
          <ul>
            <li>One-card, three-card and Celtic Cross tarot spreads</li>
            <li>Card meanings and reflection prompts</li>
            <li>Home-comparison notes and an entry-aligned bagua</li>
            <li>Date planning and browser calendar export</li>
            <li>The complete practice-guide library</li>
          </ul>
          <Link href="/free-tarot" className={styles.primaryLink}>Draw a free spread <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <p className={styles.note}>Guest spreads and planner drafts are unsaved. No payment method needed.</p>
        </article>
        <article className={styles.plan}>
          <p className={styles.status}>Temporarily unavailable</p>
          <h2>Your free account</h2>
          <p className={styles.price}>Free</p>
          <p className={styles.description}>Personal readings and a place to return.</p>
          <ul>
            <li>3 completed personal readings per calendar month</li>
            <li>Tarot, I Ching, astrology and feng shui</li>
            <li>Synthesis across traditions within the same allowance</li>
            <li>Saved readings and private journal notes</li>
            <li>Export and deletion of your account data</li>
          </ul>
          <p className={styles.unavailable}>Account access is being restored. These features need a verified account.</p>
          <p className={styles.note}>The free allowance resets on the first of each month in UTC.</p>
        </article>
        <article className={`${styles.plan} ${styles.plus}`}>
          <p className={styles.status}>Proposed · not on sale</p>
          <h2>Auspice Plus</h2>
          <p className={styles.price}>$11.99 <span>USD / month</span></p>
          <p className={styles.annual}><strong>$107.99 USD billed annually</strong><span>About $9/month; about 25% less than twelve monthly payments.</span></p>
          <ul>
            <li>Proposed allowance of 30 personal readings per month</li>
            <li>The same four traditions, including synthesis</li>
            <li>Saved readings, journal notes, export and deletion</li>
            <li>Annual membership would replenish the allowance monthly</li>
          </ul>
          <p className={styles.unavailable}>There is no paid checkout or active subscription offer. These prices and allowances are proposed.</p>
          <p className={styles.note}>USD reference pricing. Any applicable taxes would be shown before payment when subscriptions become available.</p>
        </article>
      </section>
      <section className={styles.methods} aria-labelledby="methods-heading">
        <div><p className={styles.kicker}>Different traditions, distinct methods</p><h2 id="methods-heading">A perspective you can question.</h2></div>
        <p>Tarot draws and I Ching casts supply symbols to reflect on. Astrology uses an approximate sun-sign estimate; feng shui uses an entry-aligned lens on your observations. Membership would change the reading allowance, not make an interpretation more certain. <Link href="/guides">Explore the methods in the library</Link>.</p>
      </section>
      <section className={styles.faq} aria-labelledby="questions-heading">
        <h2 id="questions-heading">Before you begin</h2>
        <details><summary>What counts as a personal reading?</summary><p>One submitted question and its completed interpretation. A synthesis that considers several traditions counts as one reading. A new question or follow-up interpretation uses another reading. Revisiting a result, writing journal notes and exporting do not. Failed readings do not use the allowance.</p></details>
        <details><summary>Is the free tarot table part of that allowance?</summary><p>No. The <Link href="/free-tarot">guest tarot table</Link> gives card meanings and prompts to interpret yourself, without an account. It does not save a personal reading. Personal readings use a submitted question and a separate draw or cast.</p></details>
        <details><summary>Can I use the home and date planners now?</summary><p>Yes. You can compare your observations about up to three homes, explore symbolic bagua prompts, and plan a date with a practical note. These are unsaved drafts. Calendar-file export works in the browser. The planners do not score homes or calculate auspicious dates; their personal-reading handoff requires account access.</p></details>
        <details><summary>Can I subscribe, start a trial or join an email waitlist?</summary><p>No subscription checkout, trial or email waitlist is available here. Plus pricing is a proposal. Check this page for availability; no payment or subscription is created by visiting.</p></details>
        <details><summary>Would annual membership mean 360 readings at once?</summary><p>No. The proposed annual plan would cost $107.99 USD upfront and provide 30 readings each monthly allowance period. Unused readings would not roll over. Final billing and cancellation terms will be shown before subscriptions become available.</p></details>
        <details><summary>Can these tools tell me which decision is right?</summary><p>They offer prompts for reflection, not verified predictions or professional advice. Use facts, practical checks and appropriate advice for housing, career, financial, legal or health decisions. You choose what to take from a reading.</p></details>
      </section>
      <section className={styles.closing} aria-labelledby="closing-heading"><span aria-hidden="true">吉</span><h2 id="closing-heading">Start with a small pause.</h2><p>No account. No payment. Just a question to sit with.</p><Link href="/free-tarot" className={styles.primaryLink}>Draw a free tarot spread <ArrowUpRight size={16} aria-hidden="true" /></Link></section>
    </main>
    <footer className="public-footer"><Link href="/">Auspice</Link><nav aria-label="Footer navigation"><Link href="/guides">Guides</Link>{' · '}<Link href="/privacy">Privacy</Link>{' · '}<Link href="/terms">Terms</Link></nav></footer>
  </>;
}
