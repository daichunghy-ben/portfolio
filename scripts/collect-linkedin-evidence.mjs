import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, '.audit', 'linkedin');

const TARGET_URL = (process.env.TARGET_URL || 'https://chunghy-portfolio.pages.dev').trim();
const LINKEDIN_REDIRECT_URL = `https://www.linkedin.com/redir/redirect?url=${encodeURIComponent(TARGET_URL)}`;
const LINKEDIN_BOT_UA =
  'LinkedInBot/1.0 (compatible; Mozilla/5.0; +http://www.linkedin.com)';

const fetchHead = async (url, userAgent) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: userAgent ? { 'user-agent': userAgent } : undefined
    });

    return {
      ok: true,
      finalUrl: response.url,
      status: response.status,
      server: response.headers.get('server') || '',
      contentType: response.headers.get('content-type') || '',
      cfRay: response.headers.get('cf-ray') || ''
    };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
};

const extractLinkedinMessage = (html) => {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || '';
  const heading = html.match(/<h3[^>]*>([^<]+)<\/h3>/i)?.[1]?.trim() || '';
  const body =
    html
      .match(/<p class="content">([\s\S]*?)<\/p>/i)?.[1]
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim() || '';
  return { title, heading, body };
};

const main = async () => {
  const [normalHead, botHead, linkedinPage] = await Promise.all([
    fetchHead(TARGET_URL, ''),
    fetchHead(TARGET_URL, LINKEDIN_BOT_UA),
    fetch(LINKEDIN_REDIRECT_URL, { redirect: 'follow' }).then((response) => response.text())
  ]);

  const linkedinMessage = extractLinkedinMessage(linkedinPage);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(OUT_DIR, `evidence-${stamp}.md`);

  const report = [
    '# LinkedIn Link-Block Evidence',
    '',
    `- Timestamp (UTC): ${new Date().toISOString()}`,
    `- Target URL: ${TARGET_URL}`,
    `- LinkedIn Redirect Check: ${LINKEDIN_REDIRECT_URL}`,
    '',
    '## HEAD Check (Normal UA)',
    '```json',
    JSON.stringify(normalHead, null, 2),
    '```',
    '',
    '## HEAD Check (LinkedInBot UA)',
    '```json',
    JSON.stringify(botHead, null, 2),
    '```',
    '',
    '## LinkedIn Redirect Page Snapshot',
    '```json',
    JSON.stringify(linkedinMessage, null, 2),
    '```',
    '',
    '## Raw Notes',
    '- If the redirect page returns a warning/error while HEAD checks are healthy, the issue is usually domain reputation/trust scoring on LinkedIn, not uptime.',
    ''
  ].join('\n');

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(outputPath, report, 'utf8');

  console.log(`Saved evidence report: ${path.relative(ROOT, outputPath)}`);
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
