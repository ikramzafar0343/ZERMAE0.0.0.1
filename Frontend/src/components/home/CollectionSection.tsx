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
          eyebrow={cms?.eyebrow ?? HOME_COLLECTION.eyebrow}
          lines={[cms?.line1 ?? HOME_COLLECTION.lines[0], cms?.line2 ?? HOME_COLLECTION.lines[1]]}
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
              showQuickAdd
              showWishlist
              wished={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
