import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const HTML_EXCLUDE = new Set(['index_patched.html']);
const URL_ATTR_RE = /\b(?:href|src|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi;

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'shorturl.at',
  'rebrand.ly'
]);

const MANUAL_VERIFY_HOSTS = [
  /(^|\.)linkedin\.com$/i,
  /(^|\.)facebook\.com$/i,
  /(^|\.)swinburne-vn\.edu\.vn$/i,
  /(^|\.)siteminder\.com$/i,
  /(^|\.)wiley\.com$/i,
  /(^|\.)onlinelibrary\.wiley\.com$/i,
  /(^|\.)cambridge\.org$/i,
  /(^|\.)mdpi\.com$/i
];

const MANUAL_VERIFY_STATUSES = new Set([400, 401, 403, 429, 999]);

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const getContainingTag = (html, index) => {
  const start = html.lastIndexOf('<', index);
  const end = html.indexOf('>', index);
  if (start === -1 || end === -1 || end < index) return '';
  return html.slice(start, end + 1).toLowerCase();
};

const listHtmlFiles = async () => {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith('.html'))
    .filter((name) => !name.includes('.report.html'))
    .filter((name) => !HTML_EXCLUDE.has(name))
    .sort();
};

const collectAbsoluteLinks = (html, file) => {
  const found = [];
  URL_ATTR_RE.lastIndex = 0;

  let match;
  while ((match = URL_ATTR_RE.exec(html)) !== null) {
    const tag = getContainingTag(html, match.index);
    if (/\brel\s*=\s*["'][^"']*(?:preconnect|dns-prefetch)[^"']*["']/.test(tag)) {
      continue;
    }

    const raw = decode(match[2] || match[3] || '');
    if (!/^https?:\/\//i.test(raw)) continue;

    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      continue;
    }

    found.push({
      file,
      url: parsed.href,
      host: parsed.hostname.toLowerCase(),
      protocol: parsed.protocol.toLowerCase()
    });
  }

  return found;
};

const aggregateLinks = (links) => {
  const byUrl = new Map();

  for (const link of links) {
    const existing = byUrl.get(link.url);
    if (existing) {
      existing.files.add(link.file);
      continue;
    }

    byUrl.set(link.url, {
      ...link,
      files: new Set([link.file])
    });
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
};

const matchesManualVerifyHost = (host) =>
  MANUAL_VERIFY_HOSTS.some((pattern) => pattern.test(host || ''));

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
  } finally {
    clearTimeout(timeout);
  }
};

const classifyLink = async (link) => {
  const files = [...link.files].sort();

  if (link.protocol === 'http:') {
    return {
      ...link,
      files,
      classification: 'replace',
      status: 'http',
      finalUrl: link.url,
      reason: 'non-https URL'
    };
  }

  if (KNOWN_SHORTENERS.has(link.host)) {
    return {
      ...link,
      files,
      classification: 'replace',
      status: 'shortener',
      finalUrl: link.url,
      reason: 'known URL shortener'
    };
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(link.host)) {
    return {
      ...link,
      files,
      classification: 'replace',
      status: 'ip-host',
      finalUrl: link.url,
      reason: 'IP-address host'
    };
  }

  try {
    const response = await fetchWithTimeout(link.url);
    const finalUrl = response.url || link.url;
    const finalHost = (() => {
      try {
        return new URL(finalUrl).hostname.toLowerCase();
      } catch {
        return link.host;
      }
    })();

    if (finalHost.endsWith('linkedin.com') && /\/uas\/login/i.test(finalUrl)) {
      return {
        ...link,
        files,
        classification: 'manual-verify',
        status: response.status,
        finalUrl,
        reason: 'redirected to LinkedIn login'
      };
    }

    if (response.ok) {
      return {
        ...link,
        files,
        classification: 'ok',
        status: response.status,
        finalUrl,
        reason: 'reachable'
      };
    }

    if (
      MANUAL_VERIFY_STATUSES.has(response.status)
      && (matchesManualVerifyHost(link.host) || matchesManualVerifyHost(finalHost))
    ) {
      return {
        ...link,
        files,
        classification: 'manual-verify',
        status: response.status,
        finalUrl,
        reason: 'bot-gated or access-limited host'
      };
    }

    return {
      ...link,
      files,
      classification: 'replace',
      status: response.status,
      finalUrl,
      reason: 'unreachable or stale target'
    };
  } catch (error) {
    return {
      ...link,
      files,
      classification: 'replace',
      status: 'ERR',
      finalUrl: link.url,
      reason: String(error)
    };
  }
};

const runWithConcurrency = async (items, worker, concurrency = 6) => {
  const results = new Array(items.length);
  let index = 0;

  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current]);
    }
  });

  await Promise.all(runners);
  return results;
};

const formatFiles = (files) => `[${files.join(', ')}]`;

const main = async () => {
  const htmlFiles = await listHtmlFiles();
  const allLinks = [];

  for (const file of htmlFiles) {
    const html = await fs.readFile(path.join(ROOT, file), 'utf8');
    allLinks.push(...collectAbsoluteLinks(html, file));
  }

  const uniqueLinks = aggregateLinks(allLinks);
  const results = await runWithConcurrency(uniqueLinks, classifyLink);

  const grouped = {
    ok: results.filter((result) => result.classification === 'ok'),
    'manual-verify': results.filter((result) => result.classification === 'manual-verify'),
    replace: results.filter((result) => result.classification === 'replace')
  };

  console.log(`Scanned ${htmlFiles.length} HTML files.`);
  console.log(`Checked ${uniqueLinks.length} unique external URLs.`);
  console.log('');
  console.log(`ok: ${grouped.ok.length}`);
  console.log(`manual-verify: ${grouped['manual-verify'].length}`);
  console.log(`replace: ${grouped.replace.length}`);

  for (const [classification, items] of Object.entries(grouped)) {
    if (!items.length) continue;
    console.log('');
    console.log(`${classification.toUpperCase()}:`);

    for (const item of items) {
      console.log(
        `- ${item.url} -> ${item.finalUrl} [${item.status}] ${item.reason} ${formatFiles(item.files)}`
      );
    }
  }

  if (grouped.replace.length) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
