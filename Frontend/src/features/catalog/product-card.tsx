"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { IconChevronLeft, IconChevronRight, IconHeart, IconPlus } from "@/components/icons/icons";
import { formatMoney, tileStyle } from "@/constants/storefront";
import { AddToBagForm } from "@/features/cart/add-to-bag-form";
import { useImageAutoplay, wrapIndex } from "@/features/catalog/use-image-autoplay";
import { useSwipeGallery } from "@/features/catalog/use-swipe-gallery";
import { CmsImage } from "@/features/media/cms-image";
import { toggleWishlistAction } from "@/features/wishlist/actions";
import { cn } from "@/lib/cn";

export type ProductCardTone = "blush" | "mint" | "lavender";

const TONE_COLORS: Record<ProductCardTone, string> = {
  blush: "#f0c5bf",
  mint: "#d5e4cf",
  lavender: "#efe4ee",
};

export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null | undefined;
  images: string[];
  tileColor?: string | null;
};

export function ProductCard({
  product,
  wished,
  tone = "blush",
  color,
  currency = "PKR",
}: {
  product: CatalogProduct;
  wished: boolean;
  tone?: ProductCardTone;
  color?: string;
  currency?: string;
}) {
  const router = useRouter();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const images = product.images.filter((image, index) => product.images.indexOf(image) === index);
  const count = images.length;
  const hasMany = count > 1;
  const safeActive = wrapIndex(active, count);
  const hasSale = Boolean(product.originalPrice && product.originalPrice > product.price);
  const href = `/product/${product.id}`;

  const goNext = useCallback(() => {
    setActive((prev) => wrapIndex(prev + 1, count));
  }, [count]);

  const goPrev = useCallback(() => {
    setActive((prev) => wrapIndex(prev - 1, count));
  }, [count]);

  const openProduct = useCallback(() => {
    router.push(href);
  }, [href, router]);

  useEffect(() => {
    const node = mediaRef.current;
    if (!node || !hasMany) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMany]);

  useImageAutoplay(count, {
    index: safeActive,
    setIndex: setActive,
    enabled: hasMany && inView,
    paused: hovering,
  });

  const swipe = useSwipeGallery({
    enabled: images.length > 0,
    onNext: goNext,
    onPrev: goPrev,
    onTap: openProduct,
  });

  return (
    <article className="product-card" style={tileStyle(color || TONE_COLORS[tone])}>
      <div className="product-card-media-wrap">
        <div
          ref={mediaRef}
          className="product-card-media-clip"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {images.length > 0 ? (
            <div
              className="product-card-media-stage"
              role="link"
              tabIndex={0}
              aria-label={
                hasMany
                  ? `${product.title}, image ${safeActive + 1} of ${count}. Swipe for more or tap to open.`
                  : product.title
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openProduct();
                } else if (hasMany && event.key === "ArrowRight") {
                  event.preventDefault();
                  goNext();
                } else if (hasMany && event.key === "ArrowLeft") {
                  event.preventDefault();
                  goPrev();
                }
              }}
              {...swipe}
            >
              {images.map((image, index) => (
                <CmsImage
                  key={`${image}-${index}`}
                  src={image}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, 90vw"
                  className={cn("product-card-still product-card-slide", safeActive === index && "is-active")}
                />
              ))}
            </div>
          ) : (
            <Link href={href} className="product-card-media-link" aria-label={product.title}>
              <span className="product-card-empty">No image</span>
            </Link>
          )}
          {hasMany ? (
            <>
              <button
                type="button"
                className="product-card-nav product-card-nav--prev"
                aria-label="Previous image"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  goPrev();
                }}
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                className="product-card-nav product-card-nav--next"
                aria-label="Next image"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  goNext();
                }}
              >
                <IconChevronRight />
              </button>
              <div className="product-card-dots" aria-hidden="true">
                {images.map((_, index) => (
                  <span key={index} className={cn("product-card-dot", safeActive === index && "is-active")} />
                ))}
              </div>
            </>
          ) : null}
          <form action={toggleWishlistAction} className="product-card-heart-form">
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              className={cn("product-card-wishlist", wished && "is-active")}
              aria-label={wished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
              aria-pressed={wished}
            >
              <IconHeart />
            </button>
          </form>
        </div>
        <AddToBagForm productId={product.id} className="product-quick-add">
          <button type="submit" className="product-quick-add-btn" aria-label={`Add ${product.title} to bag`}>
            <IconPlus />
          </button>
        </AddToBagForm>
      </div>
      <Link href={href} className="product-card-copy">
        <h3 className="product-card-name">{product.title}</h3>
        {product.description ? <p className="product-card-desc">{product.description}</p> : null}
        <p className="product-card-price-row">
          {hasSale && product.originalPrice ? (
            <span className="product-card-price-original">{formatMoney(product.originalPrice, currency)}</span>
          ) : null}
          <span className={`product-card-price${hasSale ? " product-card-price--sale" : ""}`}>
            {formatMoney(product.price, currency)}
          </span>
        </p>
      </Link>
    </article>
  );
}
