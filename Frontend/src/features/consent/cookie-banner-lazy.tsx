"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(
  () => import("@/features/consent/cookie-banner").then((mod) => mod.CookieBanner),
  { ssr: false },
);

export function CookieBannerLazy() {
  return <CookieBanner />;
}
