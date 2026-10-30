import sharp from "sharp";

export type ImagePurpose = "hero" | "heroMobile" | "product" | "thumb" | "content" | "auto";

const MAX_EDGE: Record<Exclude<ImagePurpose, "auto">, number> = {
  hero: 1920,
  heroMobile: 1080,
  product: 1200,
  thumb: 320,
  content: 1600,
};

/** Soft targets only — never force quality below PURPOSE_MIN_QUALITY just to hit these. */
const SOFT_BUDGET_BYTES: Record<Exclude<ImagePurpose, "auto">, number> = {
  hero: 550_000,
  heroMobile: 450_000,
  product: 280_000,
  thumb: 100_000,
  content: 380_000,
};

const PURPOSE_MIN_QUALITY: Record<Exclude<ImagePurpose, "auto">, number> = {
  hero: 82,
  heroMobile: 82,
  product: 78,
  thumb: 72,
  content: 80,
};

const PURPOSE_MAX_QUALITY: Record<Exclude<ImagePurpose, "auto">, number> = {
  hero: 90,
  heroMobile: 90,
  product: 88,
  thumb: 84,
  content: 88,
};

const MAX_PIXELS = 40_000_000;

export type OptimizedImage = {
  buffer: Buffer;
  ext: "webp" | "avif" | "jpg" | "png";
  mimeType: string;
  width: number;
  height: number;
};

function purposeFromHint(hint?: string): Exclude<ImagePurpose, "auto"> {
  const value = (hint ?? "auto").trim();
  if (value === "hero" || value === "heroMobile" || value === "product" || value === "thumb" || value === "content") {
    return value;
  }
  return "content";
}

async function encodeWebp(pipeline: sharp.Sharp, quality: number): Promise<Buffer> {
  return pipeline.clone().webp({ quality, effort: 4 }).toBuffer();
}

async function encodeAvif(pipeline: sharp.Sharp, quality: number): Promise<Buffer> {
  return pipeline.clone().avif({ quality, effort: 4 }).toBuffer();
}

async function searchQuality(
  encode: (quality: number) => Promise<Buffer>,
  budget: number,
  minQuality: number,
  maxQuality: number,
): Promise<Buffer> {
  let lo = minQuality;
  let hi = maxQuality;
  let best = await encode(hi);
  if (best.length <= budget) return best;
  for (let step = 0; step < 6; step += 1) {
    const mid = Math.round((lo + hi) / 2);
    const candidate = await encode(mid);
    if (candidate.length <= budget) {
      best = candidate;
      lo = mid + 1;
    } else {
      hi = mid - 1;
      if (candidate.length < best.length) best = candidate;
    }
    if (lo > hi) break;
  }
  // Prefer the min-quality encode over a softer mid if the search undershot
  if (lo <= minQuality) {
    const floorBuf = await encode(minQuality);
    if (floorBuf.length <= best.length * 1.15) return floorBuf;
  }
  return best;
}

/**
 * Resize + compress with a bounded quality search.
 * Prefers reducing excess pixels before crushing quality. Never upscales.
 * Picks WebP or AVIF (smaller wins); keeps PNG when transparency favors it.
 */
export async function optimizeImageBuffer(
  input: Buffer,
  options?: { purpose?: string },
): Promise<OptimizedImage> {
  const purpose = purposeFromHint(options?.purpose);
  const maxEdge = MAX_EDGE[purpose];
  const budget = SOFT_BUDGET_BYTES[purpose];

  const image = sharp(input, { failOn: "none", limitInputPixels: MAX_PIXELS });
  const meta = await image.metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Invalid image: missing dimensions");
  }

  const hasAlpha = Boolean(meta.hasAlpha);
  let pipeline = image.rotate().withMetadata({ exif: undefined, icc: undefined });

  const longest = Math.max(meta.width, meta.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const width = Math.max(1, Math.round(meta.width * scale));
  const height = Math.max(1, Math.round(meta.height * scale));
  if (scale < 1) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (
    (meta.format === "webp" || meta.format === "avif") &&
    input.length <= budget &&
    longest <= maxEdge
  ) {
    return {
      buffer: input,
      ext: meta.format === "avif" ? "avif" : "webp",
      mimeType: meta.format === "avif" ? "image/avif" : "image/webp",
      width,
      height,
    };
  }

  const minQ = PURPOSE_MIN_QUALITY[purpose];
  const maxQ = PURPOSE_MAX_QUALITY[purpose];
  const webp = await searchQuality((q) => encodeWebp(pipeline, q), budget, minQ, maxQ);
  let bestBuffer = webp;
  let bestExt: OptimizedImage["ext"] = "webp";
  let bestMime = "image/webp";

  try {
    const avif = await searchQuality((q) => encodeAvif(pipeline, q), budget, minQ, maxQ);
    if (avif.length + 1024 < bestBuffer.length) {
      bestBuffer = avif;
      bestExt = "avif";
      bestMime = "image/avif";
    }
  } catch {
    // AVIF optional if runtime encoder fails
  }

  if (hasAlpha) {
    const png = await pipeline.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
    if (png.length < bestBuffer.length * 0.9) {
      const usePng = png.length <= bestBuffer.length;
      return {
        buffer: usePng ? (png.length < input.length ? png : bestBuffer.length < input.length ? bestBuffer : png) : bestBuffer,
        ext: usePng ? "png" : bestExt,
        mimeType: usePng ? "image/png" : bestMime,
        width,
        height,
      };
    }
  }

  if (bestBuffer.length >= input.length && longest <= maxEdge && !hasAlpha) {
    if (meta.format === "jpeg" || meta.format === "jpg") {
      return { buffer: input, ext: "jpg", mimeType: "image/jpeg", width: meta.width, height: meta.height };
    }
    if (meta.format === "png") {
      return { buffer: input, ext: "png", mimeType: "image/png", width: meta.width, height: meta.height };
    }
    if (meta.format === "webp") {
      return { buffer: input, ext: "webp", mimeType: "image/webp", width: meta.width, height: meta.height };
    }
    if (meta.format === "avif") {
      return { buffer: input, ext: "avif", mimeType: "image/avif", width: meta.width, height: meta.height };
    }
  }

  return {
    buffer: bestBuffer.length <= input.length ? bestBuffer : bestBuffer,
    ext: bestExt,
    mimeType: bestMime,
    width,
    height,
  };
}
