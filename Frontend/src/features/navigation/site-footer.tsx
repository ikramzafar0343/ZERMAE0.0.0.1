import Link from "next/link";
import type { ComponentType } from "react";

import { IconFacebook, IconInstagram, IconPinterest } from "@/components/icons/icons";
import { brandName, footerSocialLabel } from "@/constants/brand";
import { FOOTER_NAV, FOOTER_SOCIAL, formatSupportPhoneDisplay, supportWhatsAppUrlFromPhone } from "@/constants/site";
import { type StorefrontContent, visibleNavLinks } from "@/constants/storefront";
type IconProps = { className?: string | undefined };

const SOCIAL_ICONS: Record<(typeof FOOTER_SOCIAL)[number]["icon"], ComponentType<IconProps>> = {
  facebook: IconFacebook,
  instagram: IconInstagram,
  pinterest: IconPinterest,
};

function SocialBlob({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path
        d="M10 34c4-16 16-26 32-26 18 0 28 12 28 26 0 16-12 28-28 28C20 62 6 50 10 34Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter({ content }: { content: StorefrontContent }) {
  const socialHrefs: Record<string, string> = {
    facebook: content.socialFacebook,
    instagram: content.socialInstagram,
    pinterest: content.socialPinterest,
  };
  const supportDisplay = formatSupportPhoneDisplay(content.supportPhone);
  const supportWhatsApp = supportWhatsAppUrlFromPhone(content.supportPhone);
  return (
    <footer id="site-footer" className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-statement">
          <span>{content.footerStatementLead}</span>
          <span>{content.footerStatementEnd}</span>
        </p>
        <div className="site-footer-social">
          <p className="site-footer-social-label">{footerSocialLabel}</p>
          <ul className="site-footer-social-list">
            {FOOTER_SOCIAL.map((item, index) => {
              const Icon = SOCIAL_ICONS[item.icon];
              return (
                <li key={item.id}>
                  <a
                    href={socialHrefs[item.id] ?? item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`site-footer-social-link site-footer-social-link--${index + 1}`}
                    aria-label={item.label}
                  >
                    <SocialBlob className="site-footer-social-blob" />
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav className="site-footer-links" aria-label="Footer">
          {(
            [
              {
                id: "shop",
                title: "Shop",
                links: (content.menus?.footerShop?.length
                  ? content.menus.footerShop.filter((item) => !item.hidden)
                  : visibleNavLinks(content)
                ).map((item) => ({ label: item.label, href: item.path })),
              },
              {
                id: "house",
                title: "House",
                links: (content.menus?.footerHouse?.length
                  ? content.menus.footerHouse.filter((item) => !item.hidden)
                  : FOOTER_NAV.find((g) => g.id === "house")?.links ?? []
                ).map((item) =>
                  "path" in item
                    ? { label: item.label, href: (item as { path: string }).path }
                    : { label: item.label, href: item.href },
                ),
              },
              {
                id: "policies",
                title: "Policies",
                links: (content.menus?.footerPolicies?.length
                  ? content.menus.footerPolicies.filter((item) => !item.hidden)
                  : FOOTER_NAV.find((g) => g.id === "policies")?.links ?? []
                ).map((item) =>
                  "path" in item
                    ? { label: item.label, href: (item as { path: string }).path }
                    : { label: item.label, href: item.href },
                ),
              },
            ] as const
          ).map((group) => {
            if (group.links.length === 0) {
              return null;
            }
            return (
              <div key={group.id} className="site-footer-link-group">
                <p className="site-footer-link-title">{group.title}</p>
                <ul className="site-footer-link-list">
                  {group.links.map((link) => (
                    <li key={`${group.id}-${link.href}`}>
                      <Link href={link.href} className="site-footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
        <p className="site-footer-social-label">
          WhatsApp{" "}
          <a href={supportWhatsApp} className="site-footer-link" target="_blank" rel="noreferrer">
            {supportDisplay}
          </a>
        </p>
      </div>
      <p className="site-footer-mark" aria-hidden="true">
        {brandName.toUpperCase()}
      </p>
    </footer>
  );
}
