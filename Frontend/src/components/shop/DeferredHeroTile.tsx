"use client";

import { type ReactNode, useEffect, useState } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

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

    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(enable, { timeout: 1800 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const timer = globalThis.setTimeout(enable, 900);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timer);
    };
  }, []);

  if (!ready) {
    // Reserve the same tile box so CLS stays ~0 while LCP banner wins the network
    return <div className="ha-hero__tile" data-hero-tile aria-hidden="true" />;
  }

  return <>{children}</>;
}
