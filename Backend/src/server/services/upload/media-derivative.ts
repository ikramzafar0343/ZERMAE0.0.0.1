import { createHash } from "node:crypto";
import { access, constants, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export const MEDIA_WIDTHS = [640, 750, 1080, 1920] as const;
export type MediaWidth = (typeof MEDIA_WIDTHS)[number];

/** Bump when encode settings change so on-disk .cache entries are not reused soft. */
const DERIVATIVE_CACHE_VERSION = "q4";

const MAX_PIXELS = 40_000_000;

export function parseMediaWidth(raw: string | undefined): MediaWidth | null {
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const match = MEDIA_WIDTHS.find((width) => width === value);
  return match ?? null;
}

export function preferAvif(accept: string | undefined): boolean {
  return Boolean(accept?.includes("image/avif"));
}

/** Hero/LCP widths need sharper text; thumbs stay lighter. */
export function derivativeQuality(width: MediaWidth): { webp: number; avif: number } {
  if (width >= 1080) {
    return { webp: 86, avif: 78 };
  }
  // 750 is used for small-phone hero srcSet — keep it sharper than tiles
  if (width >= 750) {
    return { webp: 84, avif: 76 };
  }
  return { webp: 78, avif: 70 };
}

/**
 * Resize+encode a derivative; cache under UPLOAD_DIR/.cache/
 */
export async function getOrCreateDerivative(input: {
  sourcePath: string;
  uploadDir: string;
  width: MediaWidth;
  preferAvif: boolean;
}): Promise<{ buffer: Buffer; mimeType: string; cachePath: string }> {
  const source = await readFile(input.sourcePath);
  const quality = derivativeQuality(input.width);
  const hash = createHash("sha1")
    .update(source)
    .update(`w${input.width}`)
    .update(DERIVATIVE_CACHE_VERSION)
    .update(`webp${quality.webp}`)
    .update(`avif${quality.avif}`)
    .digest("hex")
    .slice(0, 16);
  const ext = input.preferAvif ? "avif" : "webp";
  const mimeType = input.preferAvif ? "image/avif" : "image/webp";
  const cacheDir = path.join(input.uploadDir, ".cache");
  const cacheName = `${hash}-w${input.width}.${ext}`;
  const cachePath = path.join(cacheDir, cacheName);

  try {
    await access(cachePath, constants.R_OK);
    const buffer = await readFile(cachePath);
    return { buffer, mimeType, cachePath };
  } catch {
    // miss — build
  }

  await mkdir(cacheDir, { recursive: true });
  const image = sharp(source, { failOn: "none", limitInputPixels: MAX_PIXELS }).rotate();
  const meta = await image.metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const alreadyFits = longest > 0 && longest <= input.width;
  const alreadyWebp = meta.format === "webp";
  const alreadyAvif = meta.format === "avif";

  // Avoid a second lossy encode when upload already produced a fitting WebP/AVIF master.
  if (alreadyFits && !input.preferAvif && alreadyWebp) {
    await writeFile(cachePath, source);
    return { buffer: source, mimeType: "image/webp", cachePath };
  }
  if (alreadyFits && input.preferAvif && alreadyAvif) {
    await writeFile(cachePath, source);
    return { buffer: source, mimeType: "image/avif", cachePath };
  }

  const pipeline = image.resize({
    width: input.width,
    height: input.width,
    fit: "inside",
    withoutEnlargement: true,
  });

  const buffer = input.preferAvif
    ? await pipeline.avif({ quality: quality.avif, effort: 4 }).toBuffer()
    : await pipeline.webp({ quality: quality.webp, effort: 4 }).toBuffer();

  await writeFile(cachePath, buffer);
  return { buffer, mimeType, cachePath };
}
