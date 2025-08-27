import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = "src/assets/images";
const outDir = "public/img";
const widths = [640, 960, 1280];

await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(inputDir, { withFileTypes: true }))
  .filter(d => d.isFile())
  .map(d => d.name)
  .filter(n => /\.(png|jpe?g)$/i.test(n));

for (const file of files) {
  const inPath = path.join(inputDir, file);
  const base = path.parse(file).name;
  // slug: spaces → dashes (safer URLs)
  const name = base.replace(/\s+/g, "-");

  for (const w of widths) {
    // AVIF
    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(path.join(outDir, `${name}-${w}.avif`));
    // WebP
    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(outDir, `${name}-${w}.webp`));
  }
  console.log(`✓ ${file}`);
}

console.log("Done. Outputs in public/img/");
