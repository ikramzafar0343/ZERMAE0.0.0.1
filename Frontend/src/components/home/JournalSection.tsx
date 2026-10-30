import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { CmsImage } from "@/features/media/cms-image";
import { HOME_JOURNAL, HOME_JOURNAL_ITEMS } from "@/lib/content/homepage";

export function JournalSection({
  cms,
}: {
  products?: unknown;
  currency?: string;
  cms?: StorefrontHome["sections"]["journal"];
}) {
  const rawCta = cms?.ctaHref?.trim() || "";
  const ctaHref =
    !rawCta || rawCta === "#ha-journal" || rawCta === "/#ha-journal" || rawCta.endsWith("#ha-journal")
      ? HOME_JOURNAL.ctaHref
      : rawCta;
  const cards = (cms?.articles?.length ? cms.articles : HOME_JOURNAL_ITEMS)
    .filter((item) => item.src?.trim())
    .slice(0, 3);

  return (
    <section className="ha-journal" id="ha-journal">
      <div className="ha-container" style={{ textAlign: "center" }}>
        <SectionHeading
          eyebrow={cms?.eyebrow ?? HOME_JOURNAL.eyebrow}
          lines={[cms?.line1 ?? HOME_JOURNAL.lines[0], cms?.line2 ?? HOME_JOURNAL.lines[1]]}
        />
        <Link href={ctaHref} className="ha-btn ha-journal__cta">
          {cms?.ctaLabel ?? HOME_JOURNAL.ctaLabel}
        </Link>
        {cards.length > 0 ? (
          <div className="ha-journal__grid ha-snap-track" data-reveal-row aria-label="Beauty insights">
            {cards.map((item) => {
              const href = item.href?.trim() || ctaHref;
              return (
                <Link key={item.id} href={href} className="ha-journal__card" data-reveal-item>
                  <div className="ha-journal__media ha-media-clip">
                    <CmsImage
                      src={item.src}
                      alt={item.alt || item.title || "Insight"}
                      fill
                      className="ha-media-fill"
                      sizes="(max-width: 1023px) 80vw, 28vw"
                      loading="lazy"
                    />
                  </div>
                  {item.title?.trim() ? (
                    <div className="ha-journal__meta">
                      <span className="ha-journal__title">{item.title}</span>
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
