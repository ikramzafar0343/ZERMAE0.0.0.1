/**
 * Pre-build ?w= WebP derivatives so first Lighthouse hit is not a cold sharp resize.
 *
 * Usage:
 *   npx tsx scripts/warm-media-derivatives.ts --dir /app/uploads
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import { getOrCreateDerivative, MEDIA_WIDTHS } from "../src/server/services/upload/media-derivative";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "originals" || entry.name === ".git" || entry.name === ".cache") continue;
      files.push(...(await walk(full)));
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf("--dir");
  const dir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1]!)
      : path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

  console.log(`warm-media-derivatives  dir=${dir}`);
  const files = await walk(dir);
  let built = 0;

  for (const file of files) {
    const size = (await stat(file)).size;
    if (size < 20_000) continue;
    for (const width of MEDIA_WIDTHS) {
      const out = await getOrCreateDerivative({
        sourcePath: file,
        uploadDir: dir,
        width,
        preferAvif: false,
      });
      built += 1;
      console.log(`OK  ${path.relative(dir, file)}  w=${width}  ${out.buffer.length}B`);
    }
  }

  console.log(`\nWarmed ${built} derivative(s) for ${files.length} file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
