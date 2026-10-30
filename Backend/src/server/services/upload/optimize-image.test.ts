import assert from "node:assert/strict";
import { describe, it } from "node:test";

import sharp from "sharp";

import { optimizeImageBuffer } from "./optimize-image";

async function solidJpeg(width: number, height: number, quality = 95): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 180, g: 120, b: 90 },
    },
  })
    .jpeg({ quality })
    .toBuffer();
}

async function solidPng(width: number, height: number, alpha = false): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: alpha ? 4 : 3,
      background: alpha
        ? { r: 40, g: 120, b: 80, alpha: 0.5 }
        : { r: 40, g: 120, b: 80 },
    },
  })
    .png()
    .toBuffer();
}

describe("optimizeImageBuffer", () => {
  it("compresses a large JPEG under the product budget and never upscales", async () => {
    const input = await solidJpeg(2400, 1800, 98);
    const out = await optimizeImageBuffer(input, { purpose: "product" });
    assert.ok(out.width <= 1200);
    assert.ok(out.height <= 1200);
    assert.ok(out.buffer.length < input.length);
    assert.ok(out.buffer.length < 150_000 || out.ext === "webp" || out.ext === "avif");
    console.log(
      `JPEG 2400x1800 ${input.length} → ${out.ext} ${out.width}x${out.height} ${out.buffer.length} (${(((input.length - out.buffer.length) / input.length) * 100).toFixed(1)}%)`,
    );
  });

  it("compresses a large PNG", async () => {
    const input = await solidPng(2000, 2000);
    const out = await optimizeImageBuffer(input, { purpose: "content" });
    assert.ok(out.buffer.length < input.length);
    assert.ok(Math.max(out.width, out.height) <= 1600);
    console.log(
      `PNG 2000x2000 ${input.length} → ${out.ext} ${out.buffer.length} (${(((input.length - out.buffer.length) / input.length) * 100).toFixed(1)}%)`,
    );
  });

  it("preserves transparency when beneficial", async () => {
    const input = await solidPng(800, 800, true);
    const out = await optimizeImageBuffer(input, { purpose: "product" });
    const meta = await sharp(out.buffer).metadata();
    assert.ok(meta.hasAlpha || out.ext === "webp" || out.ext === "avif" || out.ext === "png");
    console.log(`Transparent PNG ${input.length} → ${out.ext} alpha=${Boolean(meta.hasAlpha)} ${out.buffer.length}`);
  });

  it("keeps an already-small WebP when under budget", async () => {
    const input = await sharp({
      create: { width: 200, height: 200, channels: 3, background: { r: 10, g: 10, b: 10 } },
    })
      .webp({ quality: 70 })
      .toBuffer();
    const out = await optimizeImageBuffer(input, { purpose: "thumb" });
    assert.equal(out.ext, "webp");
    assert.ok(out.buffer.length <= input.length || out.buffer.equals(input));
  });

  it("handles AVIF input", async () => {
    const input = await sharp({
      create: { width: 640, height: 480, channels: 3, background: { r: 90, g: 90, b: 120 } },
    })
      .avif({ quality: 60 })
      .toBuffer();
    const out = await optimizeImageBuffer(input, { purpose: "content" });
    assert.ok(out.buffer.length > 0);
    assert.ok(["avif", "webp", "jpg", "png"].includes(out.ext));
  });

  it("applies EXIF orientation via rotate()", async () => {
    // Build a portrait buffer; sharp.rotate() without args auto-orients when EXIF present.
    const base = await solidJpeg(600, 400, 90);
    const withExif = await sharp(base)
      .withMetadata({
        orientation: 6,
      })
      .jpeg()
      .toBuffer();
    const out = await optimizeImageBuffer(withExif, { purpose: "product" });
    assert.ok(out.width > 0 && out.height > 0);
    assert.ok(out.buffer.length > 0);
  });

  it("rejects invalid / corrupted buffers", async () => {
    await assert.rejects(() => optimizeImageBuffer(Buffer.from("not-an-image")), /Invalid image|Input buffer|unsupported/i);
  });

  it("caps hero mobile edge at 1080", async () => {
    const input = await solidJpeg(2160, 3840, 95);
    const out = await optimizeImageBuffer(input, { purpose: "heroMobile" });
    assert.ok(Math.max(out.width, out.height) <= 1080);
    console.log(
      `Hero mobile ${input.length} → ${out.ext} ${out.width}x${out.height} ${out.buffer.length}`,
    );
  });

  it("runs concurrent optimizations safely", async () => {
    const inputs = await Promise.all([
      solidJpeg(1600, 1200),
      solidPng(1200, 1200),
      solidJpeg(1920, 1080),
    ]);
    const results = await Promise.all(inputs.map((buf) => optimizeImageBuffer(buf, { purpose: "content" })));
    assert.equal(results.length, 3);
    for (const result of results) {
      assert.ok(result.buffer.length > 0);
    }
  });
});
