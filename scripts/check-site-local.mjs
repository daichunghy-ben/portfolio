import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, '.deploy', 'public');
const HTML_EXCLUDE = new Set(['index_patched.html']);

const SKIP_PROTOCOL_RE = /^(mailto:|tel:|javascript:|data:)/i;
const HTML_ATTR_RE = /\b(?:href|src|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const SRCSET_RE = /\bsrcset\s*=\s*("([^"]*)"|'([^']*)')/gi;
const CSS_URL_RE = /url\(([^)]+)\)/gi;
const STYLE_BLOCK_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const STYLE_ATTR_RE = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/gi;
const JS_IMPORT_RE =
  /\bimport\s+(?:[^'"]*?\s+from\s+)?["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/g;

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const normalizeRef = (raw, currentUrl, baseOrigin) => {
  if (!raw) return null;
  const cleaned = decodeEntities(raw.trim());
  if (!cleaned || cleaned.startsWith('#')) return null;
  if (SKIP_PROTOCOL_RE.test(cleaned)) return null;
  if (cleaned.startsWith('//')) return null;

  let resolved;
  try {
    resolved = /^https?:\/\//i.test(cleaned) ? new URL(cleaned) : new URL(cleaned, currentUrl);
  } catch {
    return null;
  }

  if (resolved.origin !== baseOrigin) return null;
  resolved.hash = '';
  if (resolved.pathname === '/') resolved.pathname = '/index.html';
  return `${resolved.pathname}${resolved.search}`;
};

const splitSrcset = (value) =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((candidate) => candidate.split(/\s+/)[0])
    .filter(Boolean);

const extractRefsFromCss = (cssText) => {
  const refs = [];
  CSS_URL_RE.lastIndex = 0;
  let match;
  while ((match = CSS_URL_RE.exec(cssText)) !== null) {
    const raw = match[1].trim().replace(/^['"]|['"]$/g, '');
    if (raw) refs.push(raw);
  }
  return refs;
};

const extractRefsFromHtml = (html) => {
  const refs = [];

  HTML_ATTR_RE.lastIndex = 0;
  let attrMatch;
  while ((attrMatch = HTML_ATTR_RE.exec(html)) !== null) {
    refs.push(attrMatch[2] ?? attrMatch[3] ?? '');
  }

  SRCSET_RE.lastIndex = 0;
  let srcsetMatch;
  while ((srcsetMatch = SRCSET_RE.exec(html)) !== null) {
    const srcsetValue = srcsetMatch[2] ?? srcsetMatch[3] ?? '';
    refs.push(...splitSrcset(srcsetValue));
  }

  STYLE_BLOCK_RE.lastIndex = 0;
  let styleBlockMatch;
  while ((styleBlockMatch = STYLE_BLOCK_RE.exec(html)) !== null) {
    refs.push(...extractRefsFromCss(styleBlockMatch[1]));
  }

  STYLE_ATTR_RE.lastIndex = 0;
  let styleAttrMatch;
  while ((styleAttrMatch = STYLE_ATTR_RE.exec(html)) !== null) {
    refs.push(...extractRefsFromCss(styleAttrMatch[2] ?? styleAttrMatch[3] ?? ''));
  }

  return refs;
};

const extractRefsFromJs = (jsText) => {
  const refs = [];
  JS_IMPORT_RE.lastIndex = 0;
  let match;
  while ((match = JS_IMPORT_RE.exec(jsText)) !== null) {
    const ref = match[1] ?? match[2] ?? '';
    if (ref) refs.push(ref);
  }
  return refs;
};

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
      }
    });
  } finally {
    clearTimeout(timeout);
  }
};

const waitForServer = async (baseUrl) => {
  const start = Date.now();
  while (Date.now() - start < 10_000) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}/index.html`);
      if (response.status < 500) return;
    } catch {
      // Retry until timeout.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error('Local server did not start within 10 seconds.');
};

const getFreePort = async () => {
  const net = await import('node:net');
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to allocate free port.'));
        return;
      }
      const { port } = address;
      server.close((closeErr) => {
        if (closeErr) reject(closeErr);
        else resolve(port);
      });
    });
  });
};

const listSeedPages = async () => {
  const entries = await fs.readdir(PUBLIC_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith('.html'))
    .filter((name) => !name.includes('.report.html'))
    .filter((name) => !HTML_EXCLUDE.has(name))
    .sort()
    .map((name) => `/${name}`);
};

const crawl = async (baseUrl) => {
  const base = new URL(baseUrl);
  const origin = base.origin;
  const queue = await listSeedPages();
  if (!queue.includes('/index.html')) queue.unshift('/index.html');
  if (!queue.includes('/')) queue.unshift('/');

  const visited = new Set();
  const failures = [];

  while (queue.length) {
    const pathWithQuery = queue.shift();
    if (!pathWithQuery || visited.has(pathWithQuery)) continue;
    visited.add(pathWithQuery);

    const absoluteUrl = new URL(pathWithQuery, base);
    let response;
    try {
      response = await fetchWithTimeout(absoluteUrl.href);
    } catch (error) {
      failures.push({ url: absoluteUrl.href, status: 0, reason: String(error) });
      continue;
    }

    const status = response.status;
    if (status >= 400) {
      failures.push({ url: absoluteUrl.href, status });
      continue;
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const isHtml = contentType.includes('text/html') || absoluteUrl.pathname.endsWith('.html');
    const isCss = contentType.includes('text/css') || absoluteUrl.pathname.endsWith('.css');
    const isJs =
      contentType.includes('javascript') ||
      contentType.includes('ecmascript') ||
      absoluteUrl.pathname.endsWith('.js') ||
      absoluteUrl.pathname.endsWith('.mjs');

    if (!isHtml && !isCss && !isJs) continue;

    const body = await response.text();
    let refs = [];
    if (isHtml) refs = extractRefsFromHtml(body);
    else if (isCss) refs = extractRefsFromCss(body);
    else if (isJs) refs = extractRefsFromJs(body);

    for (const ref of refs) {
      const normalized = normalizeRef(ref, absoluteUrl.href, origin);
      if (!normalized || visited.has(normalized)) continue;
      queue.push(normalized);
    }
  }

  return { visitedCount: visited.size, failures };
};

const main = async () => {
  try {
    const stat = await fs.stat(PUBLIC_DIR);
    if (!stat.isDirectory()) throw new Error();
  } catch {
    throw new Error('Missing .deploy/public. Run `npm run stage:pages` first.');
  }

  const port = await getFreePort();
  const server = spawn('python3', ['-m', 'http.server', String(port), '--directory', PUBLIC_DIR], {
    cwd: ROOT,
    stdio: 'ignore'
  });

  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await waitForServer(baseUrl);
    const result = await crawl(baseUrl);
    if (result.failures.length) {
      console.error(`Found ${result.failures.length} failing local URLs:`);
      for (const failure of result.failures.slice(0, 60)) {
        const suffix = failure.reason ? ` ${failure.reason}` : '';
        console.error(`- ${failure.url} [${failure.status}]${suffix}`);
      }
      if (result.failures.length > 60) {
        console.error(`... ${result.failures.length - 60} more`);
      }
      process.exit(1);
    }
    console.log(`Local check passed. Verified ${result.visitedCount} internal URLs.`);
  } finally {
    server.kill('SIGTERM');
  }
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
