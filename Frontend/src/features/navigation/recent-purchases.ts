"use server";

import { apiRequestPublic } from "@/lib/api/client";

export type RecentPurchase = {
  firstName: string;
  city: string;
  productId: string;
  productName: string;
  imageUrl: string;
  purchasedAt: string;
};

export async function loadRecentPurchases(): Promise<RecentPurchase[]> {
  try {
    const data = await apiRequestPublic<{ purchases: RecentPurchase[] }>("GET", "/storefront/recent-purchases");
    return Array.isArray(data.purchases) ? data.purchases : [];
  } catch {
    return [];
  }
}
