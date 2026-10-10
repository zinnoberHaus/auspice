import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, Moon, Sparkles } from 'lucide-react';
import styles from './home.module.css';

export const metadata = { alternates: { canonical: '/' } };

const traditions = [
  {
    name: 'Tarot', icon: Sparkles, slug: 'tarot', method: 'Cards & symbols',
    description: 'A three-card reading to consider what matters, what needs attention, and a next step.',
    question: 'What am I not seeing yet?',
  },
  {
    name: 'I Ching', icon: BookOpen, slug: 'iching', method: 'The Book of Changes',
    description: 'A three-coin cast, changing lines, and a different way to meet what is unfolding.',
    question: 'How can I meet this change?',
  },
  {
    name: 'Astrology', icon: Moon, slug: 'astrology', method: 'Sun-sign reflection',
    description: 'Explore the seasonal symbolism of your sun sign as a prompt for understanding yourself.',
    question: 'What could I make room for?',
  },
  {
    name: 'Feng shui', icon: Compass, slug: 'fengshui', method: 'Space & everyday life',
    description: 'Consider your home through an entrance-aligned bagua and the way you actually live.',
    question: 'What would help this space feel better?',
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
          <Link href="/account">Sign in</Link>
          <Link href="/sanctuary" className={styles.navigationCta}>Open Auspice <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </nav>
      </header>

      <main className={styles.main} id="main" tabIndex={-1}>
        <div className={styles.masthead}>
          <p>A modern almanac for everyday life</p>
          <p>Tarot · I Ching · Astrology · Feng shui</p>
        </div>

        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <h1 id="home-title">Four old ways of knowing.<br />One place to begin.</h1>
            <p className={styles.introduction}>A new home. A career crossroads. A question you keep returning to. Bring it to Auspice, explore another perspective, and find a small next step.</p>
            <div className={styles.heroActions}>
              <Link href="/sanctuary" className={styles.primaryLink}>Begin with a free card <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link href="#traditions" className={styles.textLink}>Find your practice</Link>
            </div>
            <p className={styles.heroNote}>No account needed for your first card.</p>
          </div>

          <aside className={styles.questionPanel} aria-labelledby="question-heading">
            <div className={styles.questionHeading}>
              <span className={styles.questionSeal} aria-hidden="true">問</span>
              <h2 id="question-heading">Start with what is on your mind.</h2>
            </div>
            <p className={styles.panelNote}>There is more than one way into a question.</p>
            <div className={styles.questionList}>
              <Link href="/sanctuary?tool=tarot">
                <span><small>A change at work</small><span>What matters in my next chapter?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/sanctuary?tool=fengshui">
                <span><small>A place to call home</small><span>How could my space support me?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/sanctuary?tool=iching">
                <span><small>Something still unfolding</small><span>How can I move with this change?</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <Link href="/sanctuary?tool=synthesis" className={styles.synthesisLink}>
              <span>Or bring several traditions together</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </section>

        <section className={styles.traditions} id="traditions" aria-labelledby="traditions-heading">
          <div className={styles.sectionHeading}>
            <h2 id="traditions-heading">Different traditions. A wider view.</h2>
            <p>Each has its own language. Follow your curiosity.</p>
          </div>
          <div className={styles.traditionGrid}>
            {traditions.map(tradition => (
              <Link href={`/sanctuary?tool=${tradition.slug}`} className={styles.tradition} key={tradition.slug}>
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

        <section className={styles.journalSection} aria-labelledby="journal-heading">
          <div className={styles.journalIntro}>
            <p className={styles.kicker}>Your private journal</p>
            <h2 id="journal-heading">A reading is a beginning.<br />Return to what unfolds.</h2>
            <p>Save the question, the symbols, and your own reflections. Notice what still resonates when you come back with a little distance.</p>
            <Link href="/sanctuary?tool=journal" className={styles.textLink}>Open your journal <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.journalProcess}>
            <div><span aria-hidden="true">01</span><div><h3>Bring a real question</h3><p>A few plain words are enough. Choose a tradition or ask for a synthesis.</p></div></div>
            <div><span aria-hidden="true">02</span><div><h3>Consider the reading</h3><p>See the symbols and their interpretation, with a small practice to try.</p></div></div>
            <div><span aria-hidden="true">03</span><div><h3>Make your own meaning</h3><p>Add a private note. Revisit, export, or delete your saved reflections.</p></div></div>
            <p className={styles.accountNote}>Personal readings and your journal use an account. <Link href="/pricing">See the free allowance</Link>.</p>
          </div>
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
          <Link href="/sanctuary" className={styles.primaryLink}>Open your almanac <ArrowUpRight size={17} aria-hidden="true" /></Link>
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
