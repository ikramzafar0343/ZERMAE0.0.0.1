"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useActionState, useRef } from "react";

import { brandName } from "@/constants/brand";
import { FOOTER_SOCIAL } from "@/constants/site";
import type { StorefrontContent } from "@/constants/storefront";
import { subscribeNewsletterAction } from "@/features/newsletter/actions";
import { SKIN_COPY } from "@/lib/skincare-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type State = { error?: string; ok?: boolean };

const SHOP = [
  { href: "/collections/all", label: "Shop All" },
  { href: "/collections/serums", label: "Serums" },
  { href: "/collections/creams", label: "Creams" },
  { href: "/collections/cleansers", label: "Cleansers" },
];

const EXPLORE = [
  { href: "/about-us", label: "Our Story" },
  { href: "/about-us", label: "Journal" },
  { href: "/collections/body", label: "Body Care" },
];

const HELP = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({ content }: { content: StorefrontContent }) {
  const root = useRef<HTMLElement>(null);
  const [state, action, pending] = useActionState(async (_prev: State, formData: FormData) => {
    return subscribeNewsletterAction(formData);
  }, {});

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.querySelectorAll("[data-footer-reveal]"),
        { yPercent: 20, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        },
      );
    },
    { scope: root },
  );

  const social = [
    { label: "Instagram", href: content.socialInstagram || FOOTER_SOCIAL[1]?.href || "#" },
    { label: "Facebook", href: content.socialFacebook || FOOTER_SOCIAL[0]?.href || "#" },
    { label: "Pinterest", href: content.socialPinterest || FOOTER_SOCIAL[2]?.href || "#" },
  ];

  return (
    <footer ref={root} className="skin-footer" id="skin-footer">
      <div className="skin-shell">
        <div className="skin-footer__intro" data-footer-reveal>
          <h2>{SKIN_COPY.footerHeading}</h2>
          <Link href={SKIN_COPY.footerCtaHref} className="skin-btn skin-btn--ghost">
            {SKIN_COPY.footerCta}
          </Link>
        </div>

        <div className="skin-footer__cols" data-footer-reveal>
          <div>
            <h3>Shop</h3>
            {SHOP.map((link) => (
              <Link key={link.href + link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Explore</h3>
            {EXPLORE.map((link) => (
              <Link key={link.href + link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Help</h3>
            {HELP.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Follow</h3>
            {social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ))}
            <form action={action} className="skin-newsletter" noValidate>
              <label className="sr-only" htmlFor="skin-newsletter-email">
                Email
              </label>
              <input
                id="skin-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                disabled={pending}
              />
              <button type="submit" disabled={pending}>
                Join
              </button>
            </form>
            {state.error ? <p role="alert">{state.error}</p> : null}
            {state.ok ? <p>Subscribed. Thank you.</p> : null}
          </div>
        </div>

        <p className="skin-footer__mark" data-footer-reveal>
          {brandName}
        </p>

        <div className="skin-footer__legal">
          <span>
            © {new Date().getFullYear()} {brandName}
          </span>
          <span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
