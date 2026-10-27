"use client";

import Link from "next/link";

import { IconHeart, IconPlus } from "@/components/icons/icons";
import { formatMoney } from "@/constants/storefront";
import { AddToBagForm } from "@/features/cart/add-to-bag-form";
import { toggleWishlistAction } from "@/features/wishlist/actions";
import { cn } from "@/lib/cn";

export type QuietProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  href?: string;
};

function isCatalogProductId(id: string): boolean {
  return Boolean(id) && !id.startsWith("fallback-") && !id.startsWith("ritual-");
}

export function ProductTile({
  product,
  currency = "PKR",
  className,
  showQuickAdd = true,
  showWishlist = true,
  showPrice = true,
  viewAllHref,
  viewAllLabel = "View all",
  wished = false,
}: {
  product: QuietProduct;
  currency?: string;
  className?: string;
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  showPrice?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
  wished?: boolean;
}) {
  const href = product.href ?? (isCatalogProductId(product.id) ? `/product/${product.id}` : "/collections/all");
  const canAct = isCatalogProductId(product.id);
  const actionHref = viewAllHref ?? href;

  return (
    <article className={cn("ha-product-tile", className)} data-reveal-item>
      <div className="ha-product-tile__media">
        <Link href={href} className="ha-product-tile__shot" aria-label={product.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className="ha-media-fill ha-product-tile__img"
            data-hover-image
            loading="lazy"
          />
        </Link>

        {showWishlist ? (
          canAct ? (
            <form action={toggleWishlistAction} className="ha-product-tile__wish">
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className={cn("ha-product-tile__wish-btn", wished && "is-active")}
                aria-label={wished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                aria-pressed={wished}
              >
                <IconHeart />
              </button>
            </form>
          ) : (
            <Link href="/wishlist" className="ha-product-tile__wish ha-product-tile__wish-btn" aria-label="Wishlist">
              <IconHeart />
            </Link>
          )
        ) : null}

        {showQuickAdd ? (
          canAct ? (
            <AddToBagForm productId={product.id} className="ha-product-tile__quick">
              <button type="submit" className="ha-product-tile__quick-btn" aria-label={`Add ${product.title} to bag`}>
                <IconPlus />
              </button>
            </AddToBagForm>
          ) : (
            <Link
              href={href}
              className="ha-product-tile__quick ha-product-tile__quick-btn"
              aria-label={`Shop ${product.title}`}
            >
              <IconPlus />
            </Link>
          )
        ) : null}
      </div>
      <div className="ha-product-tile__meta">
        <Link href={href} className="ha-product-tile__name">
          {product.title}
        </Link>
        {viewAllHref ? (
          <Link href={actionHref} className="ha-product-tile__view-all">
            {viewAllLabel}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : showPrice ? (
          <span className="ha-product-tile__price">{formatMoney(product.price, currency)}</span>
        ) : null}
      </div>
    </article>
  );
}
