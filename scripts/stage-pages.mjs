import fs from 'node:fs/promises';
import path from 'node:path';
import {
  applyPageSeo,
  deriveGitHubPagesSiteUrl,
  loadSeoData
} from './seo-page-data.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, '.deploy', 'public');
const SOURCE_DIRS = ['assets', 'dist'];
const STATIC_FILES = ['404.html', 'robots.txt', '_headers', '_redirects'];
const HTML_EXCLUDE = new Set(['index_patched.html']);
const SITEMAP_EXCLUDE = new Set(['404.html', 'index_patched.html']);
const DEFAULT_PRIMARY_SITE_URL = 'https://daichunghy-ben.github.io/';
const DEFAULT_LEGACY_HOSTS = ['chunghy-portfolio.pages.dev', 'chunghy.pages.dev'];
const SKIP_PROTOCOL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const STAGED_ASSET_REFS = new Map([
  ['styles/base.css', 'dist/styles/base.css'],
  ['styles/discovery.css', 'dist/styles/discovery.css'],
  ['styles/home.css', 'dist/styles/home.css'],
  ['styles/projects.css', 'dist/styles/projects.css'],
  ['styles/research.css', 'dist/styles/research.css'],
  ['styles/research-ev-immersive.css', 'dist/styles/research-ev-immersive.css'],
  ['styles/research-psych-university.css', 'dist/styles/research-psych-university.css'],
  ['js/main.js', 'dist/js/main.js'],
  ['js/carousel-fallback.js', 'dist/js/carousel-fallback.js'],
  ['js/research-ev-fallback.js', 'dist/js/research-ev-fallback.js'],
  ['js/research-motorbike-fallback.js', 'dist/js/research-motorbike-fallback.js'],
  ['js/research-nutrition-fallback.js', 'dist/js/research-nutrition-fallback.js']
]);
const IMAGE_OPTIMIZABLE_ATTR_RE = /\b(href|src|poster|data-modal-img)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const IMAGE_EXT_RE = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const HTML_IMAGE_ATTR_RE = /\b(?:src|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const HTML_SRCSET_RE = /\bsrcset\s*=\s*("([^"]*)"|'([^']*)')/gi;

const shouldSkipFile = (name) => {
  if (name.startsWith('.')) return true;
  if (name.includes('.report.html')) return true;
  if (name.endsWith('~')) return true;
  return false;
};

const shouldSkipDir = (name) => name.startsWith('.');

const listDeployHtmlFiles = async () => {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith('.html'))
    .filter((name) => !HTML_EXCLUDE.has(name))
    .filter((name) => !name.includes('.report.html'))
    .sort();
};

const ensureCleanOutDir = async () => {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
};

const copyFile = async (from, to) => {
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.copyFile(from, to);
};

const normalizeRefKey = (value) => {
  const text = String(value || '');
  if (!text) return '';
  return text.startsWith('./') ? text.slice(2) : text;
};

const buildOptimizedImageRef = (rawValue, optimizedAssetRefs) => {
  const cleaned = String(rawValue || '').trim();
  if (!cleaned || cleaned.startsWith('#')) return '';
  if (SKIP_PROTOCOL_RE.test(cleaned)) return '';

  const prefix = cleaned.startsWith('./') ? './' : cleaned.startsWith('/') ? '/' : '';
  const normalized = normalizeRefKey(cleaned).replace(/^[\/]+/, '').split(/[?#]/)[0];
  if (!normalized.startsWith('assets/')) return '';
  if (!IMAGE_EXT_RE.test(normalized)) return '';

  const relativePath = normalized.slice('assets/'.length);
  const optimizedRef = `assets/optimized/${relativePath.replace(/\.[^.\/]+$/, '')}-optimized.webp`;
  if (!optimizedAssetRefs.has(optimizedRef)) return '';
  return `${prefix}${optimizedRef}`;
};

const replaceQuotedAssetRef = (html, from, to) =>
  html
    .split(`"${from}"`)
    .join(`"${to}"`)
    .split(`'${from}'`)
    .join(`'${to}'`);

const rewriteAssetRefsInHtml = (html, optimizedAssetRefs) => {
  let rewritten = html.replace(
    IMAGE_OPTIMIZABLE_ATTR_RE,
    (match, attr, quotedValue, dquote, squote) => {
      const quote = quotedValue[0];
      const rawValue = dquote ?? squote ?? '';
      const replacement = STAGED_ASSET_REFS.get(normalizeRefKey(rawValue)) || buildOptimizedImageRef(rawValue, optimizedAssetRefs);
      if (!replacement) return match;
      const nextValue = rawValue.startsWith('./') ? `./${replacement}` : rawValue.startsWith('/') ? `/${replacement}` : replacement;
      return `${attr}=${quote}${nextValue}${quote}`;
    }
  );

  for (const [sourceRef, distRef] of STAGED_ASSET_REFS) {
    rewritten = replaceQuotedAssetRef(rewritten, sourceRef, distRef);
    rewritten = replaceQuotedAssetRef(rewritten, `./${sourceRef}`, `./${distRef}`);
  }

  return rewritten;
};

const copyTree = async (sourceDir, targetDir, counters) => {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  await fs.mkdir(targetDir, { recursive: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      await copyTree(path.join(sourceDir, entry.name), path.join(targetDir, entry.name), counters);
      continue;
    }
    if (!entry.isFile()) continue;
    if (shouldSkipFile(entry.name)) continue;

    await copyFile(path.join(sourceDir, entry.name), path.join(targetDir, entry.name));
    counters.files += 1;
  }
};

const dirExists = async (dirPath) => {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const fileExists = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
};

const listFilesRecursive = async (dirPath) => {
  const items = [];
  const stack = [dirPath];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        items.push(fullPath);
      }
    }
  }
  return items;
};

const normalizeSiteUrl = (value) => {
  const raw = (value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    url.hash = '';
    url.search = '';
    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/';
    } else {
      url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
    }
    return url.href;
  } catch {
    return '';
  }
};

const normalizeIsoDate = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return '';
  const parsed = new Date(`${match[1]}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf())) return '';
  return match[1];
};

const pickSitemapLastmod = (fileMtimeIso, siteLastUpdatedIso) => {
  if (!siteLastUpdatedIso) return fileMtimeIso;
  if (!fileMtimeIso) return siteLastUpdatedIso;
  return fileMtimeIso >= siteLastUpdatedIso ? fileMtimeIso : siteLastUpdatedIso;
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const splitSrcset = (value) =>
  String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((candidate) => candidate.split(/\s+/)[0])
    .filter(Boolean);

const parseLegacyHosts = (raw) => {
  const fromEnv = (raw || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const hosts = fromEnv.length ? fromEnv : DEFAULT_LEGACY_HOSTS;
  return new Set(hosts);
};

const replaceCanonicalTag = (html, canonicalUrl) =>
  html.replace(
    /<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i,
    `<link href="${canonicalUrl}" rel="canonical"/>`
  );

const extractCanonicalHref = (html) => {
  const tag = html.match(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i)?.[0];
  if (!tag) return '';
  return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] || '';
};

const replaceMetaContentTag = (html, selectorAttr, selectorValue, contentValue) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${selectorAttr}\\s*=\\s*["']${escapedSelector}["'][^>]*>`,
    'i'
  );
  return html.replace(pattern, `<meta content="${contentValue}" ${selectorAttr}="${selectorValue}"/>`);
};

const extractMetaContent = (html, selectorAttr, selectorValue) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(
    `<meta\\b[^>]*\\b${selectorAttr}\\s*=\\s*["']${escapedSelector}["'][^>]*>`,
    'i'
  );
  const tag = html.match(tagPattern)?.[0];
  if (!tag) return '';
  return tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] || '';
};

const isNoindexPage = (html) => {
  const robots = extractMetaContent(html, 'name', 'robots').toLowerCase();
  const googlebot = extractMetaContent(html, 'name', 'googlebot').toLowerCase();
  return robots.includes('noindex') || googlebot.includes('noindex');
};

const resolveAbsoluteAssetUrl = (value, siteUrl, legacyHosts) => {
  const raw = (value || '').trim();
  if (!raw || raw.startsWith('data:')) return raw;

  const site = new URL(siteUrl);

  if (/^https?:\/\//i.test(raw)) {
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      return raw;
    }

    if (legacyHosts.has(parsed.hostname.toLowerCase())) {
      const normalized = `${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/^\/+/, '');
      return new URL(normalized, site).href;
    }

    return parsed.href;
  }

  if (/^\/\//.test(raw)) {
    return `https:${raw}`;
  }

  try {
    return new URL(raw.replace(/^\/+/, ''), site).href;
  } catch {
    return raw;
  }
};

const absolutePageUrlForFile = (siteUrl, htmlFileName) => {
  const isIndex = htmlFileName.toLowerCase() === 'index.html';
  return isIndex ? new URL(siteUrl).href : new URL(htmlFileName.replace(/^\/+/, ''), siteUrl).href;
};

const resolvePageUrlForFile = (siteUrl, htmlFileName, html) => {
  const fallbackUrl = absolutePageUrlForFile(siteUrl, htmlFileName);
  const canonicalHref = extractCanonicalHref(html);
  if (!canonicalHref) return fallbackUrl;

  try {
    const resolvedUrl = new URL(canonicalHref, fallbackUrl).href;
    if (htmlFileName.toLowerCase() === 'index.html') {
      const indexFileUrl = new URL('index.html', siteUrl).href;
      if (resolvedUrl === indexFileUrl || resolvedUrl === fallbackUrl) {
        return fallbackUrl;
      }
    }
    return resolvedUrl;
  } catch {
    return fallbackUrl;
  }
};

const generateRobotsTxt = async (siteUrl) => {
  const robotsPath = path.join(OUT_DIR, 'robots.txt');
  const sitemapUrl = new URL('sitemap.xml', siteUrl).href;
  const imageSitemapUrl = new URL('image-sitemap.xml', siteUrl).href;
  const feedUrl = new URL('feed.xml', siteUrl).href;
  const content = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\nSitemap: ${imageSitemapUrl}\nSitemap: ${feedUrl}\n`;
  await fs.writeFile(robotsPath, content, 'utf8');
};

const normalizeImageRef = (raw, pageUrl, siteUrl) => {
  const cleaned = String(raw || '').trim();
  if (!cleaned || cleaned.startsWith('#')) return '';
  if (/^(?:data:|mailto:|tel:|javascript:)/i.test(cleaned)) return '';

  try {
    const resolved = /^https?:\/\//i.test(cleaned) ? new URL(cleaned) : new URL(cleaned, pageUrl);
    if (!IMAGE_EXT_RE.test(resolved.pathname) && !IMAGE_EXT_RE.test(resolved.href)) return '';
    if (resolved.origin !== new URL(siteUrl).origin) return '';
    resolved.hash = '';
    return resolved.href;
  } catch {
    return '';
  }
};

const extractImageUrlsFromHtml = (html, pageUrl, siteUrl) => {
  const refs = new Set();

  HTML_IMAGE_ATTR_RE.lastIndex = 0;
  let attrMatch;
  while ((attrMatch = HTML_IMAGE_ATTR_RE.exec(html)) !== null) {
    const normalized = normalizeImageRef(attrMatch[2] ?? attrMatch[3] ?? '', pageUrl, siteUrl);
    if (normalized) refs.add(normalized);
  }

  HTML_SRCSET_RE.lastIndex = 0;
  let srcsetMatch;
  while ((srcsetMatch = HTML_SRCSET_RE.exec(html)) !== null) {
    const candidates = splitSrcset(srcsetMatch[2] ?? srcsetMatch[3] ?? '');
    for (const candidate of candidates) {
      const normalized = normalizeImageRef(candidate, pageUrl, siteUrl);
      if (normalized) refs.add(normalized);
    }
  }

  return [...refs];
};

const generateSitemapXml = async (siteUrl, seoData) => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name)
    .sort();

  const pages = [];
  const siteLastUpdatedIso = normalizeIsoDate(seoData?.siteConfig?.last_updated);

  for (const htmlFile of htmlFiles) {
    if (SITEMAP_EXCLUDE.has(htmlFile)) continue;

    const filePath = path.join(OUT_DIR, htmlFile);
    const html = await fs.readFile(filePath, 'utf8');
    const pageUrl = absolutePageUrlForFile(siteUrl, htmlFile);
    const canonicalUrl = resolvePageUrlForFile(siteUrl, htmlFile, html);

    if (canonicalUrl !== pageUrl) continue;
    if (isNoindexPage(html)) continue;

    const sourcePath = path.join(ROOT, htmlFile);
    const stats = await fs.stat((await fileExists(sourcePath)) ? sourcePath : filePath);
    const fileLastmod = stats.mtime.toISOString().slice(0, 10);
    pages.push({
      lastmod: pickSitemapLastmod(fileLastmod, siteLastUpdatedIso),
      url: pageUrl,
      priority: htmlFile === 'index.html' ? '1.0' : '0.8',
      changefreq: htmlFile === 'index.html' ? 'weekly' : 'monthly'
    });
  }

  const entries = pages
    .map(
      ({ lastmod, url, changefreq, priority }) =>
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await fs.writeFile(path.join(OUT_DIR, 'sitemap.xml'), xml, 'utf8');
};

const generateImageSitemapXml = async (siteUrl) => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name)
    .sort();

  const pages = [];

  for (const htmlFile of htmlFiles) {
    if (SITEMAP_EXCLUDE.has(htmlFile)) continue;

    const filePath = path.join(OUT_DIR, htmlFile);
    const html = await fs.readFile(filePath, 'utf8');
    const pageUrl = absolutePageUrlForFile(siteUrl, htmlFile);
    const canonicalUrl = resolvePageUrlForFile(siteUrl, htmlFile, html);

    if (canonicalUrl !== pageUrl) continue;
    if (isNoindexPage(html)) continue;

    const images = extractImageUrlsFromHtml(html, pageUrl, siteUrl);
    if (!images.length) continue;

    pages.push({
      url: pageUrl,
      images
    });
  }

  const entries = pages
    .map(
      ({ url, images }) =>
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n${images
          .map((imageUrl) => `    <image:image>\n      <image:loc>${escapeXml(imageUrl)}</image:loc>\n    </image:image>`)
          .join('\n')}\n  </url>`
    )
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${entries}\n</urlset>\n`;
  await fs.writeFile(path.join(OUT_DIR, 'image-sitemap.xml'), xml, 'utf8');
};

const generateFeedXml = async (siteUrl, seoData) => {
  const notesEntries = Array.isArray(seoData?.notesEntries) ? seoData.notesEntries : [];
  const siteConfig = seoData?.siteConfig || {};
  const sortedEntries = notesEntries
    .slice()
    .sort((a, b) => String(b.modified_at || b.published_at || '').localeCompare(String(a.modified_at || a.published_at || '')));

  const updatedIso = sortedEntries[0]?.modified_at || sortedEntries[0]?.published_at || new Date().toISOString();
  const feedEntries = sortedEntries
    .map((entry) => {
      const entryUrl = absolutePageUrlForFile(siteUrl, `${entry.slug}.html`);
      const updated = entry.modified_at || entry.published_at || updatedIso;
      const categories = (Array.isArray(entry.keywords) ? entry.keywords : [])
        .slice(0, 4)
        .map((keyword) => `    <category term="${escapeXml(keyword)}"/>`)
        .join('\n');
      return `  <entry>\n    <title>${escapeXml(entry.title)}</title>\n    <link href="${escapeXml(entryUrl)}"/>\n    <id>${escapeXml(entryUrl)}</id>\n    <updated>${escapeXml(updated)}</updated>\n    <summary>${escapeXml(entry.summary || entry.description || entry.title)}</summary>${categories ? `\n${categories}` : ''}\n  </entry>`;
    })
    .join('\n');

  const feedUrl = new URL('feed.xml', siteUrl).href;
  const insightsUrl = new URL('insights.html', siteUrl).href;
  const feedXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<feed xmlns="http://www.w3.org/2005/Atom">\n` +
    `  <title>${escapeXml(siteConfig.feed_title || 'Insights')}</title>\n` +
    `  <subtitle>${escapeXml(siteConfig.feed_description || '')}</subtitle>\n` +
    `  <link href="${escapeXml(feedUrl)}" rel="self"/>\n` +
    `  <link href="${escapeXml(insightsUrl)}" rel="alternate"/>\n` +
    `  <id>${escapeXml(feedUrl)}</id>\n` +
    `  <updated>${escapeXml(updatedIso)}</updated>\n` +
    `  <author>\n` +
    `    <name>${escapeXml(siteConfig?.owner?.name || 'Chung Hy Dai')}</name>\n` +
    `${siteConfig?.owner?.email ? `    <email>${escapeXml(siteConfig.owner.email)}</email>\n` : ''}` +
    `  </author>\n` +
    `${feedEntries}\n` +
    `</feed>\n`;

  await fs.writeFile(path.join(OUT_DIR, 'feed.xml'), feedXml, 'utf8');
};

const applyMetadataForSiteUrl = async (siteUrl, legacyHosts, seoData) => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name)
    .sort();

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(OUT_DIR, htmlFile);
    let html = await fs.readFile(filePath, 'utf8');

    html = applyPageSeo({
      htmlFile,
      html,
      siteUrl,
      legacyHosts,
      seoData
    });

    const canonicalUrl = resolvePageUrlForFile(siteUrl, htmlFile, html);
    html = replaceCanonicalTag(html, canonicalUrl);
    html = replaceMetaContentTag(html, 'property', 'og:url', canonicalUrl);

    for (const legacyHost of legacyHosts) {
      const from = `https://${legacyHost}`;
      const to = new URL(siteUrl).origin;
      html = html.split(from).join(to);
    }

    const ogImageContent = extractMetaContent(html, 'property', 'og:image');
    if (ogImageContent) {
      const abs = resolveAbsoluteAssetUrl(ogImageContent, siteUrl, legacyHosts);
      html = replaceMetaContentTag(html, 'property', 'og:image', abs);
    }

    const ogImageSecureContent = extractMetaContent(html, 'property', 'og:image:secure_url');
    if (ogImageSecureContent) {
      const abs = resolveAbsoluteAssetUrl(ogImageSecureContent, siteUrl, legacyHosts);
      html = replaceMetaContentTag(html, 'property', 'og:image:secure_url', abs);
    }

    const twitterImageContent = extractMetaContent(html, 'name', 'twitter:image');
    if (twitterImageContent) {
      const abs = resolveAbsoluteAssetUrl(twitterImageContent, siteUrl, legacyHosts);
      html = replaceMetaContentTag(html, 'name', 'twitter:image', abs);
    }

    await fs.writeFile(filePath, html, 'utf8');
  }
};

const updateDeploySiteConfig = async (siteUrl) => {
  const configPath = path.join(OUT_DIR, 'assets', 'data', 'site-config.json');
  if (!(await fileExists(configPath))) return;

  let parsed;
  try {
    parsed = JSON.parse(await fs.readFile(configPath, 'utf8'));
  } catch {
    return;
  }

  const now = new Date().toISOString().slice(0, 10);
  parsed.site_url = siteUrl;
  parsed.canonical_base = siteUrl;
  parsed.last_updated = now;

  await fs.writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
};

const buildOptimizedAssetRefSet = async () => {
  const optimizedDir = path.join(ROOT, 'assets', 'optimized');
  if (!(await dirExists(optimizedDir))) return new Set();

  const files = await listFilesRecursive(optimizedDir);
  return new Set(
    files.map((filePath) => path.relative(ROOT, filePath).replace(/\\/g, '/'))
  );
};

const rewriteStagedHtmlAssetRefs = async (optimizedAssetRefs) => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name);

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(OUT_DIR, htmlFile);
    const html = await fs.readFile(filePath, 'utf8');
    const rewritten = rewriteAssetRefsInHtml(html, optimizedAssetRefs);
    if (rewritten !== html) {
      await fs.writeFile(filePath, rewritten, 'utf8');
    }
  }
};

const main = async () => {
  await ensureCleanOutDir();
  const seoData = await loadSeoData(ROOT);

  const counters = { files: 0 };
  const htmlFiles = await listDeployHtmlFiles();

  for (const htmlFile of htmlFiles) {
    await copyFile(path.join(ROOT, htmlFile), path.join(OUT_DIR, htmlFile));
    counters.files += 1;
  }

  for (const sourceName of SOURCE_DIRS) {
    const sourcePath = path.join(ROOT, sourceName);
    if (!(await dirExists(sourcePath))) continue;
    await copyTree(sourcePath, path.join(OUT_DIR, sourceName), counters);
  }

  for (const staticFile of STATIC_FILES) {
    const sourcePath = path.join(ROOT, staticFile);
    if (!(await fileExists(sourcePath))) continue;
    await copyFile(sourcePath, path.join(OUT_DIR, staticFile));
    counters.files += 1;
  }

  const optimizedAssetRefs = await buildOptimizedAssetRefSet();
  await rewriteStagedHtmlAssetRefs(optimizedAssetRefs);

  const explicitSiteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const githubPagesSiteUrl = normalizeSiteUrl(deriveGitHubPagesSiteUrl(process.env));
  const configSiteUrl = normalizeSiteUrl(
    seoData?.siteConfig?.site_url || seoData?.siteConfig?.canonical_base || ''
  );
  const fallbackHost = (process.env.CF_PAGES_PROJECT || process.env.PROJECT || '').trim();
  const fallbackSiteUrl = normalizeSiteUrl(
    fallbackHost ? `https://${fallbackHost}.pages.dev/` : DEFAULT_PRIMARY_SITE_URL
  );
  const siteUrl = explicitSiteUrl || githubPagesSiteUrl || configSiteUrl || fallbackSiteUrl;
  const legacyHosts = parseLegacyHosts(process.env.LEGACY_PAGES_HOSTS);

  if (!explicitSiteUrl && !githubPagesSiteUrl && configSiteUrl) {
    console.log(`SITE_URL not set; using site-config base URL: ${siteUrl}`);
  } else if (!explicitSiteUrl && !githubPagesSiteUrl && !configSiteUrl) {
    console.log(`SITE_URL not set; using fallback deployment base URL: ${siteUrl}`);
  }

  await applyMetadataForSiteUrl(siteUrl, legacyHosts, seoData);
  await updateDeploySiteConfig(siteUrl);
  await generateRobotsTxt(siteUrl);
  await generateSitemapXml(siteUrl, seoData);
  await generateImageSitemapXml(siteUrl);
  await generateFeedXml(siteUrl, seoData);
  console.log(`Applied deployment metadata base URL: ${siteUrl}`);

  const finalFiles = await listFilesRecursive(OUT_DIR);
  const totalBytes = (
    await Promise.all(
      finalFiles.map(async (filePath) => {
        const stats = await fs.stat(filePath);
        return stats.size;
      })
    )
  ).reduce((sum, size) => sum + size, 0);

  const mb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`Staged ${finalFiles.length} files to ${path.relative(ROOT, OUT_DIR)} (${mb} MB).`);
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
