import assert from 'node:assert/strict';

// Read-only HTTP smoke check. No sign-ins, analytics events or personal readings.
const base = new URL(process.env.AUSPICE_TEST_URL || 'http://localhost:3000');
const preview = process.env.AUSPICE_EXPECT_NOINDEX === '1';
const canonicalOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://auspice-red.vercel.app').origin;
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: 'error' });
  assert.equal(response.status, 200, `${path}: status`);
  return { response, body: await response.text() };
}
const { body: sitemap } = await get('/sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(decode(match[1])));
assert.ok(urls.some(url => url.pathname === '/free-tarot'), 'Tarot acquisition page in sitemap');
assert.equal(new Set(urls.map(String)).size, urls.length, 'No duplicate sitemap URLs');
const titles = new Set();
for (const url of urls) {
  assert.equal(url.origin, canonicalOrigin, 'Canonical sitemap origin');
  assert.ok(!/^\/(api|account|admin|sanctuary)(\/|$)/.test(url.pathname), 'No private sitemap entry');
  const { response, body } = await get(url.pathname);
  const links = [...body.matchAll(/<link\s[^>]*>/g)].map(match => attributes(match[0]));
  const meta = [...body.matchAll(/<meta\s[^>]*>/g)].map(match => attributes(match[0]));
  const find = key => meta.find(item => item.name === key || item.property === key)?.content;
  const canonical = links.filter(link => link.rel === 'canonical');
  assert.equal(canonical.length, 1, `${url.pathname}: one canonical`);
  assert.equal(new URL(canonical[0].href).href, url.href, `${url.pathname}: canonical matches sitemap`);
  const title = decode(body.match(/<title>([^<]+)<\/title>/)?.[1] || '');
  assert.ok(title && !titles.has(title), `${url.pathname}: unique title`);
  titles.add(title);
  assert.ok(find('description')?.length > 30, `${url.pathname}: substantive description`);
  assert.ok(find('og:title') && find('og:description'), `${url.pathname}: social text`);
  assert.equal(new URL(find('og:url')).href, url.href, `${url.pathname}: social URL`);
  assert.equal(find('twitter:card'), 'summary_large_image', `${url.pathname}: large social card`);
  assert.ok(find('og:image') && find('twitter:image'), `${url.pathname}: social images`);
  assert.equal((body.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `${url.pathname}: one page heading`);
  const noindex = `${find('robots') || ''} ${response.headers.get('x-robots-tag') || ''}`.includes('noindex');
  assert.equal(noindex, preview, `${url.pathname}: intended indexability`);
  for (const match of body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
  console.log(`PASS ${url.pathname}: HTML, canonical, social metadata, schema, indexability`);
}
for (const path of ['/sanctuary', '/account', '/account/settings', '/admin']) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.ok(response.headers.get('x-robots-tag')?.includes('noindex'), `${path}: private route noindex header`);
}
const { body: robots } = await get('/robots.txt');
assert.ok(!/Disallow: \/(?:sanctuary|account|admin)/.test(robots), 'Crawlers can see app-shell noindex');
assert.equal(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), !preview, 'Production sitemap discovery');
console.log(`PASS ${urls.length} public pages and private-route indexing controls. Browser rendering and search indexing are not tested.`);
