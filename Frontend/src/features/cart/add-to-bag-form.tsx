"use client";

import { type ReactNode, useTransition } from "react";

import { addToCartAction } from "@/features/cart/actions";
import { notifyBagOpened, notifyToast } from "@/lib/bag-events";
import { trackMeta } from "@/lib/meta-pixel";

export function AddToBagForm({
  productId,
  quantity = 1,
  size,
  color,
  colorHex,
  className,
  disabled,
  children,
  contentName,
  value,
  currency = "PKR",
}: {
  productId: string;
  quantity?: number;
  size?: string;
  color?: string;
  colorHex?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  children: ReactNode;
  contentName?: string;
  value?: number;
  currency?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={className}
      action={(formData) => {
        startTransition(async () => {
          const result = await addToCartAction(formData);
          if (result.error) {
            notifyToast(result.error, "error");
            return;
          }
          trackMeta("AddToCart", {
            content_ids: [productId],
            content_type: "product",
            currency,
            num_items: quantity,
            contents: [
              {
                id: productId,
                quantity,
                ...(typeof value === "number" ? { item_price: value } : {}),
              },
            ],
            ...(contentName ? { content_name: contentName } : {}),
            ...(typeof value === "number" ? { value: value * quantity } : {}),
          });
          notifyToast("Added to bag");
          notifyBagOpened();
        });
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      {size ? <input type="hidden" name="size" value={size} /> : null}
      {color ? <input type="hidden" name="color" value={color} /> : null}
      {colorHex ? <input type="hidden" name="colorHex" value={colorHex} /> : null}
      <fieldset disabled={disabled || pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
