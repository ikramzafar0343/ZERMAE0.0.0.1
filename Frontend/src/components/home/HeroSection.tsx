import { PageHero } from "@/components/shop/PageHero";
import { type MiniProduct } from "@/components/shop/ProductMiniCard";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_HERO } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

type HeroSectionProps = {
  featured: MiniProduct | null;
  featuredProducts?: MiniProduct[];
  currency: string;
  cms?: StorefrontHome["sections"]["hero"];
};

export function HeroSection({ featured, featuredProducts, currency, cms }: HeroSectionProps) {
  const line1 = cms?.line1 ?? HOME_HERO.line1;
  const line2 = cms?.line2 ?? HOME_HERO.line2;
  return (
    <PageHero
      title={`${line1} ${line2}`}
      ctaLabel={cms?.ctaLabel ?? HOME_HERO.ctaLabel}
      ctaHref={cms?.ctaHref ?? HOME_HERO.ctaHref}
      featured={featured}
      {...(featuredProducts ? { featuredProducts } : {})}
      currency={currency}
      mediaSrc={cms?.posterSrc || MEDIA.heroPoster.src}
    />
  );
}
