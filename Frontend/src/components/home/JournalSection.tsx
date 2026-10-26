import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_JOURNAL, HOME_JOURNAL_ITEMS } from "@/lib/content/homepage";

export function JournalSection({ cms }: { cms?: StorefrontHome["sections"]["journal"] }) {
  const articles = cms?.articles?.length ? cms.articles : HOME_JOURNAL_ITEMS;
  return (
    <section className="ha-journal" id="ha-journal">
      <div className="ha-container" style={{ textAlign: "center" }}>
        <SectionHeading
          eyebrow={cms?.eyebrow ?? HOME_JOURNAL.eyebrow}
          lines={[cms?.line1 ?? HOME_JOURNAL.lines[0], cms?.line2 ?? HOME_JOURNAL.lines[1]]}
        />
        <Link href={cms?.ctaHref ?? HOME_JOURNAL.ctaHref} className="ha-btn ha-journal__cta">
          {cms?.ctaLabel ?? HOME_JOURNAL.ctaLabel}
        </Link>
        <div className="ha-journal__grid ha-snap-track" data-reveal-row aria-label="Journal articles">
          {articles.map((item) => (
            <Link key={item.id} href={item.href} className="ha-journal__card" data-reveal-item>
              <div className="ha-journal__media ha-media-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="ha-media-fill" loading="lazy" />
              </div>
              <div className="ha-journal__meta">
                <span className="ha-journal__title">{item.title}</span>
                <span className="ha-journal__date">{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
