import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { AppError } from "@/lib/app-error";
import { getEnv } from "@/lib/env";
import { optimizeImageBuffer } from "@/server/services/upload/optimize-image";

const ALLOWED = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_PIXELS_HINT = 40_000_000;

function sniffImageMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  // ftyp....avif
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return "image/avif";
    }
  }
  return null;
}

export class UploadService {
  async saveImage(input: {
    mimeType: string;
    data: string;
    purpose?: string;
  }): Promise<{ url: string }> {
    const env = getEnv();
    if (!ALLOWED.has(input.mimeType)) {
      throw AppError.validation([{ field: "mimeType", message: "Unsupported image type" }]);
    }
    let buffer: Buffer;
    try {
      buffer = Buffer.from(input.data, "base64");
    } catch {
      throw AppError.validation([{ field: "data", message: "Invalid image payload" }]);
    }
    if (buffer.length < 1) {
      throw AppError.validation([{ field: "data", message: "Empty image" }]);
    }
    if (buffer.length > env.UPLOAD_MAX_FILE_SIZE) {
      throw AppError.payloadTooLarge();
    }

    const sniffed = sniffImageMime(buffer);
    if (!sniffed || !ALLOWED.has(sniffed)) {
      throw AppError.validation([{ field: "data", message: "File content is not a supported image" }]);
    }

    let optimized;
    try {
      optimized = await optimizeImageBuffer(
        buffer,
        input.purpose ? { purpose: input.purpose } : undefined,
      );
    } catch {
      throw AppError.validation([{ field: "data", message: "Unable to process image" }]);
    }

    if (optimized.width * optimized.height > MAX_PIXELS_HINT) {
      throw AppError.validation([{ field: "data", message: "Image resolution too large" }]);
    }

    const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${optimized.ext}`;
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      throw AppError.validation([{ field: "data", message: "Invalid filename" }]);
    }
    const directory = path.resolve(process.cwd(), env.UPLOAD_DIR);
    await mkdir(directory, { recursive: true });
    const target = path.join(directory, name);
    if (!target.startsWith(directory)) {
      throw AppError.validation([{ field: "data", message: "Invalid upload path" }]);
    }
    await writeFile(target, optimized.buffer);
    const prefix = env.API_PREFIX.replace(/\/$/, "");
    return { url: `${prefix}/media/${name}` };
  }
}

export const uploadService = new UploadService();
