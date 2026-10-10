import type { Metadata, Viewport } from 'next';
import { Libre_Caslon_Display, DM_Sans } from 'next/font/google';
import './globals.css';
const serif = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif' });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://auspice-red.vercel.app'),
  title: { default: 'Auspice — A little perspective. A deeper connection.', template: '%s | Auspice' },
  description: 'Explore tarot, I Ching, astrology and feng shui in one quiet space. Thoughtful readings for home, career and everyday life, with a private reflection journal.',
  openGraph: { type: 'website', siteName: 'Auspice', title: 'Auspice — Make space for a new perspective', description: 'Tarot, I Ching, astrology and feng shui. Traditions to explore. Space to reflect.' },
  twitter: { card: 'summary_large_image' },
  applicationName: 'Auspice',
  appleWebApp: { capable: true, title: 'Auspice', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#614264' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
