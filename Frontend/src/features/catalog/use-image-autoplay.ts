"use client";

import { useEffect, useState } from "react";

type SetIndex = (value: number | ((prev: number) => number)) => void;

export function useImageAutoplay(
  count: number,
  {
    index,
    setIndex,
    enabled = true,
    paused = false,
    intervalMs = 3500,
  }: {
    index: number;
    setIndex: SetIndex;
    enabled?: boolean;
    paused?: boolean;
    intervalMs?: number;
  },
) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || paused || reducedMotion || count < 2) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [count, enabled, index, intervalMs, paused, reducedMotion, setIndex]);

  return { reducedMotion };
}

export function wrapIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  return ((index % count) + count) % count;
}
