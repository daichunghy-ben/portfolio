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
  if (/\/404\.html$/i.test(url)) {
    return [];
  }

  const issues = [];
  const title = extractTag(html, /<title>([^<]+)<\/title>/i);
  const description = extractMetaContent(html, 'name', 'description');
  const canonical = extractLinkHref(html, 'canonical');
  const robots = extractMetaContent(html, 'name', 'robots').toLowerCase();
  const ogTitle = extractMetaContent(html, 'property', 'og:title');
  const ogDescription = extractMetaContent(html, 'property', 'og:description');
  const ogUrl = extractMetaContent(html, 'property', 'og:url');
  const ogSiteName = extractMetaContent(html, 'property', 'og:site_name');
  const ogImage = extractMetaContent(html, 'property', 'og:image');
  const twitterCard = extractMetaContent(html, 'name', 'twitter:card');
  const twitterTitle = extractMetaContent(html, 'name', 'twitter:title');
  const twitterDescription = extractMetaContent(html, 'name', 'twitter:description');
  const twitterImage = extractMetaContent(html, 'name', 'twitter:image');
  const h1 = extractTag(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const jsonLdCount = (html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || []).length;

  if (!title || title.length < 15) issues.push('missing or weak <title>');
  if (!description || description.length < 50) issues.push('missing or weak meta description');
  if (!canonical) issues.push('missing canonical');
  else if (!/^https?:\/\//i.test(canonical)) issues.push('canonical is not absolute');
  if (!robots) issues.push('missing robots meta');
  if (!ogTitle) issues.push('missing og:title');
  if (!ogDescription) issues.push('missing og:description');
  if (!ogUrl) issues.push('missing og:url');
  else if (!/^https?:\/\//i.test(ogUrl)) issues.push('og:url is not absolute');
  if (!ogSiteName) issues.push('missing og:site_name');
  if (!ogImage) issues.push('missing og:image');
  if (!twitterCard) issues.push('missing twitter:card');
  if (!twitterTitle) issues.push('missing twitter:title');
  if (!twitterDescription) issues.push('missing twitter:description');
  if (!twitterImage) issues.push('missing twitter:image');
  if (!h1) issues.push('missing H1');
  if (!jsonLdCount) issues.push('missing JSON-LD');

  const currentPath = normalizeComparablePath(url);
  const canonicalPath = normalizePathFromCanonical(canonical);
  if (currentPath && canonicalPath && currentPath !== canonicalPath && !robots.includes('noindex')) {
    issues.push('canonical points to another path without noindex');
  }

  return issues;
}
