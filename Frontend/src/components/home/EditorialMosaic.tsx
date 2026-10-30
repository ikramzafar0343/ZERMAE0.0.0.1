import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { CmsImage } from "@/features/media/cms-image";
import { HOME_MOSAIC } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export function EditorialMosaic({
  panelImage,
  cms,
}: {
  panelImage?: string | undefined;
  cms?: StorefrontHome["sections"]["mosaic"];
}) {
  const rawEyebrow = (cms?.eyebrow ?? HOME_MOSAIC.eyebrow).trim();
  const eyebrow =
    !rawEyebrow || rawEyebrow.toLowerCase() === "shop the collection" ? "" : rawEyebrow;
  const line1 = (cms?.line1 ?? "").trim();
  const line2 = (cms?.line2 ?? "").trim();
  const useDefaultHeading =
    !line1 ||
    line1 === "Luxury formulated," ||
    line1 === "The Zermae" ||
    Boolean(line2);
  const lines = useDefaultHeading
    ? HOME_MOSAIC.lines
    : ([line1] as const);
  return (
    <section className="ha-section ha-mosaic" id="ha-mosaic">
      <div className="ha-container-wide">
        <SectionHeading className="ha-mosaic__heading" eyebrow={eyebrow} lines={lines} />
        <div className="ha-mosaic__gap" aria-hidden="true" />
        <div className="ha-mosaic-grid" data-reveal-row aria-label="Shop the collection mosaic">
          <div className="ha-mosaic__left" data-reveal-item>
            <CmsImage
              src={cms?.leftSrc || MEDIA.mosaicLeft.src}
              alt="Serum drop applied near the face"
              fill
              className="ha-media-fill"
              style={{ objectPosition: MEDIA.mosaicLeft.objectPosition }}
              sizes="(max-width: 1023px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="ha-mosaic__panel">
              <CmsImage
                src={panelImage || MEDIA.collection[0]}
                alt=""
                width={160}
                height={200}
                sizes="120px"
                loading="lazy"
              />
              <div>
                <h3>{cms?.panelHeading ?? HOME_MOSAIC.panelHeading}</h3>
                <p>{cms?.panelBody ?? HOME_MOSAIC.panelBody}</p>
              </div>
            </div>
          </div>
          <div className="ha-mosaic__right">
            <div className="ha-mosaic__right-tile" data-reveal-item>
              <CmsImage
                src={cms?.rangeSrc || MEDIA.mosaicRange.src}
                alt="Skincare range on a cool surface"
                fill
                className="ha-media-fill"
                style={{ objectPosition: MEDIA.mosaicRange.objectPosition }}
                sizes="(max-width: 1023px) 100vw, 40vw"
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
              <CmsImage
                src={cms?.detailSrc || MEDIA.mosaicDetail.src}
                alt="Close portrait with serum pipette"
                fill
                className="ha-media-fill"
                style={{ objectPosition: MEDIA.mosaicDetail.objectPosition }}
                sizes="(max-width: 1023px) 100vw, 40vw"
                loading="lazy"
              />
              <div className="ha-mosaic__caption">
                <h3>
                  {(cms?.lowerCaptionHeading ?? HOME_MOSAIC.lowerCaptionHeading).split(" ").slice(0, 2).join(" ")}
                  <br />
                  {(cms?.lowerCaptionHeading ?? HOME_MOSAIC.lowerCaptionHeading).split(" ").slice(2).join(" ")}
                </h3>
                <p>{cms?.lowerCaptionBody ?? HOME_MOSAIC.lowerCaptionBody}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
