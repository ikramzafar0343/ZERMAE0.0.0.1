"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { SKIN_MEDIA } from "@/lib/content/skincare-media";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LifestyleFeature() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.querySelector("[data-lifestyle-img]"),
        { scale: 1.09 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-lifestyle" id="skin-lifestyle">
      <div className="skin-lifestyle__media">
        <div data-lifestyle-img style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image
            src={SKIN_MEDIA.lifestyleWide.src}
            alt="Authentic skin portrait"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: SKIN_MEDIA.lifestyleWide.objectPosition }}
          />
        </div>
      </div>
      <div className="skin-lifestyle__shade" aria-hidden="true" />
      <div className="skin-lifestyle__content">
        <p className="skin-eyebrow" style={{ color: "rgba(247,245,242,0.8)" }}>
          {SKIN_COPY.lifestyleEyebrow}
        </p>
        <blockquote className="skin-lifestyle__quote">{SKIN_COPY.lifestyleQuote}</blockquote>
      </div>
    </section>
  );
}
