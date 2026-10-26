"use client";

import { useEffect, useRef } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_REVIEWS, HOME_STORIES, type HomeReview } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

function ReviewCard({ review }: { review: HomeReview }) {
  return (
    <article className="ha-review-card" tabIndex={0}>
      <h3 className="ha-review-card__title">{review.title}</h3>
      <p className="ha-review-card__body">{review.body}</p>
      <div className="ha-review-card__footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={review.avatar} alt="" className="ha-review-card__avatar" />
        <div>
          <p className="ha-review-card__name">{review.name}</p>
          <p className="ha-review-card__context">{review.context}</p>
        </div>
      </div>
      <span className="ha-review-card__quote" aria-hidden="true">
        ”
      </span>
    </article>
  );
}

export function CustomerStories({ cms }: { cms?: StorefrontHome["sections"]["stories"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reviews = (cms?.reviews?.length ? cms.reviews : HOME_REVIEWS) as HomeReview[];
  // Pad to 6 with clones + unique ids so lane siblings never share a React key.
  const padded: HomeReview[] = reviews.slice(0, 6).map((review, index) => ({
    ...review,
    id: `${review.id}-${index}`,
  }));
  while (padded.length < 6) {
    const source = reviews[padded.length % Math.max(1, reviews.length)] ?? HOME_REVIEWS[0]!;
    padded.push({ ...source, id: `${source.id}-pad-${padded.length}` });
  }
  const lanes = [
    { id: "left", start: "0.66", reviews: [padded[0]!, padded[3]!] },
    { id: "center", start: "1.10", reviews: [padded[1]!, padded[4]!] },
    { id: "right", start: "0.76", reviews: [padded[2]!, padded[5]!] },
  ] as const;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".ha-review-card")) return;
      if (section.dataset.storiesMode === "pinned") {
        section.dataset.storiesMode = "reading";
        section.dispatchEvent(new CustomEvent("ha-stories-reading", { bubbles: true }));
      }
    };

    section.addEventListener("focusin", onFocusIn);
    return () => section.removeEventListener("focusin", onFocusIn);
  }, []);

  return (
    <section className="ha-stories stories-section" ref={sectionRef}>
      <div className="ha-stories-stage stories-stage">
        <div className="ha-stories-stage__intro">
          <SectionHeading
            eyebrow={cms?.eyebrow ?? HOME_STORIES.eyebrow}
            lines={[cms?.line1 ?? HOME_STORIES.lines[0], cms?.line2 ?? HOME_STORIES.lines[1]]}
          />
        </div>
        <div className="ha-stories-stage__product" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cms?.compositionSrc || MEDIA.storiesComposition.src} alt="" />
        </div>
        <div className="ha-stories-lanes">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="ha-stories-lane"
              data-story-lane
              data-lane={lane.id}
              data-lane-start={lane.start}
            >
              {lane.reviews.map((review, index) => (
                <ReviewCard key={`${lane.id}-${review.id}-${index}`} review={review} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
