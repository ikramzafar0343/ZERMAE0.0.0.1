"use client";

import Link from "next/link";

import { brandHomeLabel, brandName } from "@/constants/brand";
import { FOOTER_SOCIAL } from "@/constants/site";
import type { StorefrontContent } from "@/constants/storefront";
import { MEDIA } from "@/lib/content/media-manifest";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/collections/all", label: "Products" },
  { href: "/collections/all", label: "Shop" },
  { href: "/collections/serums", label: "Collection" },
  { href: "/about-us", label: "Blog" },
];

const CATEGORIES = [
  { href: "/collections/all", label: "All Products" },
  { href: "/collections/cleansers", label: "Cleansers" },
  { href: "/collections/creams", label: "Lotion" },
  { href: "/collections/creams", label: "Moisturizers" },
];

const SUPPORT = [
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping and delivery" },
  { href: "/returns", label: "Orders and return" },
];

export function HomeFooter({ content }: { content: StorefrontContent }) {
  const statement = "Naturally scientific skincare for radiant, healthy skin.";

  const social = [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com" },
    { id: "twitter", label: "Twitter", href: "https://twitter.com" },
    {
      id: "instagram",
      label: "Instagram",
      href: content.socialInstagram || FOOTER_SOCIAL[1]?.href || "https://instagram.com/zermae",
    },
  ];

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="ha-footer">
      <div className="ha-container-footer">
        <div className="ha-footer__grid">
          <div className="ha-footer__brand">
            <Link href="/" aria-label={brandHomeLabel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MEDIA.wordmark.src} alt="" height={26} />
            </Link>
            <p className="ha-footer__statement">{statement}</p>
            <div className="ha-footer__social">
              {social.map((item) => (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="ha-footer__group">
            <h3 className="ha-eyebrow">
              Navigate
              <span className="ha-eyebrow__mark" aria-hidden="true" />
            </h3>
            {NAV.map((link) => (
              <Link key={`nav-${link.label}`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ha-footer__group">
            <h3 className="ha-eyebrow">
              Categories
              <span className="ha-eyebrow__mark" aria-hidden="true" />
            </h3>
            {CATEGORIES.map((link) => (
              <Link key={`cat-${link.label}`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="ha-footer__group">
            <h3 className="ha-eyebrow">
              Support
              <span className="ha-eyebrow__mark" aria-hidden="true" />
            </h3>
            {SUPPORT.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="ha-footer__legal">
          <p className="ha-footer__copy">© {new Date().getFullYear()} {brandName}</p>
          <div className="ha-footer__legal-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <button type="button" className="ha-footer__top" aria-label="Back to top" onClick={toTop}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
