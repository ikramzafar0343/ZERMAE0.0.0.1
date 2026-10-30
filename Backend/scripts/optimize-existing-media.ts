/**
 * Optimize existing media on disk (UPLOAD_DIR and optional public media).
 *
 * Usage:
 *   npx tsx scripts/optimize-existing-media.ts --dry-run
 *   npx tsx scripts/optimize-existing-media.ts --apply
 *   npx tsx scripts/optimize-existing-media.ts --apply --dir ../Frontend/public/media --purpose content
 */
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { optimizeImageBuffer } from "../src/server/services/upload/optimize-image";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".tif", ".tiff"]);

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const dryRun = !apply;
  const dirIdx = argv.indexOf("--dir");
  const purposeIdx = argv.indexOf("--purpose");
  const dir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1]!)
      : path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
  const purpose = purposeIdx >= 0 && argv[purposeIdx + 1] ? argv[purposeIdx + 1]! : "content";
  return { dryRun, dir, purpose };
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "originals" || entry.name === ".git") continue;
      files.push(...(await walk(full)));
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const { dryRun, dir, purpose } = parseArgs(process.argv.slice(2));
  console.log(`optimize-existing-media  dir=${dir}  purpose=${purpose}  mode=${dryRun ? "dry-run" : "apply"}`);

  let files: string[];
  try {
    files = await walk(dir);
  } catch (error) {
    console.error(`Cannot read directory: ${dir}`, error);
    process.exit(1);
  }

  const backupRoot = path.join(dir, "originals");
  if (!dryRun) {
    await mkdir(backupRoot, { recursive: true });
  }

  const rows: Array<{ file: string; before: number; after: number; saved: string }> = [];

  for (const file of files) {
    if (file.includes(`${path.sep}originals${path.sep}`)) continue;
    const before = (await stat(file)).size;
    if (before < 40_000) {
      continue;
    }
    const input = await readFile(file);
    let optimized;
    try {
      optimized = await optimizeImageBuffer(input, { purpose });
    } catch (error) {
      console.warn(`skip ${file}:`, error);
      continue;
    }
    if (optimized.buffer.length >= before * 0.95) {
      continue;
    }
    const rel = path.relative(dir, file);
    const after = optimized.buffer.length;
    const saved = `${(((before - after) / before) * 100).toFixed(1)}%`;
    rows.push({ file: rel, before, after, saved });

    if (dryRun) {
      console.log(`DRY  ${rel}  ${before} → ${after} (${saved})`);
      continue;
    }

    const backupPath = path.join(backupRoot, rel);
    await mkdir(path.dirname(backupPath), { recursive: true });
    await copyFile(file, backupPath);

    const nextExt = `.${optimized.ext}`;
    const currentExt = path.extname(file).toLowerCase();
    const sameFamily =
      currentExt === nextExt ||
      (nextExt === ".jpg" && (currentExt === ".jpeg" || currentExt === ".jpg"));

    if (sameFamily) {
      await writeFile(file, optimized.buffer);
      console.log(`OK   ${rel}  ${before} → ${after} (${saved})`);
    } else {
      const nextPath = file.slice(0, -currentExt.length) + nextExt;
      await writeFile(nextPath, optimized.buffer);
      console.log(`OK   ${rel} → ${path.basename(nextPath)}  ${before} → ${after} (${saved})`);
      console.log(`     Remap CMS/product URLs from ${path.basename(file)} to ${path.basename(nextPath)}`);
    }
  }

  console.log("\nSummary");
  console.log("| Asset | Original | Optimized | Reduction |");
  console.log("|---|---|---|---|");
  for (const row of rows) {
    console.log(`| ${row.file} | ${row.before} | ${row.after} | ${row.saved} |`);
  }
  console.log(`\n${rows.length} file(s) ${dryRun ? "would be" : "were"} optimized.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
