import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, Moon, Sparkles } from 'lucide-react';
import { publicPageMetadata } from '@/lib/site';
import styles from './home.module.css';

export const metadata = publicPageMetadata({
  title: 'A Modern Almanac for Your Next Chapter',
  description: 'Find a little perspective with free tarot spreads, home and date planners, and guides to I Ching, astrology and feng shui. Guest tools need no account.',
  path: '/',
});

const traditions = [
  {
    name: 'Tarot', icon: Sparkles, slug: 'tarot', method: 'Cards & symbols', href: '/free-tarot',
    description: 'Turn one, three or ten cards from the full 78-card deck. Read the meanings and notice what comes to mind.',
    question: 'Try a free tarot spread',
  },
  {
    name: 'I Ching', icon: BookOpen, slug: 'iching', method: 'The Book of Changes', href: '/guides/i-ching-three-coin-method',
    description: 'Learn the three-coin method, six lines and the changes between them. Begin with a question that leaves room to reflect.',
    question: 'Read the casting guide',
  },
  {
    name: 'Astrology', icon: Moon, slug: 'astrology', method: 'Sun-sign reflection', href: '/guides/understanding-your-sun-sign',
    description: 'Explore sun-sign symbolism and its limits. Learn why birth time matters for a fuller chart.',
    question: 'Explore the sun-sign guide',
  },
  {
    name: 'Feng shui', icon: Compass, slug: 'fengshui', method: 'Space & everyday life', href: '/sanctuary?tool=homes',
    description: 'Record light, noise and layout. Explore an entrance-aligned bagua as a symbolic lens on the way you live.',
    question: 'Open the home planner',
  },
];

const guides = [
  { href: '/guides/better-tarot-questions', title: 'A better question is a beginning.', detail: 'How to ask a tarot question you can work with', topic: 'Tarot' },
  { href: '/guides/i-ching-three-coin-method', title: 'Three coins. Six lines. Room to reflect.', detail: 'A practical guide to casting an I Ching hexagram', topic: 'I Ching' },
  { href: '/guides/feng-shui-house-viewing', title: 'Look at a home with fresh eyes.', detail: 'Feng shui questions to bring to a house viewing', topic: 'Feng shui' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Auspice home">
          <span className={styles.seal} aria-hidden="true">吉</span>
          <span>Auspice</span>
        </Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          <Link href="/guides">The library</Link>
          <Link href="/pricing">Membership</Link>
          <Link href="/sanctuary">The almanac</Link>
          <Link href="/free-tarot" className={styles.navigationCta}>Free tarot <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </nav>
      </header>

      <main className={styles.main} id="main" tabIndex={-1}>
        <div className={styles.masthead}>
          <p>A modern almanac for everyday life</p>
          <p>Tarot · I Ching · Astrology · Feng shui</p>
        </div>

        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <h1 id="home-title">A little perspective for your next chapter.</h1>
            <p className={styles.introduction}>A new home. A career crossroads. A question you keep returning to. Explore tarot, I Ching, astrology and feng shui, with room for your own judgment.</p>
            <div className={styles.heroActions}>
              <Link href="/free-tarot" className={styles.primaryLink}>Draw a free tarot spread <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link href="#traditions" className={styles.textLink}>Find your practice</Link>
            </div>
            <p className={styles.heroNote}>No account or payment. One card, three cards or Celtic Cross.</p>
          </div>

          <aside className={styles.questionPanel} aria-labelledby="question-heading">
            <div className={styles.questionHeading}>
              <span className={styles.questionSeal} aria-hidden="true">問</span>
              <h2 id="question-heading">Start with what is on your mind.</h2>
            </div>
            <p className={styles.panelNote}>There is more than one way into a question.</p>
            <div className={styles.questionList}>
              <Link href="/free-tarot">
                <span><small>A change at work · free tarot</small><span>What deserves my attention?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/sanctuary?tool=homes">
                <span><small>A place to call home · home planner</small><span>What do I notice about this space?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/sanctuary?tool=dates">
                <span><small>A moment ahead · date planner</small><span>What would help me feel prepared?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <Link href="/guides" className={styles.synthesisLink}>
              <span>Learn how each practice works</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </section>

        <p className={styles.availability}><strong>Guest tools are open.</strong> Account access, personal readings and saved journals are temporarily unavailable. <Link href="/pricing#availability">See what is available</Link>.</p>

        <section className={styles.traditions} id="traditions" aria-labelledby="traditions-heading">
          <div className={styles.sectionHeading}>
            <h2 id="traditions-heading">Different traditions. A wider view.</h2>
            <p>Each has its own language. Follow your curiosity.</p>
          </div>
          <div className={styles.traditionGrid}>
            {traditions.map(tradition => (
              <Link href={tradition.href} className={styles.tradition} key={tradition.slug}>
                <div className={styles.traditionTitle}>
                  <tradition.icon size={25} strokeWidth={1.3} aria-hidden="true" />
                  <span className={styles.method}>{tradition.method}</span>
                </div>
                <h3>{tradition.name}</h3>
                <p>{tradition.description}</p>
                <div className={styles.traditionQuestion}><span>{tradition.question}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.journalSection} aria-labelledby="practice-heading">
          <div className={styles.journalIntro}>
            <p className={styles.kicker}>A practice you can make your own</p>
            <h2 id="practice-heading">A small pause.<br />Something to take with you.</h2>
            <p>You do not have to take every interpretation to heart. Use the symbols to notice a question, check an assumption, or name one thing you want to try.</p>
            <Link href="/guides/reflective-reading-journal" className={styles.textLink}>Try a reflection journal <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.journalProcess}>
            <div><span aria-hidden="true">01</span><div><h3>Hold a question in mind</h3><p>Choose something you can explore. The guest tarot table does not ask you to submit your question.</p></div></div>
            <div><span aria-hidden="true">02</span><div><h3>Notice what the cards bring up</h3><p>Read each meaning in its position. Consider where it fits your experience, and where it does not.</p></div></div>
            <div><span aria-hidden="true">03</span><div><h3>Write down your next step</h3><p>Use a notebook or the journal guide. Come back later and see what you think with a little distance.</p></div></div>
            <p className={styles.accountNote}>Guest spreads and planner drafts are unsaved. The account journal is temporarily unavailable.</p>
          </div>
        </section>

        <section className={styles.membership} aria-labelledby="membership-heading">
          <div className={styles.sectionHeading}><h2 id="membership-heading">Begin with an open door.</h2><Link href="/pricing" className={styles.textLink}>Membership & availability <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          <div className={styles.membershipGrid}>
            <article><p className={styles.kicker}>Available now</p><h3>Free to explore</h3><p>Guest tarot spreads, home and date planners, and the practice library. No account or payment needed.</p><Link href="/free-tarot" className={styles.textLink}>Draw a free spread <ArrowUpRight size={16} aria-hidden="true" /></Link></article>
            <article><p className={styles.kicker}>Proposed · not on sale</p><h3>Plus <span>$11.99 <small>USD / month</small></span></h3><p>Planned: 30 personal readings per month. Or $107.99 USD billed annually, with a monthly reading allowance.</p><p className={styles.priceNote}>About 25% less than twelve monthly payments. There is no subscription checkout yet.</p></article>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-heading">
          <h2 id="faq-heading">A few things to know.</h2>
          <details><summary>What can I use without an account?</summary><p>The free tarot table, home-comparison planner, date planner and all practice guides. Your tarot spread and planner drafts are not saved to an account. The date planner can download a calendar file in your browser.</p></details>
          <details><summary>Does Auspice predict what will happen?</summary><p>Auspice offers symbolic reflection. It does not verify future events, score properties or calculate auspicious dates. Astrology here focuses on approximate sun-sign symbolism, not a full natal chart. Your judgment and practical information remain part of every decision.</p></details>
          <details><summary>Can I save a personal reading or join Plus?</summary><p>Account access, personal readings and the saved journal are temporarily unavailable. Plus is a proposed membership, with no paid checkout. <Link href="/pricing">The membership page</Link> explains the free allowance and planned pricing.</p></details>
        </section>

        <section className={styles.library} aria-labelledby="library-heading">
          <div className={styles.sectionHeading}>
            <h2 id="library-heading">A little reading before your reading.</h2>
            <Link href="/guides" className={styles.textLink}>Visit the library <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.guideGrid}>
            {guides.map(guide => (
              <Link href={guide.href} className={styles.guide} key={guide.href}>
                <span className={styles.kicker}>{guide.topic}</span>
                <h3>{guide.title}</h3>
                <p>{guide.detail}</p>
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.invitation} aria-labelledby="invitation-heading">
          <span className={styles.invitationSeal} aria-hidden="true">吉</span>
          <h2 id="invitation-heading">Make a little room for perspective.</h2>
          <p>No perfect question needed.</p>
          <Link href="/free-tarot" className={styles.primaryLink}>Draw a free tarot spread <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <p className={styles.reflectionNote}>For reflection and personal exploration. Your choices remain yours.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><span className={styles.footerBrand}>Auspice</span><p>Old traditions. An open mind.</p></div>
        <nav aria-label="Footer">
          <Link href="/guides">Guides</Link>
          <Link href="/pricing">Membership</Link>
          <Link href="/download">Desktop & mobile</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="https://github.com/zinnoberHaus/auspice">Open source</a>
        </nav>
      </footer>
    </div>
  );
}
