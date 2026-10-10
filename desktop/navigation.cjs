const PRODUCTION_ORIGIN = "https://auspice-red.vercel.app";
const OFFLINE_URL = "auspice://offline/";
const EXTERNAL_ORIGINS = new Set([
  PRODUCTION_ORIGIN,
  "https://reflection.ed.ac.uk",
  "https://www.anjiecho.com",
  "https://www.astro.com",
  "https://www.metmuseum.org",
  "https://www.onlineclarity.co.uk",
]);
function parsedHttps(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url
      : null;
  } catch {
    return null;
  }
}
function isAppUrl(value) {
  return parsedHttps(value)?.origin === PRODUCTION_ORIGIN;
}
function isOfflineUrl(value) {
  // A single fixed page; no URL component becomes a filesystem path.
  return value === OFFLINE_URL;
}
function isAllowedNavigation(value) {
  return isAppUrl(value) || isOfflineUrl(value);
}
function externalUrl(value) {
  const url = parsedHttps(value);
  if (!url) return null;
  if (EXTERNAL_ORIGINS.has(url.origin)) return url.href;
  if (
    url.origin === "https://github.com" &&
    (url.pathname === "/zinnoberHaus/auspice" ||
      url.pathname.startsWith("/zinnoberHaus/auspice/"))
  )
    return url.href;
  return null;
}
function isJournalExportUrl(value) {
  const url = parsedHttps(value);
  return Boolean(
    url &&
      url.origin === PRODUCTION_ORIGIN &&
      url.pathname === "/api/account/export" &&
      !url.search,
  );
}
function allowDownload(urlChain, mimeType) {
  return (
    Array.isArray(urlChain) &&
    urlChain.length > 0 &&
    urlChain.every(isJournalExportUrl) &&
    mimeType === "application/json"
  );
}
module.exports = {
  PRODUCTION_ORIGIN,
  OFFLINE_URL,
  isAppUrl,
  isOfflineUrl,
  isAllowedNavigation,
  externalUrl,
  isJournalExportUrl,
  allowDownload,
};
