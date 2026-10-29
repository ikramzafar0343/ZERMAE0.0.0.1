"use client";

import { useCallback, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { IconChevronLeft, IconChevronRight, IconClose } from "@/components/icons/icons";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { useSwipeGallery } from "@/features/catalog/use-swipe-gallery";
import { CmsImage } from "@/features/media/cms-image";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const unique = images.filter((image, index) => images.indexOf(image) === index);
  const count = unique.length;
  const safeActive = wrapIndex(active, count);
  const current = unique[safeActive] ?? unique[0];
  const hasMany = count > 1;

  const goNext = useCallback(() => {
    setActive((prev) => wrapIndex(prev + 1, count));
  }, [count]);

  const goPrev = useCallback(() => {
    setActive((prev) => wrapIndex(prev - 1, count));
  }, [count]);

  const openZoom = useCallback(() => setZoomed(true), []);
  const closeZoom = useCallback(() => setZoomed(false), []);

  useImageAutoplay(count, {
    index: safeActive,
    setIndex: setActive,
    enabled: hasMany,
    paused: zoomed || hovering || focused,
  });

  const swipe = useSwipeGallery({
    enabled: !zoomed && unique.length > 0,
    onNext: goNext,
    onPrev: goPrev,
    onTap: openZoom,
  });

  useEffect(() => {
    if (!zoomed) {
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeZoom();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed, closeZoom]);

  const onGalleryKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!hasMany || zoomed) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  return (
    <div
      className={cn("product-gallery", !hasMany && "product-gallery--solo")}
      tabIndex={hasMany ? 0 : undefined}
      onKeyDown={onGalleryKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {hasMany ? (
        <div className="product-thumbs" role="tablist" aria-label="Product views">
          {unique.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={safeActive === index}
              onClick={() => setActive(index)}
              className={cn("product-thumb", safeActive === index && "product-thumb-active")}
            >
              <CmsImage
                src={image}
                alt={`${title} view ${index + 1}`}
                width={88}
                height={88}
                className="product-thumb-image"
              />
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="product-main-image"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {unique.length > 0 ? (
          <>
            <div
              className="product-main-stage"
              role="button"
              tabIndex={-1}
              aria-label={hasMany ? `${title}, image ${safeActive + 1} of ${count}. Swipe or click to enlarge.` : `Enlarge ${title}`}
              {...swipe}
            >
              {unique.map((image, index) => (
                <CmsImage
                  key={`${image}-${index}`}
                  src={image}
                  alt={title}
                  width={1200}
                  height={1500}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className={cn("product-main-still product-main-slide", safeActive === index && "is-active")}
                />
              ))}
            </div>
            {hasMany ? (
              <>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--prev"
                  aria-label="Previous image"
                  onClick={(event) => {
                    event.stopPropagation();
                    goPrev();
                  }}
                >
                  <IconChevronLeft />
                </button>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--next"
                  aria-label="Next image"
                  onClick={(event) => {
                    event.stopPropagation();
                    goNext();
                  }}
                >
                  <IconChevronRight />
                </button>
              </>
            ) : null}
          </>
        ) : (
          <span className="product-main-empty">No image</span>
        )}
      </div>
      {zoomed && current ? (
        <div className="product-zoom">
          <button type="button" className="product-zoom-backdrop" aria-label="Close image" onClick={closeZoom} />
          <div className="product-zoom-frame" role="dialog" aria-modal="true" aria-label={title}>
            <button type="button" className="product-zoom-close" aria-label="Close image" onClick={closeZoom}>
              <IconClose />
            </button>
            <CmsImage src={current} alt={title} width={900} height={900} className="product-zoom-still" />
            {hasMany ? (
              <>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--prev product-gallery-nav--zoom"
                  aria-label="Previous image"
                  onClick={goPrev}
                >
                  <IconChevronLeft />
                </button>
                <button
                  type="button"
                  className="product-gallery-nav product-gallery-nav--next product-gallery-nav--zoom"
                  aria-label="Next image"
                  onClick={goNext}
                >
                  <IconChevronRight />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
