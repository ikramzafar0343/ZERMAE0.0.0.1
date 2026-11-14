"use client";

import { useEffect } from "react";

import { trackMeta } from "@/lib/meta-pixel";

export function MetaInitiateCheckout({
  value,
  currency,
  numItems,
  contentIds,
}: {
  value: number;
  currency: string;
  numItems: number;
  contentIds: string[];
}) {
  const idsKey = contentIds.join(",");
  useEffect(() => {
    trackMeta("InitiateCheckout", {
      content_ids: idsKey ? idsKey.split(",") : [],
      content_type: "product",
      value,
      currency,
      num_items: numItems,
    });
  }, [currency, idsKey, numItems, value]);

  return null;
}
