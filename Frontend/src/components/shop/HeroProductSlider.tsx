"use client";

import { useCallback, useState } from "react";

import { type MiniProduct,ProductMiniCard } from "@/components/shop/ProductMiniCard";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { useSwipeGallery } from "@/features/catalog/use-swipe-gallery";
import { cn } from "@/lib/cn";

/** Cap slides in the hero so large catalogs stay smooth in the browser. */
export const HERO_SLIDER_MAX = 24;

export function HeroProductSlider({
  products,
  currency = "PKR",
}: {
  products: MiniProduct[];
  currency?: string;
}) {
  const slides = products.slice(0, HERO_SLIDER_MAX);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeActive = wrapIndex(active, count);
  const hasMany = count > 1;

  const goNext = useCallback(() => {
    setActive((prev) => wrapIndex(prev + 1, count));
  }, [count]);

  const goPrev = useCallback(() => {
    setActive((prev) => wrapIndex(prev - 1, count));
  }, [count]);

  useImageAutoplay(count, {
    index: safeActive,
    setIndex: setActive,
    enabled: hasMany,
    paused,
    intervalMs: 4200,
  });

  const swipe = useSwipeGallery({
    enabled: hasMany,
    onNext: goNext,
    onPrev: goPrev,
  });

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return <ProductMiniCard product={slides[0]!} currency={currency} />;
  }

  return (
    <div
      className="ha-hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="ha-hero-slider__stage"
        aria-roledescription="carousel"
        aria-label="Featured products"
        {...swipe}
      >
        {slides.map((product, index) => {
          const isActive = safeActive === index;
          return (
            <div
              key={`${product.id}-${index}`}
              className={cn("ha-hero-slider__slide", isActive && "is-active")}
              aria-hidden={!isActive}
            >
              {/* Only mount the visible card so inactive slides do not fetch images */}
              {isActive ? <ProductMiniCard product={product} currency={currency} /> : null}
            </div>
          );
        })}
      </div>
      {count <= 8 ? (
        <div className="ha-hero-slider__dots" role="tablist" aria-label="Featured product slides">
          {slides.map((product, index) => (
            <button
              key={`dot-${product.id}-${index}`}
              type="button"
              role="tab"
              aria-selected={safeActive === index}
              aria-label={`Show ${product.title}`}
              className={cn("ha-hero-slider__dot", safeActive === index && "is-active")}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      ) : (
        <p className="ha-hero-slider__count" aria-live="polite">
          {safeActive + 1} / {count}
        </p>
      )}
    </div>
  );
}
