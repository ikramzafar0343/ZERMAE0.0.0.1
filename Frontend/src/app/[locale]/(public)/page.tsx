import "../../product-highlights.css";
import "../../glow-stats.css";
import "../../features.css";
import "../../home-faq.css";

import { Suspense } from "react";

import { visibleShopCategories } from "@/constants/storefront";
import { BestSellers } from "@/features/catalog/best-sellers";
import { BrandStory } from "@/features/catalog/brand-story";
import { Features } from "@/features/catalog/features";
import { GlowStats } from "@/features/catalog/glow-stats";
import { HeroHome } from "@/features/catalog/hero-home";
import { HomeFaq } from "@/features/catalog/home-faq";
import { ProductHighlights } from "@/features/catalog/product-highlights";
import { resolveBestSellers } from "@/features/catalog/resolve-best-sellers";
import { ShopByCategory } from "@/features/catalog/shop-by-category";
import { productService } from "@/lib/api/products";
import { getStorefront } from "@/lib/storefront";
import { readWishlist } from "@/lib/wishlist-cookie";

async function HomeBestSellers() {
  const [storefront, wishlist] = await Promise.all([getStorefront(), readWishlist()]);
  try {
    // Prefer products flagged "Best seller" in admin; fall back to CMS SKU slots.
    const flagged = await productService.list({ bestSeller: true, limit: 6 });
    let products = flagged.products;
    if (products.length === 0 && storefront.content.bestSellerSkus.length > 0) {
      products = await productService.getBySkus(storefront.content.bestSellerSkus);
    }
    const bestSellers = resolveBestSellers(products.slice(0, 3), wishlist.ids, storefront.content.bestSellerColors);
    return <BestSellers items={bestSellers} currency={storefront.commerce.currency} />;
  } catch {
    return <BestSellers items={[]} currency={storefront.commerce.currency} />;
  }
}

function BestSellersFallback() {
  return (
    <section className="best-sellers" aria-busy="true" aria-label="Loading bestsellers">
      <div className="best-sellers-inner">
        <h2 className="best-sellers-title">Our Best Sellers</h2>
        <div className="best-sellers-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="product-card" style={{ minHeight: "20rem", opacity: 0.35 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const storefront = await getStorefront();

  return (
    <div className="home-flow bg-brand-bg">
      <HeroHome content={storefront.content} />
      <ShopByCategory categories={visibleShopCategories(storefront.content)} />
      <Suspense fallback={<BestSellersFallback />}>
        <HomeBestSellers />
      </Suspense>
      <BrandStory content={storefront.content} />
      <ProductHighlights image={storefront.content.productHighlightsImage} />
      <GlowStats image={storefront.content.glowStatsImage} />
      <Features content={storefront.content} />
      <HomeFaq content={storefront.content} />
    </div>
  );
}
