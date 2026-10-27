import Link from "next/link";

import { type MiniProduct } from "@/components/shop/ProductMiniCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_JOURNAL } from "@/lib/content/homepage";

export function JournalSection({
  products = [],
  cms,
}: {
  products?: MiniProduct[];
  currency?: string;
  cms?: StorefrontHome["sections"]["journal"];
}) {
  const previews = products.slice(0, 3);
  const rawCta = cms?.ctaHref?.trim() || "";
  const ctaHref =
    !rawCta || rawCta === "#ha-journal" || rawCta === "/#ha-journal" || rawCta.endsWith("#ha-journal")
      ? HOME_JOURNAL.ctaHref
      : rawCta;

  return (
    <section className="ha-journal" id="ha-journal">
      <div className="ha-container" style={{ textAlign: "center" }}>
        <SectionHeading
          eyebrow={cms?.eyebrow ?? HOME_JOURNAL.eyebrow}
          lines={[cms?.line1 ?? HOME_JOURNAL.lines[0], cms?.line2 ?? HOME_JOURNAL.lines[1]]}
        />
        <Link href={ctaHref} className="ha-btn ha-journal__cta">
          {cms?.ctaLabel ?? HOME_JOURNAL.ctaLabel}
        </Link>
        {previews.length > 0 ? (
          <div className="ha-journal__grid ha-snap-track" data-reveal-row aria-label="Featured products">
            {previews.map((product) => (
              <Link
                key={product.id}
                href={product.href ?? `/product/${product.id}`}
                className="ha-journal__card"
                data-reveal-item
                aria-label={product.title}
              >
                <div className="ha-journal__media ha-media-clip">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.title} className="ha-media-fill" loading="lazy" />
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
