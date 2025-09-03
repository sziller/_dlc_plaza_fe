import fs from "fs/promises";
import path from "path";
const root = process.cwd();
const srcWeb = path.join(root, "node_modules/pdfjs-dist/web");
const srcWorker = path.join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const dstWeb = path.join(root, "public/pdfjs/web");
const dstBuild = path.join(root, "public/pdfjs/build");

async function cpDir(src, dst) {
  await fs.mkdir(dst, { recursive: true });
  for (const e of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) await cpDir(s, d);
    else await fs.copyFile(s, d);
  }
}
await cpDir(srcWeb, dstWeb);
await fs.mkdir(dstBuild, { recursive: true });
await fs.copyFile(srcWorker, path.join(dstBuild, "pdf.worker.min.mjs"));
console.log("PDF.js copied to public/pdfjs");
