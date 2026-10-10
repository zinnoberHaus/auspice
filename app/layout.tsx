import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, IBM_Plex_Mono, Libre_Caslon_Display, Libre_Caslon_Text, Noto_Serif_TC } from 'next/font/google';
import './globals.css';
import { isPreview, jsonLd, siteDescription, siteUrl } from '@/lib/site';
const serif = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-serif' });
const reading = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], display: 'swap', variable: '--font-reading' });
const sans = Hanken_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });
// CJK glyph subsets load from our own build assets only when used; avoid preloading the full family.
const cjk = Noto_Serif_TC({ weight: 'variable', display: 'swap', preload: false, variable: '--font-cjk' });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Auspice — Tarot, reflection & a modern almanac', template: '%s | Auspice' },
  description: siteDescription,
  openGraph: { type: 'website', siteName: 'Auspice', title: 'Auspice — A little perspective for your next chapter', description: siteDescription },
  twitter: { card: 'summary_large_image' },
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
  applicationName: 'Auspice',
  appleWebApp: { capable: true, title: 'Auspice', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3EEE4' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${serif.variable} ${reading.variable} ${sans.variable} ${mono.variable} ${cjk.variable}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Auspice', url: siteUrl, logo: `${siteUrl}/icon.svg`, sameAs: ['https://github.com/zinnoberHaus/auspice'] },
        { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Auspice', url: siteUrl, description: siteDescription, inLanguage: 'en', publisher: { '@id': `${siteUrl}/#organization` } },
      ],
    }) }} />
    {children}</body></html>;
}
