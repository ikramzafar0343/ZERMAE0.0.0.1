import { unstable_cache } from "next/cache";
import { cache } from "react";

import { resolveCommerceSettings } from "@/constants/commerce";
import {
  DEFAULT_STOREFRONT_CONTENT,
  DEFAULT_STOREFRONT_THEME,
  resolveStorefrontContent,
  resolveStorefrontTheme,
} from "@/constants/storefront";
import { apiRequestPublic } from "@/lib/api/client";
import type { StorefrontState } from "@/lib/api/storefront";

function defaultStorefront() {
  return {
    commerce: resolveCommerceSettings(),
    theme: DEFAULT_STOREFRONT_THEME,
    content: DEFAULT_STOREFRONT_CONTENT,
  };
}

const loadStorefrontCached = unstable_cache(
  async () => {
    const raw = await apiRequestPublic<StorefrontState>("GET", "/storefront");
    return {
      commerce: resolveCommerceSettings(raw.commerce),
      theme: resolveStorefrontTheme(raw.theme),
      content: resolveStorefrontContent(raw.content),
    };
  },
  ["storefront-full"],
  { revalidate: 60, tags: ["storefront"] },
);

/** Live CMS when API is up; defaults during Docker build (no `api` host) or brief outages. */
export const getStorefront = cache(async () => {
  try {
    return await loadStorefrontCached();
  } catch {
    return defaultStorefront();
  }
});
