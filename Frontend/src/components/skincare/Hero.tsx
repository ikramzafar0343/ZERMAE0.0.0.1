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

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = root.current;
      if (!el || reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(el.querySelector("[data-hero-backdrop]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65, ease: "power2.out" })
        .fromTo(
          document.querySelectorAll("[data-header-nav] .skin-nav-link, [data-header-actions] .skin-nav-link, [data-header-actions] .skin-icon-btn"),
          { y: -14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.055 },
          0.18,
        )
        .fromTo(document.querySelector("[data-header-brand]"), { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.22)
        .fromTo(
          el.querySelectorAll(".reveal-line"),
          { yPercent: 115 },
          { yPercent: 0, duration: 0.95, stagger: 0.11 },
          0.2,
        )
        .fromTo(
          el.querySelectorAll("[data-hero-support]"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.09 },
          "-=0.35",
        )
        .fromTo(
          el.querySelector("[data-hero-portrait]"),
          { clipPath: "inset(10% 0 0 12%)", scale: 1.07 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.45 },
          0.15,
        )
        .fromTo(
          el.querySelector("[data-hero-product]"),
          { y: 46, rotation: 3, autoAlpha: 0 },
          { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1 },
          0.45,
        );

      gsap.to(el.querySelector("[data-hero-portrait]"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "75% top", scrub: 1 },
      });
      gsap.to(el.querySelector("[data-hero-title]"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "75% top", scrub: 1 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-hero" id="skin-hero" data-hero-backdrop>
      <div className="skin-hero__grid">
        <div className="skin-hero__copy">
          <p className="skin-eyebrow" data-hero-support>
            {SKIN_COPY.heroEyebrow}
          </p>
          <h1 className="skin-hero__title" data-hero-title>
            {SKIN_COPY.heroLines.map((line) => (
              <RevealLine key={line}>{line}</RevealLine>
            ))}
          </h1>
          <p className="skin-hero__intro" data-hero-support>
            {SKIN_COPY.heroIntro}
          </p>
          <div className="skin-hero__actions" data-hero-support>
            <Link href={SKIN_COPY.heroCtaHref} className="skin-btn">
              {SKIN_COPY.heroCta}
              <span className="skin-btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href={SKIN_COPY.heroSecondaryHref} className="skin-link">
              {SKIN_COPY.heroSecondary}
            </Link>
          </div>
        </div>

        <div className="skin-hero__media">
          <div className="skin-hero__portrait" data-hero-portrait>
            <Image
              src={SKIN_MEDIA.heroPortrait.src}
              alt="Skincare portrait with natural complexion"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              style={{ objectFit: "cover", objectPosition: SKIN_MEDIA.heroPortrait.objectPosition }}
            />
          </div>
          <div className="skin-hero__product" data-hero-product>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SKIN_MEDIA.heroProduct.src} alt="Featured Zermae product" />
          </div>
          <p className="skin-hero__meta">Serum · 30 ml</p>
        </div>
      </div>

      <button
        type="button"
        className="skin-hero__scroll"
        onClick={() => document.getElementById("skin-manifesto")?.scrollIntoView({ behavior: "smooth" })}
      >
        Scroll to discover
        <span className="skin-hero__scroll-line" aria-hidden="true" />
      </button>
    </section>
  );
}
