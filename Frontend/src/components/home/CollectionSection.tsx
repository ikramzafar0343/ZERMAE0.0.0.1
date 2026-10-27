import { ProductTile, type QuietProduct } from "@/components/shop/ProductTile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_COLLECTION } from "@/lib/content/homepage";

export function CollectionSection({
  products,
  currency,
  wishlistIds = [],
  cms,
}: {
  products: QuietProduct[];
  currency: string;
  wishlistIds?: string[];
  cms?: StorefrontHome["sections"]["collection"];
}) {
  const display = products.slice(0, 6);
  const line1 = (cms?.line1 ?? "").trim();
  const line2 = (cms?.line2 ?? "").trim();
  const legacyApproach =
    line1 === "The Zermae Approach." ||
    line1 === "The Zermae" ||
    line1 === "Luxury formulated,";
  const lines =
    !line1 || legacyApproach
      ? HOME_COLLECTION.lines
      : line2
        ? ([line1, line2] as const)
        : ([line1] as const);

  return (
    <section className="ha-section ha-collection" id="ha-collection">
      <div className="ha-container">
        <SectionHeading className="ha-collection__heading" lines={lines} />
        <div className="ha-collection__gap" aria-hidden="true" />
        <div
          className="ha-product-grid ha-collection__grid ha-snap-track"
          data-reveal-row
          aria-label="Shop the collection"
        >
          {display.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              currency={currency}
              showQuickAdd={false}
              showPrice={false}
              showWishlist
              viewAllHref={product.href ?? "/collections/all"}
              viewAllLabel="View all"
              wished={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
