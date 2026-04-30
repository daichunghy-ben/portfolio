const extractTag = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';

const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractMetaContent = (html, attrName, attrValue) => {
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${attrName}\\s*=\\s*["']${escapePattern(attrValue)}["'][^>]*>`,
    'i'
  );
  const tag = html.match(pattern)?.[0] || '';
  return tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() || '';
};

const extractLinkHref = (html, relValue) => {
  const pattern = new RegExp(
    `<link\\b[^>]*\\brel\\s*=\\s*["']${escapePattern(relValue)}["'][^>]*>`,
    'i'
  );
  const tag = html.match(pattern)?.[0] || '';
  return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() || '';
};

const extractAtomFeedHref = (html) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/\brel\s*=\s*["']alternate["']/i.test(tag)) continue;
    if (!/\btype\s*=\s*["']application\/atom\+xml["']/i.test(tag)) continue;
    return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() || '';
  }
  return '';
};

const extractHreflangHref = (html, hreflang) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/\brel\s*=\s*["']alternate["']/i.test(tag)) continue;
    const lang = tag.match(/\bhreflang\s*=\s*["']([^"']+)["']/i)?.[1]?.trim().toLowerCase() || '';
    if (lang !== hreflang.toLowerCase()) continue;
    return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() || '';
  }
  return '';
};

const normalizeComparablePath = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    let pathname = url.pathname || '/';
    pathname = pathname.replace(/\/index\.html$/i, '/');
    pathname = pathname.replace(/\/{2,}/g, '/');
    return pathname === '' ? '/' : pathname;
  } catch {
    return '';
  }
};

const normalizePathFromCanonical = (canonicalHref) => {
  try {
    return normalizeComparablePath(new URL(canonicalHref).href);
  } catch {
    return '';
  }
};

export function collectSeoIssues({ html, url }) {
  const issues = [];
  const title = extractTag(html, /<title>([^<]+)<\/title>/i);
  const description = extractMetaContent(html, 'name', 'description');
  const canonical = extractLinkHref(html, 'canonical');
  const atomFeed = extractAtomFeedHref(html);
  const hreflangEn = extractHreflangHref(html, 'en');
  const hreflangVi = extractHreflangHref(html, 'vi');
  const hreflangDefault = extractHreflangHref(html, 'x-default');
  const robots = extractMetaContent(html, 'name', 'robots').toLowerCase();
  const googlebot = extractMetaContent(html, 'name', 'googlebot').toLowerCase();
  const is404Page = /\/404\.html$/i.test(url);
  const ogLocale = extractMetaContent(html, 'property', 'og:locale');
  const ogTitle = extractMetaContent(html, 'property', 'og:title');
  const ogDescription = extractMetaContent(html, 'property', 'og:description');
  const ogUrl = extractMetaContent(html, 'property', 'og:url');
  const ogSiteName = extractMetaContent(html, 'property', 'og:site_name');
  const ogImage = extractMetaContent(html, 'property', 'og:image');
  const ogImageAlt = extractMetaContent(html, 'property', 'og:image:alt');
  const twitterCard = extractMetaContent(html, 'name', 'twitter:card');
  const twitterTitle = extractMetaContent(html, 'name', 'twitter:title');
  const twitterDescription = extractMetaContent(html, 'name', 'twitter:description');
  const twitterImage = extractMetaContent(html, 'name', 'twitter:image');
  const twitterImageAlt = extractMetaContent(html, 'name', 'twitter:image:alt');
  const h1 = extractTag(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const jsonLdCount = (html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || []).length;

  if (is404Page) {
    if (!robots.includes('noindex')) issues.push('404 page should be noindex');
    if (!googlebot.includes('noindex')) issues.push('404 page should be noindex for googlebot');
    return issues;
  }

  if (!title || title.length < 15) issues.push('missing or weak <title>');
  if (!description || description.length < 50) issues.push('missing or weak meta description');
  if (!canonical) issues.push('missing canonical');
  else if (!/^https?:\/\//i.test(canonical)) issues.push('canonical is not absolute');
  if (!atomFeed) issues.push('missing atom feed link');
  else if (!/^https?:\/\//i.test(atomFeed)) issues.push('atom feed link is not absolute');
  if (!hreflangEn) issues.push('missing hreflang en');
  else if (!/^https?:\/\//i.test(hreflangEn)) issues.push('hreflang en is not absolute');
  if (!hreflangVi) issues.push('missing hreflang vi');
  else if (!/^https?:\/\//i.test(hreflangVi)) issues.push('hreflang vi is not absolute');
  if (!hreflangDefault) issues.push('missing hreflang x-default');
  else if (!/^https?:\/\//i.test(hreflangDefault)) issues.push('hreflang x-default is not absolute');
  if (!robots) issues.push('missing robots meta');
  if (!googlebot) issues.push('missing googlebot meta');
  else if (robots && googlebot !== robots) issues.push('googlebot meta does not match robots');
  if (!ogTitle) issues.push('missing og:title');
  if (!ogDescription) issues.push('missing og:description');
  if (!ogUrl) issues.push('missing og:url');
  else if (!/^https?:\/\//i.test(ogUrl)) issues.push('og:url is not absolute');
  if (!ogSiteName) issues.push('missing og:site_name');
  if (!ogLocale) issues.push('missing og:locale');
  if (!ogImage) issues.push('missing og:image');
  if (!ogImageAlt) issues.push('missing og:image:alt');
  if (!twitterCard) issues.push('missing twitter:card');
  if (!twitterTitle) issues.push('missing twitter:title');
  if (!twitterDescription) issues.push('missing twitter:description');
  if (!twitterImage) issues.push('missing twitter:image');
  if (!twitterImageAlt) issues.push('missing twitter:image:alt');
  if (!h1) issues.push('missing H1');
  if (!jsonLdCount) issues.push('missing JSON-LD');

  const currentPath = normalizeComparablePath(url);
  const canonicalPath = normalizePathFromCanonical(canonical);
  if (currentPath && canonicalPath && currentPath !== canonicalPath && !robots.includes('noindex')) {
    issues.push('canonical points to another path without noindex');
  }

  return issues;
}
