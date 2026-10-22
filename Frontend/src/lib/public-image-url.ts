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
