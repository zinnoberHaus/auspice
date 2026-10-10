import type { Metadata } from "next";
import Link from "next/link";
import { socialImage } from "@/lib/site";
import { guides, guideReadingMinutes, guideSiteUrl, traditionLabels, type GuideTradition } from "@/lib/guides";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: { absolute: "Guides to Tarot, I Ching, Feng Shui & Astrology | Auspice" },
  description: "Practical guides to tarot questions, I Ching casting, feng shui at home, astrology, and reflective journaling. Learn a tradition and try a thoughtful exercise.",
  alternates: { canonical: `${guideSiteUrl}/guides` },
  twitter: { card: "summary_large_image", title: "Tarot, I Ching, Feng Shui & Astrology Guides | Auspice", description: "Practical guides, original exercises and clear methods for reflective practice.", images: [socialImage] },
  openGraph: {
    siteName: "Auspice",
    images: [socialImage],
    title: "Auspice guides · A thoughtful place to begin",
    description: "Explore tarot, I Ching, feng shui, astrology, and the art of paying attention.",
    url: `${guideSiteUrl}/guides`,
    type: "website",
  },
};

const traditions = Object.keys(traditionLabels) as GuideTradition[];

export default function GuidesPage() {
  return (
    <main className="public-main" id="main-content">
      <section className={styles.intro}>
        <p className={styles.eyebrow}>The Auspice library</p>
        <h1>A thoughtful place to begin.</h1>
        <p>Learn the practice, find a useful question, and make a little room for reflection. These guides bring the traditions into ordinary life.</p>
      </section>
      <nav className={styles.topics} aria-label="Guide topics">
        {traditions.map((tradition) => <a key={tradition} href={`#${tradition}`}>{traditionLabels[tradition]}</a>)}
      </nav>
      {traditions.map((tradition) => (
        <section key={tradition} className={styles.group} id={tradition} aria-labelledby={`${tradition}-heading`}>
          <h2 id={`${tradition}-heading`}>{traditionLabels[tradition]}</h2>
          <div className={styles.cards}>
            {guides.filter((guide) => guide.tradition === tradition).map((guide) => (
              <article key={guide.slug} className={styles.card}>
                <span className={styles.cardMeta}>{guideReadingMinutes(guide)} min read · A practical guide</span>
                <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                <p>{guide.description}</p>
                <Link className={`${styles.cardLink} text-link`} href={`/guides/${guide.slug}`} aria-label={`Read ${guide.title}`}>Explore the guide <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </section>
      ))}
      <p className={styles.editorial}>Written by Auspice Editorial. Our guides distinguish traditional methods from original reflection exercises and link to the sources behind specific details. They offer ways to explore your experience, with your judgment at the center.</p>
    </main>
  );
}
