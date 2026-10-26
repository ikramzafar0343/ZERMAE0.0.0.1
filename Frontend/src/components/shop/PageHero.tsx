import Link from "next/link";

import { type MiniProduct, ProductMiniCard } from "@/components/shop/ProductMiniCard";
import { HOME_HERO } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export type PageHeroProps = {
  /** Accessible page title (visually hidden like home). */
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
  featured?: MiniProduct | null;
  currency?: string;
  mediaSrc?: string;
  mediaPosition?: string;
};

export function PageHero({
  title,
  ctaLabel = HOME_HERO.ctaLabel,
  ctaHref = HOME_HERO.ctaHref,
  featured = null,
  currency = "PKR",
  mediaSrc = MEDIA.heroPoster.src,
  mediaPosition = MEDIA.heroPoster.objectPosition,
}: PageHeroProps) {
  return (
    <section className="ha-hero" aria-label="Hero">
      <div className="ha-hero__media" data-parallax-shell>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaSrc}
          alt=""
          className="ha-media-fill"
          style={{ objectPosition: mediaPosition }}
          fetchPriority="high"
        />
      </div>
      <div className="ha-hero__shade" aria-hidden="true" />

      <h1 className="sr-only">{title}</h1>

      <div className="ha-hero__copy" data-hero-copy>
        <Link href={ctaHref} className="ha-btn ha-hero__cta" data-hero-cta>
          {ctaLabel}
        </Link>
      </div>

      {featured ? (
        <div className="ha-hero__tile" data-hero-tile>
          <ProductMiniCard product={featured} currency={currency} />
        </div>
      ) : null}
    </section>
  );
}
