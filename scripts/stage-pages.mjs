import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, '.deploy', 'public');
const SOURCE_DIRS = ['assets', 'dist', 'portfolio'];
const STATIC_FILES = ['404.html', 'robots.txt', '_headers', '_redirects'];
const HTML_EXCLUDE = new Set(['index_patched.html']);
const SITEMAP_EXCLUDE = new Set(['404.html', 'index_patched.html']);
const DEFAULT_PRIMARY_SITE_URL = 'https://daichunghy-ben.github.io/';
const DEFAULT_LEGACY_HOSTS = ['chunghy-portfolio.pages.dev', 'chunghy.pages.dev', 'daichunghy.pages.dev', 'daichunghy-portfolio.pages.dev'];
const STAGED_ASSET_REFS = new Map([
  ['styles/base.css', 'dist/styles/base.css'],
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
  if (!value) return '';
  return value.startsWith('./') ? value.slice(2) : value;
};

const replaceQuotedAssetRef = (html, from, to) =>
  html
    .split(`"${from}"`)
    .join(`"${to}"`)
    .split(`'${from}'`)
    .join(`'${to}'`);

const rewriteAssetRefsInHtml = (html) => {
  let rewritten = html.replace(
    /\b(href|src)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, attr, quotedValue, dquote, squote) => {
      const quote = quotedValue[0];
      const rawValue = dquote ?? squote ?? '';
      const replacement = STAGED_ASSET_REFS.get(normalizeRefKey(rawValue));
      if (!replacement) return match;
      const nextValue = rawValue.startsWith('./') ? `./${replacement}` : replacement;
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

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

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
      return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, site).href;
    }

    return parsed.href;
  }

  if (/^\/\//.test(raw)) {
    return `https:${raw}`;
  }

  try {
    return new URL(raw, site).href;
  } catch {
    return raw;
  }
};

const absolutePageUrlForFile = (siteUrl, htmlFileName) => {
  const isIndex = htmlFileName.toLowerCase() === 'index.html';
  const relativePath = isIndex ? '.' : htmlFileName;
  return new URL(relativePath, siteUrl).href;
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
  const content = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  await fs.writeFile(robotsPath, content, 'utf8');
};

const generateSitemapXml = async (siteUrl) => {
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

    const stats = await fs.stat(filePath);
    pages.push({
      lastmod: stats.mtime.toISOString().slice(0, 10),
      url: pageUrl
    });
  }

  const entries = pages
    .map(
      ({ lastmod, url }) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await fs.writeFile(path.join(OUT_DIR, 'sitemap.xml'), xml, 'utf8');
};

const applyMetadataForSiteUrl = async (siteUrl, legacyHosts) => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name)
    .sort();

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(OUT_DIR, htmlFile);
    let html = await fs.readFile(filePath, 'utf8');

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

const rewriteStagedHtmlAssetRefs = async () => {
  const htmlFiles = (await fs.readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.includes('.report.html'))
    .map((entry) => entry.name);

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(OUT_DIR, htmlFile);
    const html = await fs.readFile(filePath, 'utf8');
    const rewritten = rewriteAssetRefsInHtml(html);
    if (rewritten !== html) {
      await fs.writeFile(filePath, rewritten, 'utf8');
    }
  }
};

const main = async () => {
  await ensureCleanOutDir();

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

  await rewriteStagedHtmlAssetRefs();

  const explicitSiteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const fallbackHost = (process.env.CF_PAGES_PROJECT || process.env.PROJECT || '').trim();
  const fallbackSiteUrl = normalizeSiteUrl(
    fallbackHost ? `https://${fallbackHost}.pages.dev/` : DEFAULT_PRIMARY_SITE_URL
  );
  const siteUrl = explicitSiteUrl || fallbackSiteUrl;
  const legacyHosts = parseLegacyHosts(process.env.LEGACY_PAGES_HOSTS);

  if (!explicitSiteUrl) {
    console.log(`SITE_URL not set; using fallback deployment base URL: ${siteUrl}`);
  }

  await applyMetadataForSiteUrl(siteUrl, legacyHosts);
  await updateDeploySiteConfig(siteUrl);
  await generateRobotsTxt(siteUrl);
  await generateSitemapXml(siteUrl);
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
