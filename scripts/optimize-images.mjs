import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGETS = [
  { dir: "public/sneakers", maxWidth: 1600, quality: 82 },
  { dir: "public/lifestyle", maxWidth: 2400, quality: 80 },
];

let totalBefore = 0;
let totalAfter = 0;

for (const { dir, maxWidth, quality } of TARGETS) {
  const abs = path.join(ROOT, dir);
  const files = await readdir(abs);
  for (const f of files) {
    if (!/\.png$/i.test(f)) continue;
    const src = path.join(abs, f);
    const dst = path.join(abs, f.replace(/\.png$/i, ".webp"));
    const beforeBytes = (await stat(src)).size;

    await sharp(src)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(dst);

    const afterBytes = (await stat(dst)).size;
    totalBefore += beforeBytes;
    totalAfter += afterBytes;

    const pct = ((1 - afterBytes / beforeBytes) * 100).toFixed(1);
    console.log(
      `  ${f.padEnd(60)}  ${(beforeBytes / 1024).toFixed(0)}KB -> ${(afterBytes / 1024).toFixed(0)}KB  (-${pct}%)`,
    );
  }
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB  (saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)}MB)`,
);
