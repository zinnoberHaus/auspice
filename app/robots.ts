import type { MetadataRoute } from 'next';
import { isPreview, siteUrl } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  // Allow app shells to be crawled so their noindex directive can be read.
  // Authentication protects private data; robots.txt is not access control.
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }], ...(!isPreview && { sitemap: `${siteUrl}/sitemap.xml` }) };
}
