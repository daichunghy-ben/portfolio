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

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const collectAbsoluteLinks = (html, file) => {
  const found = [];
  URL_ATTR_RE.lastIndex = 0;

  let match;
  while ((match = URL_ATTR_RE.exec(html)) !== null) {
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

const summarize = (links) => {
  const byHost = new Map();
  const insecure = [];
  const shorteners = [];
  const ipHosts = [];

  for (const link of links) {
    const bucket = byHost.get(link.host) || { count: 0, files: new Set() };
    bucket.count += 1;
    bucket.files.add(link.file);
    byHost.set(link.host, bucket);

    if (link.protocol === 'http:') insecure.push(link);
    if (KNOWN_SHORTENERS.has(link.host)) shorteners.push(link);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(link.host)) ipHosts.push(link);
  }

  return { byHost, insecure, shorteners, ipHosts };
};

const main = async () => {
  const htmlFiles = await listHtmlFiles();
  const allLinks = [];

  for (const file of htmlFiles) {
    const html = await fs.readFile(path.join(ROOT, file), 'utf8');
    allLinks.push(...collectAbsoluteLinks(html, file));
  }

  const { byHost, insecure, shorteners, ipHosts } = summarize(allLinks);
  const hostRows = [...byHost.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([host, info]) => ({
      host,
      count: info.count,
      files: [...info.files].sort().slice(0, 4)
    }));

  console.log(`Scanned ${htmlFiles.length} HTML files.`);
  console.log(`Found ${allLinks.length} absolute external links across ${hostRows.length} domains.`);
  console.log('');
  console.log('Top external domains:');

  for (const row of hostRows.slice(0, 20)) {
    console.log(`- ${row.host} (${row.count}) [${row.files.join(', ')}${row.files.length === 4 ? ', ...' : ''}]`);
  }

  console.log('');
  console.log(`HTTP (non-HTTPS) links: ${insecure.length}`);
  console.log(`Known shortener links: ${shorteners.length}`);
  console.log(`IP-host links: ${ipHosts.length}`);

  if (insecure.length || shorteners.length || ipHosts.length) {
    console.log('');
    console.log('Potentially risky entries:');

    for (const item of [...insecure, ...shorteners, ...ipHosts].slice(0, 40)) {
      console.log(`- ${item.url} (${item.file})`);
    }
  }
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
