"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useRef, useState } from "react";

import type { StorefrontHome } from "@/constants/storefront";
import { HOME_FAQ, type HomeFaqItem } from "@/lib/content/homepage";
import { MOTION } from "@/lib/motion/motionTokens";

gsap.registerPlugin(ScrollTrigger);

export function FaqSection({
  items,
  cms,
}: {
  items: HomeFaqItem[];
  cms?: StorefrontHome["sections"]["faq"];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = (itemId: string, open: boolean) => {
      const panel = panelRefs.current[itemId];
      if (!panel) return;
      const inner = panel.firstElementChild as HTMLElement | null;
      if (reduced) {
        panel.style.height = open ? "auto" : "0px";
        if (inner) {
          inner.style.opacity = open ? "1" : "0";
          inner.style.transform = "none";
        }
        return;
      }

      if (open) {
        panel.hidden = false;
        gsap.set(panel, { height: "auto", overflow: "hidden" });
        const height = panel.offsetHeight || (inner?.scrollHeight ?? 0);
        gsap.fromTo(
          panel,
          { height: 0 },
          {
            height,
            duration: MOTION.accordionHeight.duration,
            ease: MOTION.accordionHeight.ease,
            onComplete: () => {
              gsap.set(panel, { height: "auto" });
              ScrollTrigger.refresh();
            },
          },
        );
        if (inner) {
          gsap.fromTo(
            inner,
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION.accordionText.duration,
              delay: MOTION.accordionText.delay,
              ease: "power2.out",
            },
          );
        }
      } else {
        const height = panel.offsetHeight;
        if (inner) {
          gsap.to(inner, { opacity: 0, y: 6, duration: 0.16, ease: "power1.in" });
        }
        gsap.fromTo(
          panel,
          { height },
          {
            height: 0,
            duration: MOTION.accordionHeight.duration,
            ease: MOTION.accordionHeight.ease,
            onComplete: () => {
              panel.hidden = true;
              ScrollTrigger.refresh();
            },
          },
        );
      }
    };

    if (openId && openId !== next) animate(openId, false);
    if (next) animate(next, true);
    else if (openId) animate(openId, false);
    setOpenId(next);
  };

  return (
    <section className="ha-faq" aria-labelledby={`${baseId}-heading`}>
      <div className="ha-faq__inner">
        <div className="ha-faq__intro" data-section-intro>
          <p className="ha-eyebrow">
            {cms?.eyebrow ?? HOME_FAQ.eyebrow}
            <span className="ha-eyebrow__mark" aria-hidden="true" />
          </p>
          <h2 id={`${baseId}-heading`} className="ha-section-heading__title" style={{ marginInline: 0 }}>
            {[cms?.line1 ?? HOME_FAQ.lines[0], cms?.line2 ?? HOME_FAQ.lines[1]].map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{cms?.intro ?? HOME_FAQ.intro}</p>
        </div>
        <div className="ha-faq__list" data-reveal-row>
          {items.map((item) => {
            const expanded = openId === item.id;
            const panelId = `${baseId}-panel-${item.id}`;
            return (
              <div
                key={item.id}
                className="ha-faq__item"
                data-open={expanded ? "true" : "false"}
                data-reveal-item
              >
                <button
                  type="button"
                  className="ha-faq__trigger"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  <span>{item.question}</span>
                  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  id={panelId}
                  className="ha-faq__panel"
                  role="region"
                  hidden={!expanded}
                  ref={(node) => {
                    panelRefs.current[item.id] = node;
                  }}
                >
                  <div className="ha-faq__panel-inner">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
