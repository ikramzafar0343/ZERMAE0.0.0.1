"use client";

import { useEffect } from "react";

import { trackMeta } from "@/lib/meta-pixel";

export function MetaViewContent({
  productId,
  productName,
  value,
  currency,
  category,
}: {
  productId: string;
  productName: string;
  value: number;
  currency: string;
  category?: string;
}) {
  useEffect(() => {
    trackMeta("ViewContent", {
      content_ids: [productId],
      content_type: "product",
      content_name: productName,
      value,
      currency,
      ...(category ? { content_category: category } : {}),
    });
  }, [category, currency, productId, productName, value]);

  return null;
}
