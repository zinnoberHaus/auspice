import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides, guideReadingMinutes, guideSiteUrl, traditionLabels } from "@/lib/guides";
import { guideMetricsEnabled } from "@/lib/guide-metrics";
import GuideMetrics from "@/components/GuideMetrics";
import styles from "../guides.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const url = `${guideSiteUrl}/guides/${guide.slug}`;
  return {
    title: { absolute: `${guide.title} | Auspice` },
    description: guide.description,
    alternates: { canonical: url },
    authors: [{ name: "Auspice Editorial", url: `${guideSiteUrl}/guides` }],
    openGraph: { type: "article", title: guide.title, description: guide.description, url, publishedTime: guide.date, authors: ["Auspice Editorial"] },
    twitter: { card: "summary", title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const url = `${guideSiteUrl}/guides/${guide.slug}`;
  const publishedDate = new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${guide.date}T00:00:00Z`));
  const related = guides.filter((candidate) => candidate.slug !== guide.slug && (candidate.tradition === guide.tradition || candidate.tradition === "reflection")).slice(0, 3);
  const suggestions = related.length ? related : guides.filter((candidate) => candidate.tradition !== "reflection").slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.title,
        description: guide.description,
        mainEntityOfPage: url,
        datePublished: guide.date,
        inLanguage: "en",
        author: { "@type": "Organization", name: "Auspice Editorial", url: `${guideSiteUrl}/guides` },
        publisher: { "@type": "Organization", name: "Auspice", url: guideSiteUrl },
        citation: guide.sources.map((source) => source.url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Auspice", item: guideSiteUrl },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${guideSiteUrl}/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="public-main" id="main-content">
      <script id="guide-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <article className={styles.article}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Auspice</Link><span aria-hidden="true">/</span><Link href="/guides">Guides</Link><span aria-hidden="true">/</span><span aria-current="page">{guide.title}</span>
        </nav>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>{traditionLabels[guide.tradition]} · A practical guide</p>
          <h1>{guide.title}</h1>
          <p className={styles.description}>{guide.description}</p>
          <p className={styles.byline}>By Auspice Editorial · <time dateTime={guide.date}>{publishedDate}</time> · {guideReadingMinutes(guide)} min read</p>
        </header>
        <nav className={styles.contents} aria-label="In this guide">
          <h2>In this guide</h2>
          <ol>{guide.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol>
        </nav>
        {guide.sections.map((section, index) => (
          <section className={styles.section} id={`section-${index + 1}`} key={section.heading} aria-labelledby={`heading-${index + 1}`}>
            <h2 id={`heading-${index + 1}`}>{section.heading}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            {section.sourceRefs && <p className={styles.citation}>Source: {section.sourceRefs.map((sourceIndex, citationIndex) => {
              const source = guide.sources[sourceIndex];
              return <span key={source.url}>{citationIndex > 0 && "; "}<a href={source.url} rel="noopener noreferrer">{source.label}</a></span>;
            })}</p>}
          </section>
        ))}
        <aside className={styles.sources} aria-labelledby="sources-heading">
          <h2 id="sources-heading">Sources and further reading</h2>
          <p>Sources support the method and background details identified above. Exercises and examples are original to Auspice. A link does not imply the author reviewed or endorses this guide.</p>
          <ul>{guide.sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.label}</a></li>)}</ul>
        </aside>
        <section className={styles.cta} aria-labelledby="reflection-heading">
          <h2 id="reflection-heading">Bring a question of your own.</h2>
          <p>Take a quiet moment in your sanctuary. Explore what is on your mind, then keep the reflection that feels useful.</p>
          <GuideMetrics guide={guide.slug} href={`/sanctuary?tool=${guide.tool}`} enabled={guideMetricsEnabled(process.env)} />
        </section>
        <nav className={styles.related} aria-label="Related guides">
          <h2>Continue exploring</h2>
          <ul>{suggestions.map((suggestion) => <li key={suggestion.slug}><Link href={`/guides/${suggestion.slug}`}>{suggestion.title}</Link></li>)}</ul>
          <Link className="text-link" href="/guides">Back to all guides</Link>
        </nav>
      </article>
    </main>
  );
}
