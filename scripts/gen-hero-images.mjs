// scripts/gen-hero-images.mjs
import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { constants as FS } from "node:fs";
import path from "node:path";

const argPath = process.argv[2]; // optional: node scripts/gen-hero-images.mjs path/to/source.png
const outDir = "public/img";
const name = "iPhoneSC"; // output basename

const candidates = [
  argPath,
  "public/raw/iPhoneSC.png",
  "public/raw/iPhoneSC.jpg",
  "public/raw/iPhoneSC.jpeg",
  "public/raw/iPhoneSC.webp",
  "public/raw/iPhoneSC.avif",
  "src/assets/images/iPhoneSC.png",
  "src/assets/images/iPhoneSC.jpg",
  "src/assets/images/iPhoneSC.jpeg",
  "src/assets/images/iPhoneSC.webp",
  "src/assets/images/iPhoneSC.avif",
  "public/img/iPhoneSC.png",
  "public/img/iPhoneSC.jpg",
  "public/img/iPhoneSC.jpeg",
  "public/img/iPhoneSC.webp",
  "public/img/iPhoneSC.avif",
].filter(Boolean);

async function firstExisting(paths) {
  for (const p of paths) {
    try {
      await access(p, FS.F_OK);
      return p;
    } catch {}
  }
  return null;
}

const src = await firstExisting(candidates);
if (!src) {
  console.error("❌ Could not find a source image. Looked for:\n" + candidates.map(p => " - " + p).join("\n"));
  console.error("\nTip: run `find public src -iname 'iPhoneSC.*'` to locate it, then rerun:\n  node scripts/gen-hero-images.mjs <path-to-your-file>");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const jobs = [
  { w: 640,  avifQ: 45, webpQ: 72 },
  { w: 960,  avifQ: 42, webpQ: 70 },
  { w: 1280, avifQ: 38, webpQ: 68 }, // optional; drop if not needed
];

const avifOpts = (q) => ({ quality: q, effort: 5, chromaSubsampling: "4:4:4" });
const webpOpts = (q) => ({ quality: q });

console.log(`✓ Using source: ${src}`);
for (const { w, avifQ, webpQ } of jobs) {
  const base = path.join(outDir, `${name}-${w}`);
  await sharp(src)
    .resize({ width: w, withoutEnlargement: true, fit: "inside" })
    .avif(avifOpts(avifQ))
    .toFile(`${base}.avif`);
  await sharp(src)
    .resize({ width: w, withoutEnlargement: true, fit: "inside" })
    .webp(webpOpts(webpQ))
    .toFile(`${base}.webp`);
  console.log(`✔ wrote ${base}.{avif,webp}`);
}
console.log("Done.");
