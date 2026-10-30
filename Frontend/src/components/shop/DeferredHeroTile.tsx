"use client";

import { type ReactNode, useEffect, useState } from "react";

/**
 * Mount hero product chrome after idle so it cannot steal bandwidth from LCP banner.
 */
export function DeferredHeroTile({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(enable, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) {
    // Reserve the same tile box so CLS stays ~0 while LCP banner wins the network
    return <div className="ha-hero__tile" data-hero-tile aria-hidden="true" />;
  }

  return <>{children}</>;
}
