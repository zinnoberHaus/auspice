import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, Moon, Sparkles } from 'lucide-react';
import { AuspiceLogo, CelestialDial } from '@/components/AuspiceApp';
export const metadata = { alternates: { canonical: '/' } };
const traditions = [
  { name: 'Tarot', icon: Sparkles, slug: 'tarot', description: 'A different way to look at the question you have been carrying.' },
  { name: 'I Ching', icon: BookOpen, slug: 'iching', description: 'Meet change with the wisdom of the Book of Changes.' },
  { name: 'Astrology', icon: Moon, slug: 'astrology', description: 'Explore the seasonal symbolism of your sun sign.' },
  { name: 'Feng shui', icon: Compass, slug: 'fengshui', description: 'Consider how your space can support the life you want to live.' },
];
export default function Home() {
  return <>
    <header className="public-header"><Link href="/" className="public-brand" aria-label="Auspice home"><AuspiceLogo /></Link><nav className="public-nav" aria-label="Main navigation"><Link href="/guides">The library</Link><Link href="/pricing">Membership</Link><Link href="/account">Sign in</Link></nav></header>
    <main className="public-main" id="main">
      <section className="public-hero"><div className="hero-copy"><p>A space for the questions that matter.</p><h1>A little perspective.<br/>A deeper connection.</h1><p>Ancient traditions, a moment of stillness, and a fresh way forward. Explore what is unfolding in your life with Auspice.</p><div className="hero-actions"><Link className="button" href="/sanctuary">Enter your sanctuary <ArrowUpRight size={17}/></Link><Link className="text-link" href="/guides">Find your first practice</Link></div><small>Begin with a free card. Stay for what you discover.</small></div><div className="hero-visual"><CelestialDial /></div></section>
      <section className="public-section"><div className="section-heading"><h2>Many traditions. Your own path.</h2><p>Follow your curiosity. Each practice offers its own language for reflection.</p></div><div className="feature-grid">{traditions.map(t => <Link className="feature-card" href={`/sanctuary?tool=${t.slug}`} key={t.slug}><t.icon size={27} strokeWidth={1.3}/><h3>{t.name}</h3><p>{t.description}</p><span className="text-link">Explore {t.name} <ArrowUpRight size={15}/></span></Link>)}</div></section>
      <section className="public-section reflection-section"><div><h2>Life does not arrive<br/>with all the answers.</h2><p>A career crossroads. A new home. A relationship changing shape. Bring your question, consider another perspective, and choose a small next step.</p></div><blockquote>What would change if I approached this with curiosity instead of certainty?</blockquote></section>
      <section className="public-section"><div className="section-heading"><h2>A practice that grows with you.</h2><p>Keep what resonates. Return to it when life looks different.</p></div><div className="feature-grid"><div className="feature-card"><h3>Start with a question</h3><p>Choose a tradition, or invite several perspectives into one reflection.</p></div><div className="feature-card"><h3>Make it personal</h3><p>Receive a thoughtful interpretation rooted in your question and the symbols drawn.</p></div><div className="feature-card"><h3>Notice what unfolds</h3><p>Keep a private journal, add your reflections, and return to earlier readings.</p></div></div></section>
      <section className="public-section home-invitation"><h2>Your next chapter begins with a pause.</h2><p>No perfect question needed.</p><Link href="/sanctuary" className="button">Take a moment for yourself</Link><p className="muted">For reflection and personal exploration. Your choices remain yours.</p></section>
    </main><footer className="public-footer"><span>Auspice · A practice of possibility</span><nav aria-label="Footer"><Link href="/guides">Guides</Link><Link href="/download">Desktop & mobile</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="https://github.com/zinnoberHaus/auspice">Open source</a></nav></footer>
  </>;
}
