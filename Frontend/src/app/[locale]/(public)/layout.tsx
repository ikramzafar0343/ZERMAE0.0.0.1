import type { ReactNode } from "react";

import { FloatingHeader } from "@/components/home/FloatingHeader";
import { announcementIsVisible } from "@/constants/storefront";
import { AnnouncementBar } from "@/features/navigation/announcement-bar";
import { SalesPopup } from "@/features/navigation/sales-popup";
import { SiteFooter } from "@/features/navigation/site-footer";
import { PublicSiteGate } from "@/features/site/public-site-gate";
import { readCart } from "@/lib/cart-cookie";
import { getSessionUser } from "@/lib/session";
import { getStorefront } from "@/lib/storefront";
import { readWishlist } from "@/lib/wishlist-cookie";

/** Skip build-time prerender: Docker build has no `api` hostname on the compose network. */
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [user, cart, wishlist, storefront] = await Promise.all([
    getSessionUser(),
    readCart(),
    readWishlist(),
    getStorefront(),
  ]);

  const showAnnouncement = announcementIsVisible(storefront.content.announcement);
  const salesPopup = {
    ...storefront.content.salesPopup,
    demos: process.env.NODE_ENV === "development" ? storefront.content.salesPopup.demos : [],
  };

  return (
    <PublicSiteGate>
      <div className={showAnnouncement ? "flex min-h-screen flex-col has-announce" : "flex min-h-screen flex-col"}>
        <AnnouncementBar announcement={storefront.content.announcement} />
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
        <SalesPopup settings={salesPopup} />
      </div>
    </PublicSiteGate>
  );
}
