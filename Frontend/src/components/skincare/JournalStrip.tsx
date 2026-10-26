"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function JournalStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.querySelectorAll("[data-journal-media]"),
        { clipPath: "inset(0 0 14% 0)", y: 30 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-journal" id="skin-journal">
      <div className="skin-shell">
        <div className="skin-journal__head">
          <h2 className="skin-journal__title">{SKIN_COPY.journalTitle}</h2>
          <Link href={SKIN_COPY.journalExploreHref} className="skin-link">
            {SKIN_COPY.journalExplore}
          </Link>
        </div>
        <div className="skin-journal__grid">
          {SKIN_COPY.journalItems.map((item) => (
            <Link key={item.id} href={item.href} className="skin-journal__card">
              <div className="skin-journal__media" data-journal-media>
                <Image src={item.image} alt="" fill sizes="(max-width: 767px) 100vw, 45vw" style={{ objectFit: "cover" }} />
              </div>
              <p className="skin-journal__meta">
                {item.category} · {item.date}
              </p>
              <h3>{item.title}</h3>
              <span className="skin-journal__arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
