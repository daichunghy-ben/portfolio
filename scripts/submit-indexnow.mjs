import fs from 'node:fs/promises';

const DEFAULT_SITE_URL = 'https://daichunghy-ben.github.io/';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY = '29b32fc996d617451de2f50fb62aae0c';
const KEY_FILE = `${KEY}.txt`;

const normalizeSiteUrl = (value) => {
  const raw = String(value || '').trim() || DEFAULT_SITE_URL;
  const url = new URL(raw);
  url.hash = '';
  url.search = '';
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  return url.href;
};

const readSitemapUrls = async (siteUrl) => {
  const stagedPath = new URL('./.deploy/public/sitemap.xml', `file://${process.cwd()}/`);
  let sitemapText = '';

  try {
    sitemapText = await fs.readFile(stagedPath, 'utf8');
  } catch {
    const response = await fetch(new URL('sitemap.xml', siteUrl).href);
    if (!response.ok) {
      throw new Error(`Unable to read sitemap.xml: HTTP ${response.status}`);
    }
    sitemapText = await response.text();
  }

  return [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
};

const main = async () => {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const host = new URL(siteUrl).host;
  const urlList = await readSitemapUrls(siteUrl);

  if (!urlList.length) {
    throw new Error('No URLs found in sitemap.xml.');
  }

  const payload = {
    host,
    key: KEY,
    keyLocation: new URL(KEY_FILE, siteUrl).href,
    urlList
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${body}`);
  }

  console.log(`Submitted ${urlList.length} URLs to IndexNow for ${host}.`);
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
