"use client";

import { useCallback, useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@/components/icons/icons";
import type { HeroBannerSlide } from "@/constants/storefront";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { cn } from "@/lib/cn";
import { resolvePublicImageUrl, withMediaWidth } from "@/lib/public-image-url";

function heroSrc(src: string, width: 1080 | 1920): string {
  return withMediaWidth(resolvePublicImageUrl(src), width);
}

export function HeroBannerSlider({
  banners,
}: {
  banners: HeroBannerSlide[];
}) {
  const unique = banners
    .map((slide) => {
      const desktopRaw = slide.desktop.trim();
      const mobileRaw = slide.mobile.trim();
      const desktop = desktopRaw || mobileRaw;
      const mobile = mobileRaw || desktopRaw;
      return {
        desktopRaw: desktop,
        mobileRaw: mobile,
        // Distinct mobile art uses 1080; empty mobile falls back to desktop file at w=1080
        desktop: heroSrc(desktop, 1920),
        mobile: heroSrc(mobile, 1080),
      };
    })
    .filter((slide) => slide.desktopRaw || slide.mobileRaw);
  const count = unique.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const safe = wrapIndex(index, count);
  const hasMany = count > 1;

  useImageAutoplay(count, {
    index: safe,
    setIndex,
    enabled: hasMany,
    paused,
  });

  const goNext = useCallback(() => {
    setIndex((prev) => wrapIndex(prev + 1, count));
  }, [count]);

  const goPrev = useCallback(() => {
    setIndex((prev) => wrapIndex(prev - 1, count));
  }, [count]);

  if (count === 0) {
    return null;
  }

  const activeSlide = unique[safe];

  return (
    <div
      className="ha-hero__media"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {activeSlide ? (
        <>
          {/* Media-scoped preloads — avoid Next Image priority which always preloads desktop src */}
          <link rel="preload" as="image" href={activeSlide.mobile} media="(max-width: 1023px)" />
          <link rel="preload" as="image" href={activeSlide.desktop} media="(min-width: 1024px)" />
          <picture className={cn("ha-hero__banner-picture", "is-active")}>
            <source media="(min-width: 1024px)" srcSet={activeSlide.desktop} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSlide.mobile}
              alt=""
              className="ha-hero__banner"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </>
      ) : null}
      {hasMany ? (
        <>
          <button
            type="button"
            className="ha-hero__nav ha-hero__nav--prev"
            aria-label="Previous banner"
            onClick={goPrev}
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            className="ha-hero__nav ha-hero__nav--next"
            aria-label="Next banner"
            onClick={goNext}
          >
            <IconChevronRight />
          </button>
        </>
      ) : null}
    </div>
  );
}
