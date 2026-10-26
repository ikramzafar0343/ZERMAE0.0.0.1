import { type MiniProduct, ProductMiniCard } from "@/components/shop/ProductMiniCard";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_LIFESTYLE } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export function LifestyleSection({
  products,
  currency,
  cms,
}: {
  products: MiniProduct[];
  currency: string;
  cms?: StorefrontHome["sections"]["lifestyle"];
}) {
  return (
    <section className="ha-lifestyle" aria-label="Lifestyle campaign">
      <div className="ha-lifestyle__media" data-parallax-shell>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cms?.posterSrc || MEDIA.lifestylePoster.src}
          alt=""
          className="ha-media-fill"
          style={{ objectPosition: MEDIA.lifestylePoster.objectPosition }}
          loading="lazy"
        />
      </div>
      <div className="ha-lifestyle__overlay" aria-hidden="true" />
      <div className="ha-lifestyle__content">
        <div data-section-intro>
          <p className="ha-eyebrow" style={{ color: "var(--light-text)", textTransform: "uppercase" }}>
            {cms?.eyebrow ?? HOME_LIFESTYLE.eyebrow}
            <span className="ha-eyebrow__mark" style={{ background: "var(--light-text)" }} aria-hidden="true" />
          </p>
          <h2 className="ha-lifestyle__heading">{cms?.heading ?? HOME_LIFESTYLE.heading}</h2>
        </div>
        {products.length ? (
          <div className="ha-lifestyle__tiles" data-reveal-row>
            {products.slice(0, 2).map((product) => (
              <div key={product.id} data-reveal-item>
                <ProductMiniCard product={product} currency={currency} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
