import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const MIRROR_DIR = path.join(ROOT, 'assets', 'external', 'mirror');
const MANIFEST_PATH = path.join(ROOT, 'assets', 'data', 'external-media-map.json');
const HTML_EXCLUDE = new Set(['index_patched.html']);

const MIME_EXTENSION = new Map([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
  ['image/gif', '.gif'],
  ['image/svg+xml', '.svg'],
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['video/ogg', '.ogv']
]);

const TAG_RE = /<(img|source|video)\b[^>]*>/gi;
const ATTR_RE = /\b(srcset|src|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi;

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const toPosix = (value) => value.replaceAll(path.sep, '/');

const isExternalUrl = (value) => /^https?:\/\//i.test(value) || /^\/\//.test(value);

const normalizeExternalUrl = (value) => {
  const trimmed = decodeEntities(value.trim());
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
};

const sha1 = (value) => crypto.createHash('sha1').update(value).digest('hex');

const sanitizeBase = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const getUrlExtension = (url) => {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    if (!ext || ext.length > 8) return '';
    return ext;
  } catch {
    return '';
  }
};

const getExtensionFromContentType = (contentType) => {
  if (!contentType) return '';
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  return MIME_EXTENSION.get(normalized) || '';
};

const toRelativeFromRoot = (absolutePath) => {
  const relative = toPosix(path.relative(ROOT, absolutePath));
  if (!relative.startsWith('.')) return `./${relative}`;
  return relative;
};

const toRelativeFromFile = (filePath, absolutePath) => {
  const relative = toPosix(path.relative(path.dirname(filePath), absolutePath));
  if (relative.startsWith('.')) return relative;
  return `./${relative}`;
};

const timeoutFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 25_000);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        accept: 'image/*,video/*,*/*',
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timeout);
  }
};

const mapToEntries = (manifestMap) =>
  [...manifestMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([url, localPath]) => ({ url, localPath }));

const loadManifest = async () => {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    const map = new Map();
    for (const entry of entries) {
      if (!entry || typeof entry.url !== 'string' || typeof entry.localPath !== 'string') continue;
      map.set(entry.url, entry.localPath);
    }
    return { map, entries };
  } catch {
    return { map: new Map(), entries: [] };
  }
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

const splitSrcset = (value) =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

const ensureDirs = async () => {
  await fs.mkdir(MIRROR_DIR, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
};

const getDestinationPath = (url, contentType) => {
  const parsed = new URL(url);
  const hostPart = sanitizeBase(parsed.hostname.replace(/^www\./i, '')) || 'external';
  const pathBase = sanitizeBase(path.basename(parsed.pathname, path.extname(parsed.pathname))) || 'media';
  const ext = getExtensionFromContentType(contentType) || getUrlExtension(url) || '.bin';
  const digest = sha1(url).slice(0, 12);
  const fileName = `${hostPart}-${pathBase}-${digest}${ext}`;
  return path.join(MIRROR_DIR, fileName);
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const mirrorUrlFactory = (manifestMap, counters) => async (rawUrl, htmlFilePath) => {
  const normalized = normalizeExternalUrl(rawUrl);
  if (!isExternalUrl(normalized)) return rawUrl;

  const existingRelative = manifestMap.get(normalized);
  if (existingRelative) {
    const existingAbsolute = path.resolve(ROOT, existingRelative);
    if (await fileExists(existingAbsolute)) {
      counters.reused += 1;
      return toRelativeFromFile(htmlFilePath, existingAbsolute);
    }
  }

  const response = await timeoutFetch(normalized, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to mirror ${normalized} (${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  const destination = getDestinationPath(normalized, contentType);
  const body = Buffer.from(await response.arrayBuffer());
  if (!body.length) {
    throw new Error(`Received empty payload for ${normalized}`);
  }

  await fs.writeFile(destination, body);
  const localPath = toRelativeFromRoot(destination);
  manifestMap.set(normalized, localPath);
  counters.downloaded += 1;
  return toRelativeFromFile(htmlFilePath, destination);
};

const rewriteSrcset = async (value, filePath, mirrorUrl) => {
  const candidates = splitSrcset(value);
  if (!candidates.length) return value;

  const rewritten = [];
  for (const candidate of candidates) {
    const tokens = candidate.split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    const originalUrl = tokens[0];
    if (!isExternalUrl(normalizeExternalUrl(originalUrl))) {
      rewritten.push(candidate);
      continue;
    }
    const replacedUrl = await mirrorUrl(originalUrl, filePath);
    rewritten.push([replacedUrl, ...tokens.slice(1)].join(' '));
  }
  return rewritten.join(', ');
};

const rewriteTag = async (tagText, filePath, mirrorUrl) => {
  ATTR_RE.lastIndex = 0;
  let changed = false;
  let output = '';
  let lastIndex = 0;
  let match;

  while ((match = ATTR_RE.exec(tagText)) !== null) {
    output += tagText.slice(lastIndex, match.index);

    const attrName = match[1];
    const quote = match[2][0];
    const value = match[3] ?? match[4] ?? '';
    let rewrittenValue = value;

    if (attrName.toLowerCase() === 'srcset') {
      rewrittenValue = await rewriteSrcset(value, filePath, mirrorUrl);
    } else if (isExternalUrl(normalizeExternalUrl(value))) {
      rewrittenValue = await mirrorUrl(value, filePath);
    }

    if (rewrittenValue !== value) changed = true;
    output += `${attrName}=${quote}${rewrittenValue}${quote}`;
    lastIndex = ATTR_RE.lastIndex;
  }

  output += tagText.slice(lastIndex);
  return { text: output, changed };
};

const rewriteHtml = async (html, filePath, mirrorUrl) => {
  TAG_RE.lastIndex = 0;
  let output = '';
  let lastIndex = 0;
  let changed = false;
  let match;

  while ((match = TAG_RE.exec(html)) !== null) {
    output += html.slice(lastIndex, match.index);
    const rewritten = await rewriteTag(match[0], filePath, mirrorUrl);
    output += rewritten.text;
    if (rewritten.changed) changed = true;
    lastIndex = TAG_RE.lastIndex;
  }

  output += html.slice(lastIndex);
  return { html: output, changed };
};

const entriesEqual = (left, right) => {
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    if (left[i].url !== right[i].url || left[i].localPath !== right[i].localPath) {
      return false;
    }
  }
  return true;
};

const saveManifest = async (manifestMap, previousEntries) => {
  const entries = mapToEntries(manifestMap);
  if (entriesEqual(entries, previousEntries)) return false;

  await fs.writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        entries
      },
      null,
      2
    )}\n`,
    'utf8'
  );
  return true;
};

const main = async () => {
  await ensureDirs();
  const loadedManifest = await loadManifest();
  const manifestMap = loadedManifest.map;
  const htmlFiles = await listHtmlFiles();
  const counters = { downloaded: 0, reused: 0, updatedFiles: 0 };
  const mirrorUrl = mirrorUrlFactory(manifestMap, counters);

  for (const htmlFile of htmlFiles) {
    const absoluteFile = path.join(ROOT, htmlFile);
    const raw = await fs.readFile(absoluteFile, 'utf8');
    const rewritten = await rewriteHtml(raw, absoluteFile, mirrorUrl);
    if (rewritten.changed) {
      await fs.writeFile(absoluteFile, rewritten.html, 'utf8');
      counters.updatedFiles += 1;
      console.log(`Updated ${htmlFile}`);
    }
  }

  const manifestUpdated = await saveManifest(manifestMap, loadedManifest.entries);

  console.log('');
  console.log(`HTML files scanned: ${htmlFiles.length}`);
  console.log(`HTML files updated: ${counters.updatedFiles}`);
  console.log(`Media downloaded: ${counters.downloaded}`);
  console.log(`Media reused: ${counters.reused}`);
  console.log(`Manifest updated: ${manifestUpdated ? 'yes' : 'no'}`);
  console.log(`Manifest: ${toRelativeFromRoot(MANIFEST_PATH)}`);
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
