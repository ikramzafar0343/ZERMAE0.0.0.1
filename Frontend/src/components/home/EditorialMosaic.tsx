import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { HOME_MOSAIC } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export function EditorialMosaic({
  panelImage,
  cms,
}: {
  panelImage?: string | undefined;
  cms?: StorefrontHome["sections"]["mosaic"];
}) {
  const eyebrow = cms?.eyebrow ?? HOME_MOSAIC.eyebrow;
  const lines = [cms?.line1 ?? HOME_MOSAIC.lines[0], cms?.line2 ?? HOME_MOSAIC.lines[1]] as const;
  return (
    <section className="ha-section ha-mosaic" id="ha-mosaic">
      <div className="ha-container-wide">
        <SectionHeading className="ha-mosaic__heading" eyebrow={eyebrow} lines={lines} />
        <div className="ha-mosaic__gap" aria-hidden="true" />
        <div className="ha-mosaic-grid" data-reveal-row aria-label="Shop the collection mosaic">
          <div className="ha-mosaic__left" data-reveal-item>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cms?.leftSrc || MEDIA.mosaicLeft.src}
              alt="Serum drop applied near the face"
              className="ha-media-fill"
              style={{ objectPosition: MEDIA.mosaicLeft.objectPosition }}
              loading="lazy"
            />
            <div className="ha-mosaic__panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={panelImage || MEDIA.collection[0]} alt="" />
              <div>
                <h3>{cms?.panelHeading ?? HOME_MOSAIC.panelHeading}</h3>
                <p>{cms?.panelBody ?? HOME_MOSAIC.panelBody}</p>
              </div>
            </div>
          </div>
          <div className="ha-mosaic__right">
            <div className="ha-mosaic__right-tile" data-reveal-item>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cms?.rangeSrc || MEDIA.mosaicRange.src}
                alt="Skincare range on a cool surface"
                className="ha-media-fill"
                style={{ objectPosition: MEDIA.mosaicRange.objectPosition }}
                loading="lazy"
              />
              <div className="ha-mosaic__caption">
                <h3>
                  {(cms?.upperCaptionHeading ?? HOME_MOSAIC.upperCaptionHeading).split(" ").slice(0, 1).join(" ")}
                  <br />
                  {(cms?.upperCaptionHeading ?? HOME_MOSAIC.upperCaptionHeading).split(" ").slice(1).join(" ")}
                </h3>
                <p>{cms?.upperCaptionBody ?? HOME_MOSAIC.upperCaptionBody}</p>
              </div>
            </div>
            <div className="ha-mosaic__right-tile" data-reveal-item>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cms?.detailSrc || MEDIA.mosaicDetail.src}
                alt="Close portrait with serum pipette"
                className="ha-media-fill"
                style={{ objectPosition: MEDIA.mosaicDetail.objectPosition }}
                loading="lazy"
              />
              <div className="ha-mosaic__caption">
                <h3>
                  {(cms?.lowerCaptionHeading ?? HOME_MOSAIC.lowerCaptionHeading).split(" ").slice(0, 2).join(" ")}
                  <br />
                  {(cms?.lowerCaptionHeading ?? HOME_MOSAIC.lowerCaptionHeading).split(" ").slice(2).join(" ")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
