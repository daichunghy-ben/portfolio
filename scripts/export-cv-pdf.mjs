#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const defaultInput = "cv-momo-data-analyst-trainee.html";
const defaultOutput = "output/pdf/chung-hy-dai-momo-data-analyst-trainee-cv.pdf";

function resolveFromRepo(value) {
  return path.isAbsolute(value) ? value : path.resolve(repoRoot, value);
}

function ensureTool(binary, label) {
  if (!fs.existsSync(binary)) {
    throw new Error(`${label} not found at ${binary}`);
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function toFileUrl(filePath) {
  return new URL(`file://${filePath}`).toString();
}

const inputPath = resolveFromRepo(process.argv[2] || defaultInput);
const outputPath = resolveFromRepo(process.argv[3] || defaultOutput);
const previewPath = resolveFromRepo("tmp/pdfs/chung-hy-dai-momo-data-analyst-trainee-cv-page-1.png");
const stalePreviewPath = resolveFromRepo("tmp/pdfs/chung-hy-dai-momo-data-analyst-trainee-cv-page-2.png");

if (!fs.existsSync(inputPath)) {
  throw new Error(`Input HTML not found: ${inputPath}`);
}

ensureTool(chromePath, "Google Chrome");
ensureDir(outputPath);
ensureDir(previewPath);
fs.rmSync(stalePreviewPath, { force: true });

const pdfArgs = [
  "--headless=new",
  "--disable-gpu",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=2500",
  "--allow-file-access-from-files",
  "--no-pdf-header-footer",
  `--print-to-pdf=${outputPath}`,
  toFileUrl(inputPath),
];

execFileSync(chromePath, pdfArgs, { stdio: "inherit" });

const screenshotArgs = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "--window-size=940,1320",
  `--screenshot=${previewPath}`,
  toFileUrl(inputPath),
];

execFileSync(chromePath, screenshotArgs, { stdio: "inherit" });

console.log(`PDF written to ${outputPath}`);
console.log(`Preview written to ${previewPath}`);
