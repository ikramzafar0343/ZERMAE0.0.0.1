"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode,useRef } from "react";

import { MOTION } from "@/lib/motion/motionTokens";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomepageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      let disposed = false;
      let refreshFrame = 0;
      let storiesCleanup: (() => void) | undefined;

      const refreshLayout = () => {
        if (disposed) return;
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const header = document.querySelector<HTMLElement>("[data-float-header]");
        if (header && header.getBoundingClientRect().top >= 0) {
          gsap.from(header, {
            y: -12,
            opacity: 0,
            duration: MOTION.headerIn.duration,
            ease: "power2.out",
            clearProps: "transform",
          });
        }

        const titleLines = element.querySelectorAll<HTMLElement>("[data-hero-title] span");
        if (titleLines.length) {
          gsap.from(titleLines, {
            y: MOTION.heroTitle.y,
            opacity: 0,
            duration: MOTION.heroTitle.duration,
            stagger: MOTION.heroTitle.stagger,
            ease: "power3.out",
          });
        }

        const support = element.querySelectorAll("[data-hero-support], [data-hero-cta]");
        if (support.length) {
          gsap.from(support, {
            y: MOTION.heroSupport.y,
            opacity: 0,
            duration: MOTION.heroSupport.duration,
            delay: MOTION.heroSupport.delay,
            ease: "power3.out",
          });
        }

        const tile = element.querySelector("[data-hero-tile]");
        if (tile) {
          gsap.from(tile, {
            y: MOTION.heroTile.y,
            opacity: 0,
            duration: MOTION.heroTile.duration,
            delay: 0.2,
            ease: "power3.out",
          });
        }

        const scrollCue = element.querySelector<HTMLElement>("[data-hero-scroll]");
        if (scrollCue) {
          gsap.to(scrollCue, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top top",
              end: "+=120",
              scrub: true,
            },
          });
        }

        element.querySelectorAll<HTMLElement>("[data-parallax-shell]").forEach((shell) => {
          const media = shell.querySelector("img, video");
          if (!media) return;
          gsap.fromTo(
            media,
            { y: -24 },
            {
              y: 24,
              ease: "none",
              scrollTrigger: {
                trigger: shell.closest("section") ?? shell,
                start: "top bottom",
                end: "bottom top",
                scrub: MOTION.parallaxScrub,
              },
            },
          );
        });

        // Card images: zoomed-in while approaching, ease out to natural scale in view
        const zoomImages = element.querySelectorAll<HTMLElement>(
          [
            ".ha-product-tile__media img",
            ".ha-mini-tile__thumb img",
            ".ha-mosaic__left > img",
            ".ha-mosaic__right-tile > img",
            ".ha-social__card > img",
            ".ha-journal__card img",
            ".ha-review-card img",
            "[data-reveal-item] img",
          ].join(", "),
        );

        const zoomed = new Set<HTMLElement>();
        zoomImages.forEach((media) => {
          if (zoomed.has(media)) return;
          zoomed.add(media);
          const clip =
            media.closest<HTMLElement>(
              ".ha-product-tile__media, .ha-mini-tile__thumb, .ha-mosaic__left, .ha-mosaic__right-tile, .ha-social__card, .ha-journal__media, .ha-journal__card, [data-reveal-item], .ha-review-card",
            ) ?? media.parentElement;
          if (!clip) return;
          clip.classList.add("ha-zoom-clip");
          media.classList.add("ha-zoom-media");
          gsap.fromTo(
            media,
            { scale: MOTION.imageZoom.from, transformOrigin: "50% 50%" },
            {
              scale: MOTION.imageZoom.to,
              ease: "none",
              scrollTrigger: {
                trigger: clip,
                start: "top 92%",
                end: "top 42%",
                scrub: MOTION.imageZoom.scrub,
              },
            },
          );
        });

        element.querySelectorAll<HTMLElement>("[data-section-intro]").forEach((intro) => {
          if (intro.getBoundingClientRect().top < 0) return;
          if (intro.closest(".ha-hero")) return;
          gsap.from(intro, {
            y: 22,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: intro, start: "top 86%", once: true },
          });
        });

        element.querySelectorAll<HTMLElement>("[data-reveal-row]").forEach((row) => {
          if (row.getBoundingClientRect().top < 0) return;
          const items = row.querySelectorAll("[data-reveal-item]");
          if (!items.length) return;
          gsap.from(items, {
            y: 28,
            opacity: 0,
            duration: MOTION.cardRow.duration,
            stagger: MOTION.cardRow.stagger,
            ease: MOTION.cardRow.ease,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          });
        });

        const footer = element.querySelector("#site-footer, .site-footer, .ha-footer");
        if (footer) {
          gsap.from(footer, {
            y: 10,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: footer, start: "top 94%", once: true },
          });
        }
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = element.querySelector<HTMLElement>(".stories-section");
        const stage = element.querySelector<HTMLElement>(".stories-stage");
        if (!section || !stage) return;

        const enablePinned = () => {
          section.dataset.storiesMode = "pinned";
          const lanes = stage.querySelectorAll<HTMLElement>("[data-story-lane]");
          const scene = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              pin: stage,
              start: "top top",
              end: () => `+=${Math.round(stage.clientHeight * 2.4)}`,
              scrub: MOTION.storyScrub,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          lanes.forEach((lane) => {
            scene.fromTo(
              lane,
              { y: () => stage.clientHeight * Number(lane.dataset.laneStart) },
              { y: () => -(lane.scrollHeight + 24), duration: 1 },
              0,
            );
          });

          return () => {
            scene.scrollTrigger?.kill();
            scene.kill();
            delete section.dataset.storiesMode;
            gsap.set(lanes, { clearProps: "transform" });
          };
        };

        let pinCleanup: (() => void) | undefined = enablePinned();

        const onReading = () => {
          pinCleanup?.();
          pinCleanup = undefined;
          section.dataset.storiesMode = "reading";
          refreshLayout();
        };

        section.addEventListener("ha-stories-reading", onReading);
        storiesCleanup = () => {
          section.removeEventListener("ha-stories-reading", onReading);
          pinCleanup?.();
          delete section.dataset.storiesMode;
        };

        return () => {
          storiesCleanup?.();
          storiesCleanup = undefined;
        };
      });

      const images = Array.from(element.querySelectorAll("img"));
      const pendingImages = images.filter((image) => !image.complete);
      pendingImages.forEach((image) => {
        image.addEventListener("load", refreshLayout);
        image.addEventListener("error", refreshLayout);
      });
      void document.fonts.ready.then(refreshLayout);
      refreshLayout();

      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        storiesCleanup?.();
        pendingImages.forEach((image) => {
          image.removeEventListener("load", refreshLayout);
          image.removeEventListener("error", refreshLayout);
        });
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="home-aurelle">
      {children}
    </div>
  );
}
