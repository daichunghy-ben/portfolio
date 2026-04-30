import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, 'assets');

const writePng = async (filename, svg) => {
  await fs.mkdir(ASSETS_DIR, { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS_DIR, filename));
};

const leaf = (cx, cy, rx, ry, rotate, fill = '#7d8d72') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity=".88" transform="rotate(${rotate} ${cx} ${cy})"/>`;

const line = (d, width = 4, color = '#687660', opacity = 0.65) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"/>`;

const botanicalVase = () => {
  const leaves = [
    leaf(758, 230, 30, 12, -28), leaf(826, 188, 36, 13, 22), leaf(890, 250, 32, 12, -22),
    leaf(796, 344, 32, 12, 32), leaf(910, 382, 28, 11, -35), leaf(990, 334, 34, 13, 18),
    leaf(716, 438, 30, 11, -16), leaf(848, 482, 34, 12, 28), leaf(980, 506, 30, 11, -22),
    leaf(612, 700, 36, 13, -28), leaf(688, 648, 30, 11, 24), leaf(734, 750, 32, 12, -22),
    leaf(790, 666, 28, 11, 36), leaf(878, 708, 34, 12, -14), leaf(948, 642, 28, 11, 28)
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1100" viewBox="0 0 1400 1100">
  <defs>
    <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#ffffff" stop-opacity=".92"/>
      <stop offset=".55" stop-color="#dfeaea" stop-opacity=".45"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".74"/>
    </linearGradient>
    <radialGradient id="shadow" cx=".5" cy=".5" r=".55">
      <stop stop-color="#4d5f5b" stop-opacity=".22"/>
      <stop offset=".7" stop-color="#4d5f5b" stop-opacity=".06"/>
      <stop offset="1" stop-color="#4d5f5b" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  <rect width="1400" height="1100" fill="#f7f8f5"/>
  <ellipse cx="916" cy="865" rx="310" ry="80" fill="url(#shadow)"/>
  <g filter="url(#soft)" opacity=".34" transform="translate(150 80)">
    ${line('M800 172 C920 300 968 446 1020 704', 12, '#6f7c65', .55)}
    ${line('M858 246 C1018 320 1110 430 1190 662', 10, '#6f7c65', .4)}
    ${line('M752 392 C632 496 562 630 496 828', 10, '#6f7c65', .38)}
    ${leaves}
  </g>
  <g>
    ${line('M820 180 C900 320 930 480 936 760', 5)}
    ${line('M836 258 C974 338 1054 450 1110 720', 4)}
    ${line('M788 366 C704 498 672 628 650 780', 4)}
    ${line('M926 412 C840 534 788 642 760 802', 4)}
    ${leaves}
  </g>
  <g transform="translate(760 650)">
    <path d="M92 0h188c-20 56-30 118-30 188v134c0 70-50 118-124 118H92C18 440-32 392-32 322V188C-32 118-20 56 0 0h92z" fill="url(#glass)" stroke="#c7d4d2" stroke-width="4"/>
    <path d="M-18 230h258" stroke="#9fb8b4" stroke-width="4" opacity=".55"/>
    <path d="M34 34h184" stroke="#ffffff" stroke-width="8" opacity=".7"/>
    <path d="M28 64c-24 74-28 148-28 250" stroke="#ffffff" stroke-width="8" opacity=".38"/>
  </g>
  </svg>`;
};

const editorialDevice = ({ title, mode = 'creator' }) => {
  const accent = mode === 'ev' ? '#0f766e' : mode === 'virtual' ? '#28566a' : mode === 'buffet' ? '#9f6b3f' : '#0f766e';
  const soft = mode === 'buffet' ? '#fff4ea' : '#eef7f5';
  const cards = mode === 'virtual'
    ? `<circle cx="1060" cy="370" r="118" fill="#eaf1f3" stroke="#bed0d5" stroke-width="3"/>
       <path d="M1002 410c34 42 92 42 126 0" fill="none" stroke="#28566a" stroke-width="9" stroke-linecap="round"/>
       <circle cx="1020" cy="348" r="10" fill="#28566a"/><circle cx="1100" cy="348" r="10" fill="#28566a"/>
       <path d="M960 275c70-70 140-70 210 0" fill="none" stroke="#7d8d72" stroke-width="8" stroke-linecap="round"/>`
    : mode === 'buffet'
      ? `<rect x="900" y="255" width="330" height="430" rx="16" fill="#ffffff" stroke="#ead7c4" stroke-width="3"/>
         <rect x="940" y="310" width="250" height="42" rx="21" fill="#eaf1e8"/>
         <rect x="940" y="382" width="250" height="42" rx="21" fill="#fff0df"/>
         <rect x="940" y="454" width="250" height="42" rx="21" fill="#eaf1e8"/>
         <rect x="940" y="526" width="250" height="42" rx="21" fill="#fff0df"/>
         <path d="M865 295c-62 48-96 114-102 200" fill="none" stroke="#7d8d72" stroke-width="9" stroke-linecap="round"/>
         ${leaf(820, 350, 44, 18, -28)}${leaf(776, 440, 38, 16, 24)}${leaf(865, 520, 42, 17, -18)}`
      : mode === 'ev'
        ? `<rect x="932" y="258" width="210" height="355" rx="24" fill="#ffffff" stroke="#cbd8d6" stroke-width="3"/>
           <circle cx="1038" cy="375" r="64" fill="#e7f3f1"/>
           <path d="M1010 382h52m-26-26v52" stroke="#0f766e" stroke-width="12" stroke-linecap="round"/>
           <path d="M1116 500c84 14 122 54 116 120" fill="none" stroke="#0f766e" stroke-width="9" stroke-linecap="round"/>
           <path d="M674 650c64-72 286-86 388-36" fill="none" stroke="#0f1f2a" stroke-width="10" stroke-linecap="round"/>`
        : `<rect x="880" y="250" width="330" height="215" rx="18" fill="#ffffff" stroke="#cbd8d6" stroke-width="3"/>
           <rect x="920" y="300" width="150" height="18" rx="9" fill="#0f766e"/>
           <rect x="920" y="344" width="238" height="14" rx="7" fill="#ccd8d3"/>
           <rect x="920" y="382" width="190" height="14" rx="7" fill="#ccd8d3"/>
           <circle cx="1150" cy="322" r="34" fill="#e7f3f1"/>
           <path d="M845 590c90-56 220-62 350-12" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1586" height="992" viewBox="0 0 1586 992">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fbfcfa"/>
      <stop offset="1" stop-color="${soft}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#0f1f2a" flood-opacity=".14"/></filter>
  </defs>
  <rect width="1586" height="992" fill="url(#bg)"/>
  <path d="M1060 60c120 80 206 198 260 354" fill="none" stroke="#d7e2df" stroke-width="2"/>
  <path d="M1015 105c-110 96-172 212-210 360" fill="none" stroke="#d7e2df" stroke-width="2"/>
  ${leaf(1230, 160, 50, 18, -28, '#9aa88f')}${leaf(1320, 278, 44, 16, 24, '#7d8d72')}${leaf(870, 180, 42, 15, -18, '#9aa88f')}${leaf(810, 318, 46, 16, 24, '#7d8d72')}
  <g filter="url(#shadow)">
    <rect x="150" y="165" width="690" height="520" rx="26" fill="#ffffff" stroke="#d6dedc" stroke-width="3"/>
    <rect x="205" y="225" width="580" height="320" rx="20" fill="#f5f8f7"/>
    <path d="M260 485c68-76 132-112 190-104 76 11 116 100 192 108 46 5 78-20 116-78" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
    <rect x="260" y="592" width="170" height="18" rx="9" fill="${accent}" opacity=".85"/>
    <rect x="260" y="632" width="344" height="16" rx="8" fill="#cfdad7"/>
    <rect x="260" y="668" width="270" height="16" rx="8" fill="#dbe4e1"/>
  </g>
  ${cards}
  <g transform="translate(150 755)">
    <rect width="560" height="2" fill="${accent}" opacity=".55"/>
    <text x="0" y="54" font-family="Avenir Next, Manrope, Arial, sans-serif" font-size="44" font-weight="700" fill="#0f1f2a">${title}</text>
  </g>
  </svg>`;
};

const educationCard = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1586" height="992" viewBox="0 0 1586 992">
  <defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#fbfcfa"/><stop offset="1" stop-color="#edf5f3"/></linearGradient></defs>
  <rect width="1586" height="992" fill="url(#bg)"/>
  <g transform="translate(180 150)">
    <rect width="560" height="670" rx="24" fill="#ffffff" stroke="#d4dedb" stroke-width="3"/>
    <path d="M80 160h400M80 250h330M80 340h400M80 430h300M80 520h360" stroke="#d2ddd9" stroke-width="20" stroke-linecap="round"/>
    <circle cx="465" cy="110" r="58" fill="#e7f3f1"/>
    <path d="M433 112h64M465 80v64" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g transform="translate(860 238)">
    <path d="M0 95 260 0l260 95-260 95z" fill="#0f1f2a"/>
    <path d="M120 160v135c72 58 208 58 280 0V160" fill="#ffffff" stroke="#0f1f2a" stroke-width="12" stroke-linejoin="round"/>
    <path d="M520 100v224" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/>
    <circle cx="520" cy="350" r="24" fill="#0f766e"/>
  </g>
  ${line('M990 690 C1080 610 1168 576 1270 606', 8, '#7d8d72', .55)}
  ${leaf(1060, 634, 44, 17, -24)}${leaf(1172, 602, 38, 15, 20)}${leaf(1230, 650, 42, 16, -18)}
  <text x="860" y="760" font-family="Avenir Next, Manrope, Arial, sans-serif" font-size="52" font-weight="700" fill="#0f1f2a">Education</text>
  <text x="862" y="818" font-family="Avenir Next, Manrope, Arial, sans-serif" font-size="28" fill="#52616a">Swinburne University of Technology</text>
</svg>`;

await writePng('portfolio-botanical-vase.png', botanicalVase());
await writePng('portfolio-creator-editorial.png', editorialDevice({ title: 'Creator Signals', mode: 'creator' }));
await writePng('portfolio-virtual-influencer-editorial.png', editorialDevice({ title: 'Trust Cues', mode: 'virtual' }));
await writePng('portfolio-buffet-editorial.png', editorialDevice({ title: 'Choice Design', mode: 'buffet' }));
await writePng('portfolio-ev-editorial.png', editorialDevice({ title: 'EV Preference', mode: 'ev' }));
await writePng('portfolio-education-editorial.png', educationCard());

console.log('Generated editorial portfolio assets.');
