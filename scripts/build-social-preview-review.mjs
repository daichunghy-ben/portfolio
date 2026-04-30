import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const outputPath = path.join(ROOT, 'assets', 'social-preview-review-v4.jpg');
const WIDTH = 1200;
const HEIGHT = 630;

const cardSvg = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgMain" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#edf7fb"/>
      <stop offset="40%" stop-color="#f8dfe9"/>
      <stop offset="74%" stop-color="#fde5d5"/>
      <stop offset="100%" stop-color="#fff8fb"/>
    </linearGradient>
    <linearGradient id="badgeBg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d6e5ff" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#d8dcff" stop-opacity="0.78"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgMain)"/>
  <circle cx="96" cy="92" r="212" fill="#8ad8ef" fill-opacity="0.16"/>
  <circle cx="336" cy="552" r="154" fill="#ba9fe8" fill-opacity="0.20"/>
  <circle cx="1018" cy="160" r="52" fill="#ffb57f" fill-opacity="0.34"/>
  <rect x="804" y="62" width="68" height="68" rx="18" fill="#db93c8" fill-opacity="0.30"/>

  <rect x="44" y="42" width="550" height="42" rx="21" fill="url(#badgeBg)"/>
  <text x="66" y="70" font-size="19" font-weight="600" fill="#0a7be0" font-family="Arial, Helvetica, sans-serif">Open to full-time roles • Market research • Consumer insights</text>

  <text x="44" y="194" font-size="98" font-weight="700" fill="#bd8b3f" font-family="Arial, Helvetica, sans-serif">Chung Hy Dai</text>
  <text x="44" y="264" font-size="62" font-weight="600" fill="#455674" font-family="Arial, Helvetica, sans-serif">Market Research &amp; Consumer</text>
  <text x="44" y="328" font-size="62" font-weight="600" fill="#455674" font-family="Arial, Helvetica, sans-serif">Insights</text>

  <rect x="44" y="334" width="734" height="246" rx="24" fill="#ffffff" fill-opacity="0.72" stroke="#cfdae9" stroke-width="2"/>
  <line x1="76" y1="386" x2="744" y2="386" stroke="#6f809c" stroke-opacity="0.35" stroke-width="2"/>

  <circle cx="88" cy="426" r="11" fill="none" stroke="#41628d" stroke-width="2"/>
  <path d="M88 415 V437 M77 426 H99" stroke="#41628d" stroke-width="2"/>
  <text x="112" y="432" font-size="21" font-weight="600" fill="#425c83" font-family="Arial, Helvetica, sans-serif">Website</text>
  <text x="252" y="432" font-size="30" font-weight="600" fill="#263750" font-family="Arial, Helvetica, sans-serif">chunghy.pages.dev</text>

  <rect x="78" y="454" width="20" height="15" rx="3" fill="none" stroke="#41628d" stroke-width="2"/>
  <path d="M79 455 L88 463 L97 455" stroke="#41628d" stroke-width="2" fill="none"/>
  <text x="112" y="468" font-size="21" font-weight="600" fill="#425c83" font-family="Arial, Helvetica, sans-serif">Email</text>
  <text x="252" y="468" font-size="30" font-weight="600" fill="#263750" font-family="Arial, Helvetica, sans-serif">daichunghy@gmail.com</text>

  <rect x="79" y="489" width="17" height="17" rx="4" fill="none" stroke="#41628d" stroke-width="2"/>
  <path d="M84 495 L91 495 M84 500 L91 500" stroke="#41628d" stroke-width="2"/>
  <text x="112" y="504" font-size="21" font-weight="600" fill="#425c83" font-family="Arial, Helvetica, sans-serif">LinkedIn</text>
  <text x="252" y="504" font-size="26" font-weight="600" fill="#263750" font-family="Arial, Helvetica, sans-serif">linkedin.com/in/chung-hy-d-17792826b</text>

  <text x="76" y="562" font-size="19" font-weight="500" fill="#4e607e" font-family="Arial, Helvetica, sans-serif">Portfolio • Projects • Publications</text>

  <rect x="820" y="334" width="332" height="246" rx="24" fill="#ffffff" fill-opacity="0.62" stroke="#cfdae9" stroke-width="2"/>
  <circle cx="910" cy="426" r="48" fill="none" stroke="#4b6388" stroke-width="3"/>
  <circle cx="910" cy="426" r="20" fill="none" stroke="#4b6388" stroke-width="3"/>
  <path d="M910 378 V474 M862 426 H958" stroke="#4b6388" stroke-width="3"/>
  <text x="974" y="434" font-size="32" font-weight="600" fill="#3e5578" font-family="Arial, Helvetica, sans-serif">Insight</text>

  <path d="M864 518 H1108" stroke="#4b6388" stroke-opacity="0.45" stroke-width="2"/>
  <path d="M872 554 L904 522 L936 554 L968 522 L1000 554 L1032 522 L1064 554" fill="none" stroke="#4b6388" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

const build = async () => {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(cardSvg)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(outputPath);
  console.log(`Created ${path.relative(ROOT, outputPath)}`);
};

build().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
