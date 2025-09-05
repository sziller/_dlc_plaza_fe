// scripts/gen-logo.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const src = process.argv[2] || "./src/assets/logos/cadena_bitcoin_logo.png"; 
const outDir = "public/img";
await mkdir(outDir, { recursive: true });

// adjust to your header height; e.g. if header logo is ~28–32px tall,
// widths below assume aspect ratio ~3.75:1 (tweak to your logo)
const targets = [
  { w: 120,  webpQ: 82, avifQ: 45 }, // 1x
  { w: 240,  webpQ: 80, avifQ: 42 }, // 2x
];

for (const t of targets) {
  const base = `${outDir}/logo-${t.w}`;
  await sharp(src).resize({ width: t.w }).webp({ quality: t.webpQ }).toFile(`${base}.webp`);
  await sharp(src).resize({ width: t.w }).avif({ quality: t.avifQ, effort: 5 }).toFile(`${base}.avif`);
  console.log(`✔ ${base}.{webp,avif}`);
}
console.log("Done.");
