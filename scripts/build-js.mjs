import fs from 'node:fs/promises';
import path from 'node:path';
import { minify } from 'terser';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'js');
const OUT_DIR = path.join(ROOT, 'dist', 'js');
const MODULE_RE = /^\s*(?:import|export)\b/m;

const main = async () => {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = (await fs.readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => entry.name)
    .sort();

  for (const fileName of files) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const outputPath = path.join(OUT_DIR, fileName);
    const source = await fs.readFile(sourcePath, 'utf8');
    const result = await minify(source, {
      module: MODULE_RE.test(source),
      compress: true,
      mangle: true,
      format: {
        comments: false
      }
    });

    if (!result.code) {
      throw new Error(`Failed to minify ${fileName}`);
    }

    await fs.writeFile(outputPath, `${result.code}\n`, 'utf8');
  }
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
