"use client";

import { type KeyboardEvent, type PointerEvent, useCallback, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { resolvePublicImageUrl } from "@/lib/public-image-url";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  className,
}: {
  beforeSrc: string;
  afterSrc: string;
  className?: string;
}) {
  const before = resolvePublicImageUrl(beforeSrc);
  const after = resolvePublicImageUrl(afterSrc);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [position, setPosition] = useState(50);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(next, 0, 100));
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromClientX(event.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((prev) => clamp(prev - 3, 0, 100));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((prev) => clamp(prev + 3, 0, 100));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div className={cn("ha-ba", className)}>
      <div
        ref={frameRef}
        className="ha-ba__frame"
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% before revealed`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt="After"
          className="ha-ba__image ha-ba__image--after"
          width={1600}
          height={1000}
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt="Before"
          className="ha-ba__image ha-ba__image--before"
          width={1600}
          height={1000}
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <div className="ha-ba__divider" style={{ left: `${position}%` }} aria-hidden="true">
          <span className="ha-ba__handle">↔</span>
        </div>
        <span className="ha-ba__label ha-ba__label--before">Before</span>
        <span className="ha-ba__label ha-ba__label--after">After</span>
      </div>
      <div className="ha-ba__hints" aria-hidden="true">
        <span>← Reveal After</span>
        <span>Reveal Before →</span>
      </div>
    </div>
  );
}
