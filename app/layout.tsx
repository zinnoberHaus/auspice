import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, IBM_Plex_Mono, Libre_Caslon_Display, Libre_Caslon_Text, Noto_Serif_TC } from 'next/font/google';
import './globals.css';
const serif = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-serif' });
const reading = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], display: 'swap', variable: '--font-reading' });
const sans = Hanken_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });
// CJK glyph subsets load from our own build assets only when used; avoid preloading the full family.
const cjk = Noto_Serif_TC({ weight: 'variable', display: 'swap', preload: false, variable: '--font-cjk' });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://auspice-red.vercel.app'),
  title: { default: 'Auspice — A little perspective. A deeper connection.', template: '%s | Auspice' },
  description: 'Explore tarot, I Ching, astrology and feng shui in one quiet space. Thoughtful readings for home, career and everyday life, with a private reflection journal.',
  openGraph: { type: 'website', siteName: 'Auspice', title: 'Auspice — Make space for a new perspective', description: 'Tarot, I Ching, astrology and feng shui. Traditions to explore. Space to reflect.' },
  twitter: { card: 'summary_large_image' },
  applicationName: 'Auspice',
  appleWebApp: { capable: true, title: 'Auspice', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F3EEE4' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${serif.variable} ${reading.variable} ${sans.variable} ${mono.variable} ${cjk.variable}`}>{children}</body></html>;
}
