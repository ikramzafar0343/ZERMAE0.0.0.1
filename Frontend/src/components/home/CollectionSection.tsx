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

  return (
    <section className="ha-section ha-collection" id="ha-collection">
      <div className="ha-container">
        <SectionHeading
          className="ha-collection__heading"
          eyebrow={(() => {
            const raw = (cms?.eyebrow ?? HOME_COLLECTION.eyebrow).trim();
            return !raw || raw.toLowerCase() === "shop the collection" ? "" : raw;
          })()}
          lines={(() => {
            const line1 = (cms?.line1 ?? "").trim();
            const line2 = (cms?.line2 ?? "").trim();
            const useDefault =
              !line1 ||
              line1 === "Luxury formulated," ||
              line1 === "The Zermae" ||
              Boolean(line2);
            return useDefault ? HOME_COLLECTION.lines : ([line1] as const);
          })()}
        />
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
