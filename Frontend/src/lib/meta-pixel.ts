export type MetaContentParams = {
  content_ids?: string[];
  content_type?: "product" | "product_group";
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  order_id?: string;
  search_string?: string;
};

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function getMetaPixelId(): string {
  return String(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();
}

export function trackMeta(event: string, params?: MetaContentParams): void {
  try {
    if (typeof window === "undefined" || !window.fbq || !event) {
      return;
    }
    if (params && Object.keys(params).length > 0) {
      window.fbq("track", event, params);
      return;
    }
    window.fbq("track", event);
  } catch {
    // Never break shop flows if Meta is blocked or unavailable.
  }
}

export function trackMetaCustom(event: string, params?: MetaContentParams): void {
  try {
    if (typeof window === "undefined" || !window.fbq || !event) {
      return;
    }
    if (params && Object.keys(params).length > 0) {
      window.fbq("trackCustom", event, params);
      return;
    }
    window.fbq("trackCustom", event);
  } catch {
    // Never break shop flows if Meta is blocked or unavailable.
  }
}
