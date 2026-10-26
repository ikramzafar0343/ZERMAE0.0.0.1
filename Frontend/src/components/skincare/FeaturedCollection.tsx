"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

import { ProductCard } from "@/components/skincare/ProductCard";
import type { FeaturedSkinProduct } from "@/lib/skincare-data";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FeaturedCollection({
  products,
  currency,
}: {
  products: FeaturedSkinProduct[];
  currency: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
      gsap.fromTo(
        root.current.querySelectorAll(".reveal-item"),
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skin-collection" id="skin-collection">
      <div className="skin-shell">
        <div className="skin-collection__head">
          <div>
            <p className="skin-eyebrow">{SKIN_COPY.collectionEyebrow}</p>
            <h2 className="skin-collection__title">{SKIN_COPY.collectionTitle}</h2>
          </div>
          <Link href="/collections/all" className="skin-link">
            {SKIN_COPY.collectionShopAll}
          </Link>
        </div>
        <div className="skin-product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  );
}
