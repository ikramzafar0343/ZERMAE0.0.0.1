"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@/components/icons/icons";
import type { HeroBannerSlide } from "@/constants/storefront";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { cn } from "@/lib/cn";
import { resolvePublicImageUrl } from "@/lib/public-image-url";

const MOBILE_MQ = "(max-width: 1023px)";

export function HeroBannerSlider({
  banners,
}: {
  banners: HeroBannerSlide[];
}) {
  const unique = banners
    .map((slide) => ({
      desktop: resolvePublicImageUrl(slide.desktop.trim()),
      mobile: resolvePublicImageUrl(slide.mobile.trim()),
    }))
    .filter((slide) => slide.desktop || slide.mobile)
    .map((slide) => ({
      desktop: slide.desktop || slide.mobile,
      mobile: slide.mobile,
    }));
  const count = unique.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const safe = wrapIndex(index, count);
  const hasMany = count > 1;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
        const active = safe === i;
        if (!active) {
          return null;
        }
        const src = isMobile ? slide.mobile || slide.desktop : slide.desktop;
        return (
          <div
            key={`${slide.desktop}-${slide.mobile}-${i}`}
            className={cn("ha-hero__banner-picture", "is-active")}
          >
            <Image
              src={src}
              alt=""
              width={1920}
              height={1080}
              className="ha-hero__banner"
              sizes="100vw"
              quality={80}
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
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
