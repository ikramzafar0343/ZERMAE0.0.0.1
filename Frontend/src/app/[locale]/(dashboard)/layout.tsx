import type { ReactNode } from "react";

import { FloatingHeader } from "@/components/home/FloatingHeader";
import { SiteFooter } from "@/features/navigation/site-footer";
import { PublicSiteGate } from "@/features/site/public-site-gate";
import { readCart } from "@/lib/cart-cookie";
import { getSessionUser } from "@/lib/session";
import { getStorefront } from "@/lib/storefront";
import { readWishlist } from "@/lib/wishlist-cookie";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, cart, wishlist, storefront] = await Promise.all([
    getSessionUser(),
    readCart(),
    readWishlist(),
    getStorefront(),
  ]);
  return (
    <PublicSiteGate>
      <div className="flex min-h-screen flex-col">
        <FloatingHeader
          isAuthenticated={Boolean(user)}
          cartCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistCount={wishlist.ids.length}
          brand={storefront.content.brand}
          shopCategories={storefront.content.shopCategories}
          headerLinks={storefront.content.menus.header}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter content={storefront.content} />
      </div>
    </PublicSiteGate>
  );
}
