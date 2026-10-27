"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/** Land collection navigations at the top so banner + products paint without a mid-page jump. */
export function CollectionScrollTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.location.hash) {
      history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, query]);

  return null;
}
