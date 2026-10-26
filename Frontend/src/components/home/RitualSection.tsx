"use client";

import gsap from "gsap";
import { type KeyboardEvent,useId, useRef, useState, useTransition } from "react";

import { ProductTile, type QuietProduct } from "@/components/shop/ProductTile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_RITUAL, RITUAL_TABS, type RitualTab } from "@/lib/content/homepage";
import { MOTION } from "@/lib/motion/motionTokens";

export type RitualCatalog = Record<string, QuietProduct[]>;

export function RitualSection({
  catalog,
  currency,
  wishlistIds = [],
  cms,
  tabs,
}: {
  catalog: RitualCatalog;
  currency: string;
  wishlistIds?: string[];
  cms?: StorefrontHome["sections"]["ritual"];
  tabs?: RitualTab[];
}) {
  const ritualTabs = tabs?.length ? tabs : RITUAL_TABS;
  const [active, setActive] = useState(ritualTabs[0]!.id);
  const [pending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const tab = ritualTabs.find((item) => item.id === active) ?? ritualTabs[0]!;
  const products = (catalog[tab.id] ?? []).slice(0, 3);

  const selectTab = (id: string) => {
    if (id === active) return;
    const panel = panelRef.current;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const swap = () => {
      startTransition(() => setActive(id));
      requestAnimationFrame(() => {
        if (!panel || reduced) return;
        gsap.fromTo(
          panel.querySelectorAll("[data-reveal-item], .ha-ritual__empty"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: MOTION.ritualIn, stagger: MOTION.ritualChildStagger, ease: "power2.out" },
        );
      });
    };

    if (!panel || reduced) {
      swap();
      return;
    }

    gsap.to(panel, {
      opacity: 0,
      y: 8,
      duration: MOTION.ritualOut,
      ease: "power1.out",
      onComplete: () => {
        swap();
        gsap.set(panel, { opacity: 1, y: 0 });
      },
    });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % ritualTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + ritualTabs.length) % ritualTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ritualTabs.length - 1;
    else return;
    event.preventDefault();
    const target = ritualTabs[next]!;
    selectTab(target.id);
    document.getElementById(`${baseId}-tab-${target.id}`)?.focus();
  };

  return (
    <section className="ha-section ha-ritual" id="ha-bestsellers">
      <div className="ha-container">
        <SectionHeading
          eyebrow={cms?.eyebrow ?? HOME_RITUAL.eyebrow}
          lines={[cms?.line1 ?? HOME_RITUAL.lines[0], cms?.line2 ?? HOME_RITUAL.lines[1]]}
        />
        <div
          className="ha-ritual__tabs"
          role="tablist"
          aria-label="Best seller categories"
        >
          {ritualTabs.map((item, index) => (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              className="ha-ritual__tab"
              aria-selected={item.id === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={item.id === active ? 0 : -1}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="ha-ritual__panel"
          ref={panelRef}
          aria-busy={pending}
        >
          {products.length ? (
            <div
              className="ha-product-grid ha-ritual__grid ha-snap-track"
              data-reveal-row
              aria-label="Best seller products"
            >
              {products.map((product) => (
                <ProductTile
                  key={`${active}-${product.id}`}
                  product={product}
                  currency={currency}
                  showQuickAdd
                  showWishlist
                  wished={wishlistIds.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <p className="ha-ritual__empty">{cms?.empty ?? HOME_RITUAL.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}
