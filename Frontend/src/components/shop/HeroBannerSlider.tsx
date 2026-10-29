"use client";

import { useCallback, useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@/components/icons/icons";
import type { HeroBannerSlide } from "@/constants/storefront";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { cn } from "@/lib/cn";

export function HeroBannerSlider({
  banners,
}: {
  banners: HeroBannerSlide[];
}) {
  const unique = banners
    .map((slide) => ({
      desktop: slide.desktop.trim(),
      mobile: slide.mobile.trim(),
    }))
    .filter((slide) => slide.desktop || slide.mobile)
    .map((slide) => ({
      desktop: slide.desktop || slide.mobile,
      mobile: slide.mobile,
    }));
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

  return (
    <div
      className="ha-hero__media"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {unique.map((slide, i) => {
        const mobileSrc = slide.mobile || slide.desktop;
        return (
          <picture
            key={`${slide.desktop}-${slide.mobile}-${i}`}
            className={cn("ha-hero__banner-picture", safe === i && "is-active")}
          >
            <source media="(max-width: 1023px)" srcSet={mobileSrc} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.desktop}
              alt=""
              className="ha-hero__banner"
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </picture>
        );
      })}
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
