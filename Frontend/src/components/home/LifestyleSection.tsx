import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_LIFESTYLE } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export function LifestyleSection({
  cms,
}: {
  cms?: StorefrontHome["sections"]["lifestyle"];
}) {
  const beforeSrc = cms?.beforeSrc || cms?.posterSrc || MEDIA.lifestylePoster.src;
  const afterSrc = cms?.afterSrc || MEDIA.mosaicLeft.src;
  const hasSlider = Boolean(beforeSrc && afterSrc);
  const heading = cms?.heading ?? HOME_LIFESTYLE.heading;

  return (
    <section className="ha-lifestyle ha-lifestyle--compare" aria-label="Radiant skin comparison">
      <div className="ha-lifestyle__compare">
        <div className="ha-container">
          <SectionHeading
            className="ha-lifestyle__heading-block"
            eyebrow={cms?.eyebrow ?? HOME_LIFESTYLE.eyebrow}
            lines={[heading]}
          />
          {hasSlider ? <BeforeAfterSlider beforeSrc={beforeSrc} afterSrc={afterSrc} /> : null}
        </div>
      </div>
    </section>
  );
}
