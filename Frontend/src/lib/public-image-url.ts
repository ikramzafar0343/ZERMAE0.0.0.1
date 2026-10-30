/**
 * Static `/media/*` assets remapped to WebP in git (PNG/JPG deleted).
 * Production CMS may still store the old extensions → `/_next/image` 400.
 */
const WEBP_CANONICAL_MEDIA = new Set([
  "/media/editorial/product-range",
  "/media/editorial/serum-portrait",
  "/media/editorial/skin-detail",
  "/media/hero/portrait-poster",
  "/media/journal/article-01",
  "/media/journal/article-02",
  "/media/journal/article-03",
  "/media/lifestyle/skincare-poster",
  "/media/newsletter/skincare-wide",
  "/media/products/collection-01",
  "/media/products/collection-02",
  "/media/products/collection-03",
  "/media/products/collection-04",
  "/media/products/collection-05",
  "/media/products/collection-06",
  "/media/products/ritual-01",
  "/media/products/ritual-02",
  "/media/products/ritual-03",
  "/media/stories/avatar-01",
  "/media/stories/avatar-02",
  "/media/stories/avatar-03",
  "/media/stories/avatar-04",
  "/media/stories/avatar-05",
  "/media/stories/avatar-06",
  "/media/stories/product-composition",
]);

function rewriteLegacyStaticMedia(src: string): string {
  if (!src.startsWith("/media/") || src.startsWith("/media/originals/")) {
    return src;
  }
  const qIndex = src.indexOf("?");
  const pathOnly = qIndex >= 0 ? src.slice(0, qIndex) : src;
  const query = qIndex >= 0 ? src.slice(qIndex) : "";
  const match = pathOnly.match(/^(.*)\.(png|jpe?g)$/i);
  if (!match?.[1]) return src;
  const base = match[1];
  if (!WEBP_CANONICAL_MEDIA.has(base)) return src;
  return `${base}.webp${query}`;
}

/** Map stored upload paths to the public API media route (works through /api proxy). */
export function resolvePublicImageUrl(src: string): string {
  const value = src.trim();
  if (!value) {
    return value;
  }
  if (value.startsWith("/uploads/")) {
    return `/api/v1/media/${value.slice("/uploads/".length)}`;
  }
  return rewriteLegacyStaticMedia(value);
}

const MEDIA_API_PREFIX = "/api/v1/media/";

/**
 * Append on-demand resize for CMS uploads (`?w=`). Static `/media/...` public assets are unchanged.
 */
export function withMediaWidth(src: string, width: 640 | 750 | 1080 | 1920): string {
  const value = src.trim();
  if (!value) return value;
  if (!value.startsWith(MEDIA_API_PREFIX) && !value.includes("/api/v1/media/")) {
    return value;
  }
  try {
    const url = new URL(value, "https://zermae.local");
    url.searchParams.set("w", String(width));
    return `${url.pathname}?${url.searchParams.toString()}`;
  } catch {
    const base = value.split("?")[0] ?? value;
    return `${base}?w=${width}`;
  }
}
