"use client";

import Link from "next/link";

import { formatMoney } from "@/constants/storefront";
import { AddToBagForm } from "@/features/cart/add-to-bag-form";
import { cn } from "@/lib/cn";

export type MiniProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  href?: string;
};

export function ProductMiniCard({
  product,
  currency = "PKR",
  className,
  showAdd = true,
}: {
  product: MiniProduct;
  currency?: string;
  className?: string;
  showAdd?: boolean;
}) {
  const href = product.href ?? `/product/${product.id}`;

  return (
    <article className={cn("ha-mini-tile", className)}>
      <Link href={href} className="ha-mini-tile__thumb ha-zoom-clip" aria-label={product.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="ha-media-fill ha-zoom-media" loading="lazy" />
      </Link>
      <div className="ha-mini-tile__meta">
        <Link href={href} className="ha-mini-tile__name">
          {product.title}
        </Link>
        <p className="ha-mini-tile__price">{formatMoney(product.price, currency)}</p>
      </div>
      {showAdd ? (
        <AddToBagForm productId={product.id} className="contents">
          <button type="submit" className="ha-mini-tile__add" aria-label={`Add ${product.title} to bag`}>
            <span className="ha-mini-tile__add-visual" aria-hidden="true">
              +
            </span>
          </button>
        </AddToBagForm>
      ) : null}
    </article>
  );
}
