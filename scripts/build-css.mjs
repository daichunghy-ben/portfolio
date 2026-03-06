import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'styles');
const OUT_DIR = path.join(ROOT, 'dist', 'styles');
const CLEAN_CSS_BIN = path.join(
  ROOT,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'cleancss.cmd' : 'cleancss'
);

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(cmd)} exited with code ${code}`));
    });
  });

const main = async () => {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = (await fs.readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => entry.name)
    .sort();

  for (const fileName of files) {
    await run(CLEAN_CSS_BIN, [
      '-o',
      path.join(OUT_DIR, fileName),
      path.join(SOURCE_DIR, fileName)
    ]);
  }
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
