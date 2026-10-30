import Link from "next/link";

import { DeferredHeroTile } from "@/components/shop/DeferredHeroTile";
import { HeroBannerSlider } from "@/components/shop/HeroBannerSlider";
import { HeroProductSlider } from "@/components/shop/HeroProductSlider";
import { type MiniProduct } from "@/components/shop/ProductMiniCard";
import type { HeroBannerSlide } from "@/constants/storefront";
import { HOME_HERO } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";
import { resolvePublicImageUrl, withMediaWidth } from "@/lib/public-image-url";

function heroPreloadUrls(banners: HeroBannerSlide[]) {
  const first = banners[0];
  if (!first) return null;
  const desktopRaw = first.desktop.trim() || first.mobile.trim();
  const mobileRaw = first.mobile.trim() || first.desktop.trim();
  if (!desktopRaw && !mobileRaw) return null;
  const mobileBase = resolvePublicImageUrl(mobileRaw || desktopRaw);
  return {
    mobile750: withMediaWidth(mobileBase, 750),
    mobile1080: withMediaWidth(mobileBase, 1080),
    desktop: withMediaWidth(resolvePublicImageUrl(desktopRaw || mobileRaw), 1920),
  };
}

export type PageHeroProps = {
  /** Accessible page title (visually hidden like home). */
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Prefer this for rotating inventory in the hero tile. */
  featuredProducts?: MiniProduct[];
  /** Single product fallback when a list is not provided. */
  featured?: MiniProduct | null;
  currency?: string;
  mediaSrc?: string;
  mediaSrcs?: string[];
  banners?: HeroBannerSlide[];
};

export function PageHero({
  title,
  ctaLabel = HOME_HERO.ctaLabel,
  ctaHref = HOME_HERO.ctaHref,
  featuredProducts,
  featured = null,
  currency = "PKR",
  mediaSrc = MEDIA.heroPoster.src,
  mediaSrcs,
  banners,
}: PageHeroProps) {
  const slides =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts
      : featured
        ? [featured]
        : [];
  const fromLegacy = (mediaSrcs?.length ? mediaSrcs : [mediaSrc])
    .map((src) => src.trim())
    .filter(Boolean)
    .map((desktop) => ({ desktop, mobile: "" }));
  const resolvedBanners =
    banners && banners.length > 0
      ? banners
      : fromLegacy.length > 0
        ? fromLegacy
        : [{ desktop: MEDIA.heroPoster.src, mobile: "" }];
  const preload = heroPreloadUrls(resolvedBanners);

  return (
    <section className="ha-hero" aria-label="Hero">
      {preload ? (
        <>
          <link
            rel="preload"
            as="image"
            media="(max-width: 1023px)"
            {...{
              imageSrcSet: `${preload.mobile750} 750w, ${preload.mobile1080} 1080w`,
              imageSizes: "100vw",
              fetchPriority: "high" as const,
            }}
          />
          <link rel="preload" as="image" href={preload.desktop} media="(min-width: 1024px)" />
        </>
      ) : null}
      <HeroBannerSlider banners={resolvedBanners} />

      <h1 className="sr-only">{title}</h1>

      <div className="ha-hero__copy" data-hero-copy>
        <Link href={ctaHref} className="ha-btn ha-hero__cta" data-hero-cta>
          {ctaLabel}
        </Link>
      </div>

      {slides.length > 0 ? (
        <DeferredHeroTile>
          <div className="ha-hero__tile" data-hero-tile>
            <HeroProductSlider products={slides} currency={currency} />
          </div>
        </DeferredHeroTile>
      ) : null}
    </section>
  );
}
