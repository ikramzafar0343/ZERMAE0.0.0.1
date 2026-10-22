import { unstable_cache } from "next/cache";
import { cache } from "react";

import { resolveCommerceSettings } from "@/constants/commerce";
import { resolveStorefrontContent, resolveStorefrontTheme } from "@/constants/storefront";
import { apiRequestPublic } from "@/lib/api/client";
import type { StorefrontState } from "@/lib/api/storefront";

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

export const getStorefront = cache(async () => loadStorefrontCached());
