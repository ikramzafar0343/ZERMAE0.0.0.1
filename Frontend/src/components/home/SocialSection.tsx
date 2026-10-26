"use client";

import { useEffect, useRef } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_SOCIAL, HOME_SOCIAL_ITEMS } from "@/lib/content/homepage";

export function SocialSection({ cms }: { cms?: StorefrontHome["sections"]["social"] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const items = cms?.items?.length ? cms.items : HOME_SOCIAL_ITEMS;

  useEffect(() => {
    const row = rowRef.current;
    if (!row || window.matchMedia("(max-width: 767px)").matches) return;
    const target = (row.scrollWidth - row.clientWidth) / 2;
    row.scrollLeft = Math.max(0, target);
  }, []);

  return (
    <section className="ha-social" id="ha-social">
      <div className="ha-container ha-social__intro">
        <SectionHeading
          className="ha-social__heading"
          eyebrow={cms?.eyebrow ?? HOME_SOCIAL.eyebrow}
          lines={[cms?.line1 ?? HOME_SOCIAL.lines[0], cms?.line2 ?? HOME_SOCIAL.lines[1]]}
        />
        <a
          href={cms?.followHref ?? HOME_SOCIAL.followHref}
          className="ha-btn ha-social__follow"
          target="_blank"
          rel="noopener noreferrer"
        >
          {cms?.followLabel ?? HOME_SOCIAL.followLabel}
        </a>
      </div>
      <div className="ha-social__row-wrap" ref={rowRef} data-reveal-row aria-label="Social gallery">
        <div className="ha-social__row">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="ha-social__card"
              target="_blank"
              rel="noopener noreferrer"
              data-reveal-item
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="ha-media-fill" loading="lazy" />
              <span className="ha-social__overlay">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
                </svg>
                <span>{item.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
