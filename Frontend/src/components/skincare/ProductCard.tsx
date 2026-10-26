"use client";

import Link from "next/link";

import { formatMoney } from "@/constants/storefront";
import { AddToBagForm } from "@/features/cart/add-to-bag-form";
import { cn } from "@/lib/cn";
import type { FeaturedSkinProduct } from "@/lib/skincare-data";

export function ProductCard({
  product,
  currency = "PKR",
}: {
  product: FeaturedSkinProduct;
  currency?: string;
}) {
  return (
    <article className="skin-card reveal-item">
      <div className={cn("skin-card__canvas", `skin-card__canvas--${product.tone}`)}>
        <span className="skin-card__category">{product.category}</span>
        <Link href={`/product/${product.id}`} className="skin-card__media" aria-label={product.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.title} loading="lazy" />
        </Link>
      </div>
      <div className="skin-card__body">
        <Link href={`/product/${product.id}`} className="skin-card__name">
          {product.title}
        </Link>
        <p className="skin-card__benefit">{product.benefit}</p>
        <div className="skin-card__meta">
          <span>{product.size}</span>
          <span>{formatMoney(product.price, currency)}</span>
        </div>
        <AddToBagForm productId={product.id} className="contents">
          <button type="submit" className="skin-card__add">
            Add to bag <span aria-hidden="true">→</span>
          </button>
        </AddToBagForm>
      </div>
    </article>
  );
}
