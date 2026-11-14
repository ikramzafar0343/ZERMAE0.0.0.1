"use client";

import { useEffect } from "react";

import { trackMeta, type MetaContentParams } from "@/lib/meta-pixel";

export function MetaPurchase({
  orderId,
  value,
  currency,
  contentIds,
  contents,
  numItems,
}: {
  orderId: string;
  value: number;
  currency: string;
  contentIds: string[];
  contents: NonNullable<MetaContentParams["contents"]>;
  numItems: number;
}) {
  useEffect(() => {
    try {
      const key = `meta-purchase:${orderId}`;
      if (window.sessionStorage.getItem(key) === "1") {
        return;
      }
      trackMeta("Purchase", {
        order_id: orderId,
        value,
        currency,
        content_ids: contentIds,
        content_type: "product",
        contents,
        num_items: numItems,
      });
      window.sessionStorage.setItem(key, "1");
    } catch {
      trackMeta("Purchase", {
        order_id: orderId,
        value,
        currency,
        content_ids: contentIds,
        content_type: "product",
        contents,
        num_items: numItems,
      });
    }
  }, [contentIds, contents, currency, numItems, orderId, value]);

  return null;
}
