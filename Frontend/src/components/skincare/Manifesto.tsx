"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { RevealLine } from "@/components/skincare/animations/RevealLine";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
      gsap.fromTo(
        root.current.querySelectorAll(".reveal-line"),
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 84%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-manifesto" id="skin-manifesto">
      <div className="skin-shell skin-manifesto__grid">
        <p className="skin-eyebrow skin-manifesto__eyebrow">{SKIN_COPY.manifestoEyebrow}</p>
        <h2 className="skin-manifesto__title">
          {SKIN_COPY.manifestoLines.map((line, index) => (
            <RevealLine key={line}>
              {index === 1 ? <em>{line}</em> : line}
            </RevealLine>
          ))}
        </h2>
        <p className="skin-manifesto__support">{SKIN_COPY.manifestoSupport}</p>
      </div>
    </section>
  );
}
