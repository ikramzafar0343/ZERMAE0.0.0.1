/** Map stored upload paths to the public API media route (works through /api proxy). */
export function resolvePublicImageUrl(src: string): string {
  const value = src.trim();
  if (!value) {
    return value;
  }
  if (value.startsWith("/uploads/")) {
    return `/api/v1/media/${value.slice("/uploads/".length)}`;
  }
  return value;
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
