import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolvePublicImageUrl, withMediaWidth } from "./public-image-url";

describe("resolvePublicImageUrl", () => {
  it("rewrites remapped static PNG/JPG to WebP", () => {
    assert.equal(
      resolvePublicImageUrl("/media/editorial/skin-detail.png"),
      "/media/editorial/skin-detail.webp",
    );
    assert.equal(
      resolvePublicImageUrl("/media/journal/article-01.jpg"),
      "/media/journal/article-01.webp",
    );
    assert.equal(
      resolvePublicImageUrl("/media/stories/avatar-01.png"),
      "/media/stories/avatar-01.webp",
    );
  });

  it("leaves brand and social originals alone", () => {
    assert.equal(resolvePublicImageUrl("/media/brand/wordmark.png"), "/media/brand/wordmark.png");
    assert.equal(
      resolvePublicImageUrl("/media/social/portrait-01.jpg"),
      "/media/social/portrait-01.jpg",
    );
    assert.equal(
      resolvePublicImageUrl("/media/editorial/panel-thumb.jpg"),
      "/media/editorial/panel-thumb.jpg",
    );
  });

  it("maps uploads to the media API", () => {
    assert.equal(resolvePublicImageUrl("/uploads/hero.jpg"), "/api/v1/media/hero.jpg");
  });
});

describe("withMediaWidth", () => {
  it("appends width only for API media URLs", () => {
    assert.equal(withMediaWidth("/api/v1/media/hero.jpg", 1080), "/api/v1/media/hero.jpg?w=1080");
    assert.equal(withMediaWidth("/media/editorial/skin-detail.webp", 1080), "/media/editorial/skin-detail.webp");
  });
});

describe("pickMediaWidth", () => {
  it("maps display CSS px to allowlisted widths", async () => {
    const { pickMediaWidth } = await import("./public-image-url");
    assert.equal(pickMediaWidth(72), 640);
    assert.equal(pickMediaWidth(375), 750);
    assert.equal(pickMediaWidth(540), 1080);
    assert.equal(pickMediaWidth(1200), 1920);
  });
});
