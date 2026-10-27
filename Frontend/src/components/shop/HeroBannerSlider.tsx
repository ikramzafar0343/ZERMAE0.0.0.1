"use client";

import { useCallback, useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@/components/icons/icons";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { cn } from "@/lib/cn";

export function HeroBannerSlider({
  banners,
  objectPosition = "62% 48%",
}: {
  banners: string[];
  objectPosition?: string;
}) {
  const unique = banners.map((src) => src.trim()).filter(Boolean);
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
      data-parallax-shell
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {unique.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={cn("ha-hero__banner", safe === i && "is-active")}
          style={{ objectPosition }}
          fetchPriority={i === 0 ? "high" : "auto"}
        />
      ))}
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
