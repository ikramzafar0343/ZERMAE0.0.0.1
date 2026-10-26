"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { RevealLine } from "@/components/skincare/animations/RevealLine";
import { SKIN_MEDIA } from "@/lib/content/skincare-media";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function BrandStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.querySelector("[data-story-media]"),
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
      gsap.fromTo(
        el.querySelectorAll(".reveal-line"),
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-story-body]"),
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-story" id="skin-story">
      <div className="skin-shell skin-story__grid">
        <div className="skin-story__media" data-story-media>
          <Image
            src={SKIN_MEDIA.storyTexture.src}
            alt="Close editorial skincare texture"
            fill
            sizes="(max-width: 1023px) 100vw, 45vw"
            style={{ objectFit: "cover", objectPosition: SKIN_MEDIA.storyTexture.objectPosition }}
          />
        </div>
        <div className="skin-story__copy">
          <p className="skin-eyebrow" style={{ color: "rgba(247,245,242,0.72)" }}>
            {SKIN_COPY.storyEyebrow}
          </p>
          <h2 className="skin-story__title">
            <RevealLine>{SKIN_COPY.storyTitle}</RevealLine>
          </h2>
          <div className="skin-story__divider" data-story-body />
          <p className="skin-story__body" data-story-body>
            {SKIN_COPY.storyBody}
          </p>
          <div data-story-body style={{ marginTop: 32 }}>
            <Link href={SKIN_COPY.storyCtaHref} className="skin-btn skin-btn--ghost">
              {SKIN_COPY.storyCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
