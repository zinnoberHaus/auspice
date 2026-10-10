import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { siteUrl } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['','/free-tarot','/pricing','/guides','/download','/privacy','/terms',...guides.map(guide=>`/guides/${guide.slug}`)].map(path=>({url:`${siteUrl}${path}`}));
}
