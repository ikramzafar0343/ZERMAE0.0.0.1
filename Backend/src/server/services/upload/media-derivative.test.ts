import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import sharp from "sharp";

import {
  getOrCreateDerivative,
  parseMediaWidth,
  preferAvif,
} from "./media-derivative";

describe("media-derivative", () => {
  it("parses allowlisted widths only", () => {
    assert.equal(parseMediaWidth("1080"), 1080);
    assert.equal(parseMediaWidth("1920"), 1920);
    assert.equal(parseMediaWidth("999"), null);
    assert.equal(parseMediaWidth(undefined), null);
  });

  it("detects AVIF preference from Accept", () => {
    assert.equal(preferAvif("image/avif,image/webp,*/*"), true);
    assert.equal(preferAvif("image/webp,*/*"), false);
  });

  it("creates and reuses a width-capped WebP cache file", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "zermae-deriv-"));
    try {
      const sourcePath = path.join(dir, "hero.jpg");
      const jpeg = await sharp({
        create: { width: 2400, height: 1600, channels: 3, background: { r: 40, g: 80, b: 60 } },
      })
        .jpeg({ quality: 90 })
        .toBuffer();
      await writeFile(sourcePath, jpeg);

      const first = await getOrCreateDerivative({
        sourcePath,
        uploadDir: dir,
        width: 1080,
        preferAvif: false,
      });
      assert.equal(first.mimeType, "image/webp");
      assert.ok(first.buffer.length > 0);
      assert.ok(first.cachePath.includes(`${path.sep}.cache${path.sep}`));

      const meta = await sharp(first.buffer).metadata();
      assert.ok((meta.width ?? 0) <= 1080);
      assert.ok((meta.height ?? 0) <= 1080);

      const second = await getOrCreateDerivative({
        sourcePath,
        uploadDir: dir,
        width: 1080,
        preferAvif: false,
      });
      assert.equal(second.cachePath, first.cachePath);
      assert.deepEqual(second.buffer, first.buffer);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
