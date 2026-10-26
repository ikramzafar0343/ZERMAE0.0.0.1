"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import { SKIN_MEDIA } from "@/lib/content/skincare-media";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function EditorialRoutine() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.querySelector("[data-routine-detail]"),
        { y: 70 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        el.querySelector("[data-routine-text]"),
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-routine" id="skin-routine">
      <div className="skin-shell skin-routine__grid">
        <div className="skin-routine__primary">
          <Image
            src={SKIN_MEDIA.routinePrimary.src}
            alt="Lifestyle skincare application"
            fill
            sizes="(max-width: 1023px) 100vw, 40vw"
            style={{ objectFit: "cover", objectPosition: SKIN_MEDIA.routinePrimary.objectPosition }}
          />
          <div className="skin-routine__detail" data-routine-detail>
            <Image
              src={SKIN_MEDIA.routineDetail.src}
              alt="Product detail still"
              fill
              sizes="30vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div data-routine-text>
          <h2 className="skin-routine__title">
            {SKIN_COPY.routineTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div style={{ marginTop: 40 }}>
            {SKIN_COPY.routineBenefits.map((item) => (
              <div key={item.id} className="skin-benefit">
                <span className="skin-benefit__num">{item.id}</span>
                <div>
                  <p className="skin-benefit__label">{item.label}</p>
                  <p className="skin-benefit__body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
