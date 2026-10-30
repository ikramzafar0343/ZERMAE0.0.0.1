import { createReadStream } from "node:fs";
import { access, constants, stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

import { AppError } from "@/lib/app-error";
import { getEnv } from "@/lib/env";
import type { RouteDefinition } from "@/server/http/load-routes";
import type { RequestContext } from "@/server/http/respond";
import {
  getOrCreateDerivative,
  parseMediaWidth,
  preferAvif,
} from "@/server/services/upload/media-derivative";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

export const definition: RouteDefinition = {
  method: "GET",
  path: "/media/:name",
};

export async function handler(ctx: RequestContext): Promise<unknown> {
  const name = String(ctx.params.name ?? "");
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\") || name.startsWith(".")) {
    throw AppError.notFound("File not found");
  }
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME[ext];
  if (!mime) {
    throw AppError.notFound("File not found");
  }
  const directory = path.resolve(process.cwd(), getEnv().UPLOAD_DIR);
  const target = path.join(directory, name);
  if (!target.startsWith(directory)) {
    throw AppError.notFound("File not found");
  }
  try {
    await access(target, constants.R_OK);
  } catch {
    throw AppError.notFound("File not found");
  }
  const info = await stat(target);
  if (!info.isFile()) {
    throw AppError.notFound("File not found");
  }

  const width = parseMediaWidth(ctx.query.w);
  if (width) {
    const accept = String(ctx.req.headers.accept ?? "");
    try {
      const derivative = await getOrCreateDerivative({
        sourcePath: target,
        uploadDir: directory,
        width,
        preferAvif: preferAvif(accept),
      });
      ctx.res.writeHead(200, {
        "Content-Type": derivative.mimeType,
        "Content-Length": String(derivative.buffer.length),
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept",
      });
      await pipeline(Readable.from(derivative.buffer), ctx.res);
      return null;
    } catch {
      // Fall through to original file if sharp fails
    }
  }

  ctx.res.writeHead(200, {
    "Content-Type": mime,
    "Content-Length": String(info.size),
    "Cache-Control": "public, max-age=2592000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  await pipeline(createReadStream(target), ctx.res);
  return null;
}
