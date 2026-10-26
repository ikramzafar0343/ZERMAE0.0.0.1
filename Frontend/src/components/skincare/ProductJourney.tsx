"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProductJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const viewport = stageRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (distance() <= 0) return;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const step = Math.min(3, Math.max(1, Math.ceil(self.progress * 3)));
              if (progressRef.current) progressRef.current.textContent = `0${step} — 03`;
            },
          },
        });

        track.querySelectorAll("[data-journey-image]").forEach((image) => {
          gsap.fromTo(
            image,
            { y: -18 },
            {
              y: 18,
              ease: "none",
              scrollTrigger: {
                trigger: viewport,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: 1,
              },
            },
          );
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: stageRef },
  );

  return (
    <section className="skin-journey" id="skin-journey">
      <div className="skin-journey__stage" ref={stageRef}>
        <div className="skin-journey__top">
          <span ref={progressRef}>01 — 03</span>
          <span>{SKIN_COPY.journeyLabel}</span>
        </div>
        <div className="skin-journey__track" ref={trackRef}>
          {SKIN_COPY.journeyStages.map((stage) => (
            <article key={stage.id} className="skin-journey__panel">
              <div className="skin-journey__image" data-journey-image>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stage.image} alt="" />
              </div>
              <div>
                <p className="skin-journey__word">{stage.word}</p>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
                <Link href={stage.href} className="skin-btn">
                  {stage.cta}
                  <span className="skin-btn__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="skin-journey__stack">
        <div className="skin-shell">
          <p className="skin-eyebrow">{SKIN_COPY.journeyLabel}</p>
          {SKIN_COPY.journeyStages.map((stage) => (
            <article key={stage.id} className="skin-journey__stack-item">
              <div className="skin-journey__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stage.image} alt="" />
              </div>
              <div>
                <p className="skin-journey__word">{stage.word}</p>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
                <Link href={stage.href} className="skin-btn">
                  {stage.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
