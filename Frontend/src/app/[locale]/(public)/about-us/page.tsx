import Image from "next/image";
import Link from "next/link";

import { brandName, brandTagline } from "@/constants/brand";
import { getStorefront } from "@/lib/storefront";

export default async function AboutPage() {
  const storefront = await getStorefront();
  const about = storefront.content.pageTemplates.about;
  return (
    <div className="info-page">
      <div className="mx-auto max-w-[1600px] px-6 md:px-20">
        <div className="info-page-shell">
          <figure className="ritual-still ritual-still--framed">
            <Image
              src={about.imageSrc}
              alt={about.imageAlt}
              width={304}
              height={637}
              sizes="12rem"
              className="ritual-still-image"
            />
          </figure>
          <div>
            <header className="section-intro">
              <span className="section-intro-eyebrow">{about.eyebrow || "The Brand"}</span>
              <h1 className="section-intro-title">About {brandName}</h1>
              <p className="section-intro-description">{brandTagline}</p>
            </header>
            <div className="info-page-content">
              <p>{about.copy || storefront.content.aboutCopy}</p>
              <div className="info-page-actions">
                <Link href={about.ctaHref || "/collections/all"} className="luxury-button-outline">
                  {about.ctaLabel || "Shop The Ritual"}
                </Link>
                <Link href="/contact" className="luxury-button-solid">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
