import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin=process.env.NEXT_PUBLIC_SITE_URL || 'https://auspice-red.vercel.app';
  return ['','/pricing','/guides','/download','/privacy','/terms',...guides.map(guide=>`/guides/${guide.slug}`)].map(path=>({url:`${origin}${path}`,changeFrequency:'monthly',priority:path===''?1:path.startsWith('/guides/')?0.8:0.5}));
}
