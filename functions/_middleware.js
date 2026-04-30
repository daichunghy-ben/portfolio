const DEFAULT_LEGACY_HOSTS = ['chunghy-portfolio.pages.dev', 'chunghy.pages.dev'];
const DEFAULT_PRIMARY_SITE_URL = 'https://chunghy.pages.dev/';

const normalizeSiteUrl = (value) => {
  const raw = (value || '').trim();
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    parsed.hash = '';
    parsed.search = '';
    if (!parsed.pathname || parsed.pathname === '/') {
      parsed.pathname = '/';
    } else {
      parsed.pathname = `${parsed.pathname.replace(/\/+$/, '')}/`;
    }
    return parsed;
  } catch {
    return null;
  }
};

const getLegacyHosts = (value) => {
  const rawHosts = (value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (rawHosts.length) return new Set(rawHosts);
  return new Set(DEFAULT_LEGACY_HOSTS);
};

const shouldRedirectHost = (host, primaryHost, legacyHosts) => {
  const lowerHost = host.toLowerCase();
  if (lowerHost === primaryHost) return false;
  if (legacyHosts.has(lowerHost)) return true;
  if (lowerHost.endsWith('.pages.dev') && lowerHost !== primaryHost) return true;
  return false;
};

export async function onRequest(context) {
  const primary = normalizeSiteUrl(context.env?.SITE_URL || DEFAULT_PRIMARY_SITE_URL);
  if (!primary) {
    return context.next();
  }

  const requestUrl = new URL(context.request.url);
  const legacyHosts = getLegacyHosts(context.env?.LEGACY_PAGES_HOSTS);
  if (!shouldRedirectHost(requestUrl.hostname, primary.hostname, legacyHosts)) {
    return context.next();
  }

  const redirectUrl = new URL(`${requestUrl.pathname}${requestUrl.search}`, primary);
  return Response.redirect(redirectUrl.href, 301);
}
