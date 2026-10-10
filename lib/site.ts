import type { Metadata } from 'next';

/** Canonical origin is configured explicitly, never inferred from a request. */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://auspice-red.vercel.app').origin;
export const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';
export const siteDescription = 'A modern almanac for life’s next chapter. Try free tarot spreads, explore I Ching, astrology and feng shui, and make room for reflection.';
export const socialImage = { url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: 'Auspice — A little perspective for your next chapter.' };

export function publicPageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | Auspice`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: { type: 'website', siteName: 'Auspice', title: fullTitle, description, url: `${siteUrl}${path}`, images: [socialImage] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [socialImage] },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
