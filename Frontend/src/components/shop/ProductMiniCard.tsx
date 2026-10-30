"use client";

import Link from "next/link";

import { formatMoney } from "@/constants/storefront";
import { AddToBagForm } from "@/features/cart/add-to-bag-form";
import { CmsImage } from "@/features/media/cms-image";
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
      <Link href={href} className="ha-mini-tile__thumb ha-zoom-clip" aria-label={`${product.title}, ${formatMoney(product.price, currency)}`}>
        <CmsImage
          src={product.image}
          alt=""
          width={144}
          height={144}
          className="ha-media-fill ha-zoom-media"
          sizes="72px"
          loading="lazy"
        />
      </Link>
      <div className="ha-mini-tile__meta">
        <p className="ha-mini-tile__name">{product.title}</p>
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
