import { createHash } from "node:crypto";
import { access, constants, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export const MEDIA_WIDTHS = [640, 750, 1080, 1920] as const;
export type MediaWidth = (typeof MEDIA_WIDTHS)[number];

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
  const hash = createHash("sha1").update(source).update(`w${input.width}`).digest("hex").slice(0, 16);
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
  const pipeline = sharp(source, { failOn: "none", limitInputPixels: MAX_PIXELS })
    .rotate()
    .resize({
      width: input.width,
      height: input.width,
      fit: "inside",
      withoutEnlargement: true,
    });

  const buffer = input.preferAvif
    ? await pipeline.avif({ quality: 70, effort: 4 }).toBuffer()
    : await pipeline.webp({ quality: 78, effort: 4 }).toBuffer();

  await writeFile(cachePath, buffer);
  return { buffer, mimeType, cachePath };
}
