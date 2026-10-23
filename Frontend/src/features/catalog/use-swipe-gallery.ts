"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

const SWIPE_THRESHOLD = 40;
const CLICK_THRESHOLD = 8;

export function useSwipeGallery({
  enabled,
  onNext,
  onPrev,
  onTap,
}: {
  enabled: boolean;
  onNext: () => void;
  onPrev: () => void;
  onTap?: (() => void) | undefined;
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0) {
        return;
      }
      startRef.current = { x: event.clientX, y: event.clientY };
      draggedRef.current = false;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !startRef.current) {
        return;
      }
      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) {
        draggedRef.current = true;
      }
    },
    [enabled],
  );

  const finish = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !startRef.current) {
        startRef.current = null;
        return;
      }
      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      startRef.current = null;

      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          onNext();
        } else {
          onPrev();
        }
        return;
      }

      if (!draggedRef.current) {
        onTap?.();
      }
    },
    [enabled, onNext, onPrev, onTap],
  );

  const onPointerCancel = useCallback(() => {
    startRef.current = null;
    draggedRef.current = false;
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel,
  };
}
