import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const outputPath = path.join(ROOT, 'assets', 'social-preview-og-v6.jpg');

const WIDTH = 1200;
const HEIGHT = 630;

const cardSvg = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#23252a" stroke-width="1"/>
    </pattern>
    <linearGradient id="panelGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#17191f"/>
      <stop offset="100%" stop-color="#0d0e12"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1200" height="630" fill="#020203"/>
  <rect x="26" y="26" width="1148" height="578" rx="18" fill="url(#panelGlow)" stroke="#f1f1f2" stroke-width="3"/>
  <rect x="26" y="26" width="1148" height="578" rx="18" fill="url(#grid)" opacity="0.42"/>
  <line x1="760" y1="72" x2="760" y2="558" stroke="#8a9098" stroke-opacity="0.35" stroke-width="2"/>

  <rect x="76" y="82" width="98" height="98" rx="20" fill="#0f1014" stroke="#f4f4f5" stroke-width="3"/>
  <path d="M102 152 L102 108 L126 132 L150 108 L150 152" fill="none" stroke="#f4f4f5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="198" y="146" font-size="34" font-weight="700" fill="#f7f7f8" font-family="Arial, Helvetica, sans-serif">Chung Hy Dai</text>
  <text x="198" y="176" font-size="20" font-weight="500" fill="#b9bec7" font-family="Arial, Helvetica, sans-serif">Market Research • Consumer Insights</text>

  <text x="76" y="278" font-size="68" font-weight="700" fill="#f6f6f7" font-family="Arial, Helvetica, sans-serif">Applied Research</text>
  <text x="76" y="346" font-size="68" font-weight="700" fill="#f6f6f7" font-family="Arial, Helvetica, sans-serif">Portfolio</text>

  <line x1="76" y1="392" x2="706" y2="392" stroke="#d1d5db" stroke-opacity="0.35" stroke-width="2"/>
  <text x="76" y="448" font-size="28" font-weight="500" fill="#f0f2f5" font-family="Arial, Helvetica, sans-serif">chunghy.pages.dev</text>
  <text x="76" y="492" font-size="24" font-weight="500" fill="#9ea4ae" font-family="Arial, Helvetica, sans-serif">Portfolio • Projects • Publications</text>

  <rect x="824" y="106" width="300" height="420" rx="24" fill="#0d0f13" stroke="#f0f0f1" stroke-width="3"/>
  <path d="M868 164 H1080 M868 214 H1080 M868 264 H1080" stroke="#c9ced6" stroke-opacity="0.72" stroke-width="2"/>
  <rect x="868" y="312" width="170" height="170" rx="16" fill="none" stroke="#f0f0f1" stroke-width="3"/>
  <circle cx="1056" cy="397" r="28" fill="none" stroke="#f0f0f1" stroke-width="3"/>
  <path d="M1038 415 L1074 379 M1038 379 L1074 415" stroke="#f0f0f1" stroke-width="3"/>
</svg>
`);

const build = async () => {
  const image = sharp(cardSvg)
    .jpeg({
      quality: 92,
      chromaSubsampling: '4:4:4'
    });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await image.toFile(outputPath);
  console.log(`Created ${path.relative(ROOT, outputPath)}`);
};

build().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
