"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode,useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function EditorialReveal({
  children,
  start = "top 82%",
}: {
  children: ReactNode;
  start?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !root.current) return;
      gsap.fromTo(
        root.current.querySelectorAll(".reveal-item"),
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start, once: true },
        },
      );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
