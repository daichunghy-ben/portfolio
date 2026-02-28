import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = path.join(root, 'assets');
const outDir = path.join(assetsDir, 'optimized');

const targets = [
  'leveraging-influencer-dashboard.png',
  'psych-ownership-framework.png',
  'virtual-influencer-map.png',
  'student-group.jpg',
  'buffet-menu.png',
  'presentation.jpg',
  'hanoi-phaseout-dashboard.png',
  'prca-asymmetry-dashboard.png',
  'arts-workshop.jpg',
  'ev-choice-experiment.png',
  'hotel-segmentation-fig1.png',
  'profile-main.png',
  'fig04_embedding_scatter.png',
  'fig03_valence_heatmap.png',
  'external/wikimedia/motorbikes-at-hanoi-vietnam.jpg',
  'external/wikimedia/hanoi-metro-train-vanh-dai-3.jpg',
  'external/wikimedia/hanoi-brt-bus.jpg',
  'external/wikimedia/vinfast-charging-station-hoa-binh-01.jpg',
  'external/virtual-influencer-simulation.png',
  'external/khoai-lang-thang-youtube-maxres.jpg',
  'external/vo-ha-linh-affiliate-youtube-maxres.jpg',
  'external/hannah-olala-brandtrip-youtube-maxres.jpg',
  'external/toc-tien-ai-clear-head-virtual-influencer.jpg',
  'external/nebasei-kokoro-vtuber.png',
  'external/codemiko-vtuber.png',
  'external/vi-sim-high-high.png',
  'external/vi-sim-high-low.png',
  'external/vi-sim-low-high.png',
  'external/vi-sim-low-low.png',
  'external/mirror/images-unsplash-com-photo-1572013883577-c12e62aaed82-2731f99c271f.jpg',
  'external/mirror/images-unsplash-com-photo-1683540991277-e10df62d77d4-106bdee8d5f8.jpg',
  'external/mirror/images-unsplash-com-photo-1563909980-97c3c6e1eb23-8af731b9f1db.jpg',
  'external/mirror/images-unsplash-com-photo-1682264995744-f3919622ec6b-e885e73a1f68.jpg',
  'external/mirror/images-unsplash-com-photo-1759641801965-a15a53b877b4-6b3b0ef23be4.jpg',
  'external/mirror/images-unsplash-com-photo-1520250497591-112f2f40a3f4-462e845d7017.jpg'
];

const widths = [480, 768, 1024, 1440, 1800];

await fs.mkdir(outDir, { recursive: true });

for (const filename of targets) {
  const input = path.join(assetsDir, filename);
  const source = sharp(input, { failOn: 'none' });
  const meta = await source.metadata();
  if (!meta.width) continue;

  const name = filename.replace(/\.[^.]+$/, '');
  const validWidths = widths.filter((w) => w < meta.width).concat(meta.width);

  for (const width of [...new Set(validWidths)]) {
    const avifOutput = path.join(outDir, `${name}-${width}.avif`);
    const webpOutput = path.join(outDir, `${name}-${width}.webp`);
    await fs.mkdir(path.dirname(avifOutput), { recursive: true });
    await fs.mkdir(path.dirname(webpOutput), { recursive: true });

    await source
      .clone()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 50, effort: 4 })
      .toFile(avifOutput);

    await source
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 68, effort: 4 })
      .toFile(webpOutput);
  }

  // Produce an optimized fallback image in original format for safe replacement.
  const optimizedPath = path.join(outDir, `${name}-optimized.webp`);
  await fs.mkdir(path.dirname(optimizedPath), { recursive: true });
  await source
    .clone()
    .resize({ width: Math.min(meta.width, 1600), withoutEnlargement: true })
    .webp({ quality: 70, effort: 4 })
    .toFile(optimizedPath);
}

console.log(`Generated responsive images in ${outDir}`);
