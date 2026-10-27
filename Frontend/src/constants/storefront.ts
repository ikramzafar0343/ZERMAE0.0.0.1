import type { CSSProperties } from "react";

import {
  brandStoryEnd,
  brandStoryLead,
  brandStoryMid,
  brandStoryPortraitSrc,
  brandStoryPrimarySrc,
  brandStorySecondarySrc,
  footerStatementEnd,
  footerStatementLead,
  heroHeadline,
  heroProductAlt,
  heroProductSrc,
  heroSupport,
} from "@/constants/brand";
import {
  AUTH_BANNERS,
  BEST_SELLERS,
  COLLECTION_HEROES,
  FEATURES,
  FOOTER_SOCIAL,
  GLOW_STATS_IMAGE,
  HOME_FAQ,
  HOME_FAQ_IMAGE,
  HOME_FAQ_IMAGE_ALT,
  NAV_ITEMS,
  PRODUCT_HIGHLIGHTS_IMAGE,
  SHOP_RANGE_CATEGORIES,
  SUPPORT_PHONE_LOCAL,
} from "@/constants/site";
import {
  buildDefaultBrand,
  buildDefaultCollectionPages,
  buildDefaultHome,
  buildDefaultMenus,
  buildDefaultPageTemplates,
  HOME_SECTION_IDS,
  type HomeSectionId,
  type StorefrontBrand,
  type StorefrontCollectionPage,
  type StorefrontHome,
  type StorefrontMenus,
  type StorefrontPageTemplates,
} from "@/constants/storefront-cms";

export type {
  HomeSectionId,
  StorefrontBrand,
  StorefrontCollectionPage,
  StorefrontHome,
  StorefrontMenus,
  StorefrontPageTemplates,
} from "@/constants/storefront-cms";
export { HOME_SECTION_IDS, HOME_SECTION_LABELS, shopCategoriesAsRitualTabs } from "@/constants/storefront-cms";

export type StorefrontTheme = {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  mint: string;
  blush: string;
};

export type StorefrontFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type StorefrontFeature = {
  title: string;
  description: string;
  icon: string;
};

export type StorefrontCollectionTitle = {
  first: string;
  second: string;
};

export type StorefrontNavLink = {
  id: string;
  label: string;
  path: string;
  hidden: boolean;
};

export type StorefrontShopCategory = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  icon: string;
  color: string;
  hidden: boolean;
};

export const SHOP_CATEGORY_ICONS = ["flower", "drop", "dropper", "leaf", "sparkle"] as const;

export type StorefrontContent = {
  heroHeadline: string;
  heroSupport: string;
  heroProductSrc: string;
  heroProductAlt: string;
  brandStoryPrimarySrc: string;
  brandStorySecondarySrc: string;
  brandStoryPortraitSrc: string;
  brandStoryLead: string;
  brandStoryMid: string;
  brandStoryEnd: string;
  productHighlightsImage: string;
  glowStatsImage: string;
  faqImage: string;
  faqImageAlt: string;
  faqItems: StorefrontFaqItem[];
  features: StorefrontFeature[];
  footerStatementLead: string;
  footerStatementEnd: string;
  socialFacebook: string;
  socialInstagram: string;
  socialPinterest: string;
  aboutCopy: string;
  contactLead: string;
  /** Shop WhatsApp / contact phone (local or E.164). */
  supportPhone: string;
  /** When true, public shop shows only the maintenance splash. */
  maintenanceMode: boolean;
  /** Full-screen message shown while maintenanceMode is on. */
  maintenanceMessage: string;
  /** Order/contact From header, e.g. Zermae <info@zermae.com>. SMTP stays in env. */
  emailFrom: string;
  authLoginSrc: string;
  authRegisterSrc: string;
  authAdminSrc: string;
  shopImages: Record<string, string>;
  shopCardColors: Record<string, string>;
  collectionImages: Record<string, string>;
  collectionTitles: Record<string, StorefrontCollectionTitle>;
  bestSellerSkus: string[];
  bestSellerColors: string[];
  heroStageColor: string;
  productCardColors: string[];
  navLinks: StorefrontNavLink[];
  shopCategories: StorefrontShopCategory[];
  /** Shopify-style brand / logo */
  brand: StorefrontBrand;
  /** Header + footer menus */
  menus: StorefrontMenus;
  /** Ordered home sections with hide/edit */
  home: StorefrontHome;
  /** About / Contact / FAQ / Legal */
  pageTemplates: StorefrontPageTemplates;
  /** Per-collection heroes + ritual blocks */
  collectionPages: Record<string, StorefrontCollectionPage>;
};

export const DEFAULT_STOREFRONT_THEME: StorefrontTheme = {
  bg: "#ffffff",
  primary: "#303531",
  secondary: "#70766f",
  accent: "#eaa36d",
  mint: "#ecf2f2",
  blush: "#fce9e2",
};

export const DEFAULT_NAV_LINKS: StorefrontNavLink[] = NAV_ITEMS.map((item) => ({
  id: item.id,
  label: item.label,
  path: item.path,
  hidden: false,
}));

export const DEFAULT_SHOP_CATEGORIES: StorefrontShopCategory[] = SHOP_RANGE_CATEGORIES.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  href: item.href,
  image: item.image,
  alt: item.alt,
  icon: item.icon,
  color: item.tone === "mint" ? DEFAULT_STOREFRONT_THEME.mint : DEFAULT_STOREFRONT_THEME.blush,
  hidden: false,
}));

export const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  heroHeadline,
  heroSupport,
  heroProductSrc,
  heroProductAlt,
  brandStoryPrimarySrc,
  brandStorySecondarySrc,
  brandStoryPortraitSrc,
  brandStoryLead,
  brandStoryMid,
  brandStoryEnd,
  productHighlightsImage: PRODUCT_HIGHLIGHTS_IMAGE,
  glowStatsImage: GLOW_STATS_IMAGE,
  faqImage: HOME_FAQ_IMAGE,
  faqImageAlt: HOME_FAQ_IMAGE_ALT,
  faqItems: HOME_FAQ.map((item) => ({ id: item.id, question: item.question, answer: item.answer })),
  features: FEATURES.map((item) => ({ title: item.title, description: item.description, icon: item.icon })),
  footerStatementLead,
  footerStatementEnd,
  socialFacebook: FOOTER_SOCIAL.find((item) => item.id === "facebook")?.href ?? "https://facebook.com/zermae",
  socialInstagram: FOOTER_SOCIAL.find((item) => item.id === "instagram")?.href ?? "https://instagram.com/zermae",
  socialPinterest: FOOTER_SOCIAL.find((item) => item.id === "pinterest")?.href ?? "https://pinterest.com/zermae",
  aboutCopy:
    "From serums and creams to cleansers and body treatments, Zermae is designed for people who want considered products, honest language, and a routine that stays simple.",
  contactLead:
    "We would love to hear from you — whether you have a question about an order, a formula, or your daily routine.",
  supportPhone: SUPPORT_PHONE_LOCAL,
  maintenanceMode: false,
  maintenanceMessage: "Coming Soon",
  emailFrom: "Zermae <info@zermae.com>",
  authLoginSrc: AUTH_BANNERS.login.src,
  authRegisterSrc: AUTH_BANNERS.register.src,
  authAdminSrc: AUTH_BANNERS.adminLogin.src,
  shopCategories: DEFAULT_SHOP_CATEGORIES,
  shopImages: Object.fromEntries(DEFAULT_SHOP_CATEGORIES.map((item) => [item.id, item.image])),
  shopCardColors: Object.fromEntries(DEFAULT_SHOP_CATEGORIES.map((item) => [item.id, item.color])),
  collectionImages: Object.fromEntries(Object.entries(COLLECTION_HEROES).map(([key, value]) => [key, value.image])),
  collectionTitles: Object.fromEntries(
    Object.entries(COLLECTION_HEROES).map(([key, value]) => [key, { first: value.first, second: value.second }]),
  ),
  bestSellerSkus: BEST_SELLERS.map((item) => item.sku),
  bestSellerColors: BEST_SELLERS.map((item) =>
    item.tone === "mint" ? DEFAULT_STOREFRONT_THEME.mint : DEFAULT_STOREFRONT_THEME.blush,
  ),
  heroStageColor: DEFAULT_STOREFRONT_THEME.mint,
  productCardColors: [DEFAULT_STOREFRONT_THEME.blush, DEFAULT_STOREFRONT_THEME.mint, "#efe4ee"],
  navLinks: DEFAULT_NAV_LINKS,
  brand: buildDefaultBrand(),
  menus: buildDefaultMenus(),
  home: buildDefaultHome(),
  pageTemplates: buildDefaultPageTemplates(
    "From serums and creams to cleansers and body treatments, Zermae is designed for people who want considered products, honest language, and a routine that stays simple.",
    "We would love to hear from you — whether you have a question about an order, a formula, or your daily routine.",
    SUPPORT_PHONE_LOCAL,
    HOME_FAQ.map((item) => ({ id: item.id, question: item.question, answer: item.answer })),
  ),
  collectionPages: buildDefaultCollectionPages(),
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asHex(value: unknown, fallback: string): string {
  const text = String(value ?? "").trim();
  return /^#[0-9A-Fa-f]{6}$/.test(text) ? text : fallback;
}

function asText(value: unknown, fallback: string): string {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : fallback;
}

/** Missing/null → fallback. Explicit empty string is kept so CMS clears persist. */
function asStoredText(value: unknown, fallback: string): string {
  if (value === undefined || value === null) {
    return fallback;
  }
  return String(value).trim();
}

function asImageMap(value: unknown, fallback: Record<string, string>): Record<string, string> {
  const record = asRecord(value);
  const next = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
      continue;
    }
    next[key] = String(record[key] ?? "").trim();
  }
  return next;
}

function asHexMap(value: unknown, fallback: Record<string, string>): Record<string, string> {
  const record = asRecord(value);
  const next = { ...fallback };
  for (const key of Object.keys(fallback)) {
    next[key] = asHex(record[key], fallback[key] ?? DEFAULT_STOREFRONT_THEME.blush);
  }
  return next;
}

function asHexList(value: unknown, fallback: string[]): string[] {
  const source = Array.isArray(value) ? value : [];
  return fallback.map((item, index) => asHex(source[index], item));
}

function asBool(value: unknown): boolean {
  return value === true || value === "on" || value === "true" || value === 1;
}

function asPath(value: unknown, fallback: string): string {
  const text = String(value ?? "").trim();
  if (!text.startsWith("/") || text.startsWith("//") || /[\s<>'"`]/.test(text)) {
    return fallback;
  }
  return text.slice(0, 160);
}

function asIcon(value: unknown, fallback: string): string {
  const text = String(value ?? "").trim();
  return (SHOP_CATEGORY_ICONS as readonly string[]).includes(text) ? text : fallback;
}

function asNavLinks(value: unknown): StorefrontNavLink[] {
  if (!Array.isArray(value)) {
    return DEFAULT_NAV_LINKS;
  }
  return value.slice(0, 12).map((item, index) => {
    const record = asRecord(item);
    const fallback = DEFAULT_NAV_LINKS[index] ?? { id: `nav-${index + 1}`, label: "Shop", path: "/collections/all", hidden: false };
    return {
      id: asText(record.id, `${fallback.id}-${index + 1}`),
      label: asText(record.label, fallback.label),
      path: asPath(record.path, fallback.path),
      hidden: asBool(record.hidden),
    };
  }).filter((item) => item.label && item.path);
}

function asShopCategories(
  value: unknown,
  images: Record<string, string>,
  colors: Record<string, string>,
): StorefrontShopCategory[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SHOP_CATEGORIES.map((item) => ({
      ...item,
      image: images[item.id] || item.image,
      color: colors[item.id] || item.color,
    }));
  }
  return value.slice(0, 8).map((item, index) => {
    const record = asRecord(item);
    const fallback = DEFAULT_SHOP_CATEGORIES[index] ?? DEFAULT_SHOP_CATEGORIES[0]!;
    const id = asText(record.id, `${fallback.id}-${index + 1}`);
    const imageRaw = record.image;
    const image =
      imageRaw === undefined || imageRaw === null
        ? images[id] || fallback.image
        : String(imageRaw).trim();
    return {
      id,
      title: asStoredText(record.title, fallback.title),
      description: asStoredText(record.description, fallback.description),
      href: asPath(record.href, fallback.href),
      image,
      alt: asStoredText(record.alt, fallback.alt),
      icon: asIcon(record.icon, fallback.icon),
      color: asHex(record.color, colors[id] || fallback.color),
      hidden: asBool(record.hidden),
    };
  }).filter((item) => item.title && item.href);
}

export function resolveStorefrontTheme(raw: unknown): StorefrontTheme {
  const record = asRecord(raw);
  return {
    bg: asHex(record.bg, DEFAULT_STOREFRONT_THEME.bg),
    primary: asHex(record.primary, DEFAULT_STOREFRONT_THEME.primary),
    secondary: asHex(record.secondary, DEFAULT_STOREFRONT_THEME.secondary),
    accent: asHex(record.accent, DEFAULT_STOREFRONT_THEME.accent),
    mint: asHex(record.mint, DEFAULT_STOREFRONT_THEME.mint),
    blush: asHex(record.blush, DEFAULT_STOREFRONT_THEME.blush),
  };
}

function asFaqItems(value: unknown): StorefrontFaqItem[] {
  const fallback = DEFAULT_STOREFRONT_CONTENT.faqItems;
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value
    .map((item, index) => {
      const record = asRecord(item);
      return {
        id: asText(record.id, fallback[index]?.id ?? `faq-${index + 1}`),
        question: asStoredText(record.question, fallback[index]?.question ?? ""),
        answer: asStoredText(record.answer, fallback[index]?.answer ?? ""),
      };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, 8);
}

function asFeatures(value: unknown): StorefrontFeature[] {
  const fallback = DEFAULT_STOREFRONT_CONTENT.features;
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value
    .map((item, index) => {
      const record = asRecord(item);
      return {
        title: asStoredText(record.title, fallback[index]?.title ?? ""),
        description: asStoredText(record.description, fallback[index]?.description ?? ""),
        icon: asText(record.icon, fallback[index]?.icon ?? "leaf"),
      };
    })
    .filter((item) => item.title && item.description)
    .slice(0, 4);
}

function asCollectionTitles(value: unknown): Record<string, StorefrontCollectionTitle> {
  const fallback = DEFAULT_STOREFRONT_CONTENT.collectionTitles;
  const record = asRecord(value);
  const next: Record<string, StorefrontCollectionTitle> = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
      continue;
    }
    const item = asRecord(record[key]);
    const current = fallback[key];
    if (!current) {
      continue;
    }
    next[key] = {
      first: asStoredText(item.first, current.first),
      second: asStoredText(item.second, current.second),
    };
  }
  return next;
}

function asMenuLinks(value: unknown, fallback: StorefrontNavLink[]): StorefrontNavLink[] {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }
  return value
    .slice(0, 16)
    .map((item, index) => {
      const record = asRecord(item);
      const base = fallback[index] ?? { id: `link-${index + 1}`, label: "Link", path: "/", hidden: false };
      return {
        id: asText(record.id, `${base.id}-${index + 1}`),
        label: asText(record.label, base.label),
        path: asPath(record.path, base.path),
        hidden: asBool(record.hidden),
      };
    })
    .filter((item) => item.label && item.path);
}

function asBrand(value: unknown): StorefrontBrand {
  const fallback = DEFAULT_STOREFRONT_CONTENT.brand;
  const record = asRecord(value);
  return {
    siteName: asStoredText(record.siteName, fallback.siteName),
    logoSrc: asStoredText(record.logoSrc, fallback.logoSrc),
    logoOnLightSrc: asStoredText(record.logoOnLightSrc, fallback.logoOnLightSrc),
  };
}

function asMenus(value: unknown, navLinks: StorefrontNavLink[]): StorefrontMenus {
  const fallback = DEFAULT_STOREFRONT_CONTENT.menus;
  const record = asRecord(value);
  const header = asMenuLinks(record.header, fallback.header);
  return {
    header: header.length ? header : fallback.header,
    footerShop: asMenuLinks(record.footerShop, navLinks.length ? navLinks : fallback.footerShop),
    footerHouse: asMenuLinks(record.footerHouse, fallback.footerHouse),
    footerPolicies: asMenuLinks(record.footerPolicies, fallback.footerPolicies),
  };
}

function deepMergeSection<T extends Record<string, unknown>>(fallback: T, raw: unknown): T {
  const record = asRecord(raw);
  const next = { ...fallback };
  for (const key of Object.keys(fallback) as (keyof T)[]) {
    if (!Object.prototype.hasOwnProperty.call(record, key as string)) {
      continue;
    }
    const current = fallback[key];
    const incoming = record[key as string];
    if (Array.isArray(current)) {
      if (Array.isArray(incoming)) {
        (next as Record<string, unknown>)[key as string] = incoming;
      }
      continue;
    }
    if (current && typeof current === "object") {
      continue;
    }
    if (typeof current === "boolean") {
      (next as Record<string, unknown>)[key as string] = asBool(incoming);
      continue;
    }
    if (typeof current === "string") {
      (next as Record<string, unknown>)[key as string] = asStoredText(incoming, current);
    }
  }
  return next;
}

function asHome(value: unknown, faqFallback: StorefrontFaqItem[]): StorefrontHome {
  const fallback = DEFAULT_STOREFRONT_CONTENT.home;
  const record = asRecord(value);
  const sectionsRaw = asRecord(record.sections);
  const orderRaw = Array.isArray(record.sectionOrder) ? record.sectionOrder.map(String) : [];
  const sectionOrder = (
    orderRaw.filter((id): id is HomeSectionId => (HOME_SECTION_IDS as readonly string[]).includes(id)).length
      ? orderRaw.filter((id): id is HomeSectionId => (HOME_SECTION_IDS as readonly string[]).includes(id))
      : [...HOME_SECTION_IDS]
  );
  for (const id of HOME_SECTION_IDS) {
    if (!sectionOrder.includes(id)) sectionOrder.push(id);
  }

  const hero = deepMergeSection(fallback.sections.hero as unknown as Record<string, unknown>, sectionsRaw.hero) as unknown as StorefrontHome["sections"]["hero"];
  {
    const heroRaw = asRecord(sectionsRaw.hero);
    const fromBanners = Array.isArray(heroRaw.banners)
      ? (heroRaw.banners as unknown[])
          .map((item) => String(item ?? "").trim())
          .filter(Boolean)
          .slice(0, 5)
      : Array.isArray((hero as { banners?: unknown }).banners)
        ? ((hero as { banners: unknown[] }).banners ?? [])
            .map((item) => String(item ?? "").trim())
            .filter(Boolean)
            .slice(0, 5)
        : [];
    const poster = String(hero.posterSrc ?? "").trim();
    const banners = fromBanners.length > 0 ? fromBanners : poster ? [poster] : [...fallback.sections.hero.banners];
    hero.banners = banners.length > 0 ? banners : [...fallback.sections.hero.banners];
    hero.posterSrc = hero.banners[0] ?? fallback.sections.hero.posterSrc;
  }
  const collection = deepMergeSection(fallback.sections.collection as unknown as Record<string, unknown>, sectionsRaw.collection) as unknown as StorefrontHome["sections"]["collection"];
  const lifestyle = deepMergeSection(fallback.sections.lifestyle as unknown as Record<string, unknown>, sectionsRaw.lifestyle) as unknown as StorefrontHome["sections"]["lifestyle"];
  const mosaic = deepMergeSection(fallback.sections.mosaic as unknown as Record<string, unknown>, sectionsRaw.mosaic) as unknown as StorefrontHome["sections"]["mosaic"];
  const ritual = deepMergeSection(fallback.sections.ritual as unknown as Record<string, unknown>, sectionsRaw.ritual) as unknown as StorefrontHome["sections"]["ritual"];
  const storiesBase = deepMergeSection(fallback.sections.stories as unknown as Record<string, unknown>, sectionsRaw.stories) as unknown as StorefrontHome["sections"]["stories"];
  const faqBase = deepMergeSection(fallback.sections.faq as unknown as Record<string, unknown>, sectionsRaw.faq) as unknown as StorefrontHome["sections"]["faq"];
  const socialBase = deepMergeSection(fallback.sections.social as unknown as Record<string, unknown>, sectionsRaw.social) as unknown as StorefrontHome["sections"]["social"];
  const journalBase = deepMergeSection(fallback.sections.journal as unknown as Record<string, unknown>, sectionsRaw.journal) as unknown as StorefrontHome["sections"]["journal"];
  const newsletter = deepMergeSection(fallback.sections.newsletter as unknown as Record<string, unknown>, sectionsRaw.newsletter) as unknown as StorefrontHome["sections"]["newsletter"];

  const storiesRaw = asRecord(sectionsRaw.stories);
  const faqRaw = asRecord(sectionsRaw.faq);
  const socialRaw = asRecord(sectionsRaw.social);
  const journalRaw = asRecord(sectionsRaw.journal);
  const collectionRaw = asRecord(sectionsRaw.collection);
  const ritualRaw = asRecord(sectionsRaw.ritual);

  if (Array.isArray(collectionRaw.tileImageOverrides)) {
    const overrides = collectionRaw.tileImageOverrides as unknown[];
    collection.tileImageOverrides = Array.from({ length: 6 }, (_, i) =>
      String(overrides[i] ?? fallback.sections.collection.tileImageOverrides[i] ?? "").trim(),
    );
  }
  if (Array.isArray(ritualRaw.tileImageOverrides)) {
    const overrides = ritualRaw.tileImageOverrides as unknown[];
    ritual.tileImageOverrides = Array.from({ length: 3 }, (_, i) =>
      String(overrides[i] ?? fallback.sections.ritual.tileImageOverrides[i] ?? "").trim(),
    );
  }

  const reviewIds = new Set<string>();
  const reviews = Array.isArray(storiesRaw.reviews)
    ? storiesRaw.reviews.slice(0, 12).map((item, index) => {
        const row = asRecord(item);
        const fb = fallback.sections.stories.reviews[index] ?? fallback.sections.stories.reviews[0]!;
        let id = asText(row.id, fb.id) || `r${index + 1}`;
        if (reviewIds.has(id)) {
          id = `${id}-${index}`;
        }
        reviewIds.add(id);
        return {
          id,
          title: asStoredText(row.title, fb.title),
          body: asStoredText(row.body, fb.body),
          name: asStoredText(row.name, fb.name),
          context: asStoredText(row.context, fb.context),
          avatar: asStoredText(row.avatar, fb.avatar),
        };
      })
    : storiesBase.reviews;

  const homeFaqItems = Array.isArray(faqRaw.items)
    ? asFaqItems(faqRaw.items)
    : faqBase.items?.length
      ? faqBase.items
      : faqFallback;

  const socialItems = Array.isArray(socialRaw.items)
    ? socialRaw.items.slice(0, 8).map((item, index) => {
        const row = asRecord(item);
        const fb = fallback.sections.social.items[index] ?? fallback.sections.social.items[0]!;
        return {
          id: asText(row.id, fb.id),
          src: asStoredText(row.src, fb.src),
          href: asStoredText(row.href, fb.href),
          handle: asStoredText(row.handle, fb.handle),
          alt: asStoredText(row.alt, fb.alt),
        };
      })
    : socialBase.items;

  const articles = Array.isArray(journalRaw.articles)
    ? journalRaw.articles.slice(0, 8).map((item, index) => {
        const row = asRecord(item);
        const fb = fallback.sections.journal.articles[index] ?? fallback.sections.journal.articles[0]!;
        return {
          id: asText(row.id, fb.id),
          title: asStoredText(row.title, fb.title),
          date: asStoredText(row.date, fb.date),
          href: asPath(row.href, fb.href),
          src: asStoredText(row.src, fb.src),
          alt: asStoredText(row.alt, fb.alt),
        };
      })
    : journalBase.articles;

  return {
    sectionOrder,
    sections: {
      hero,
      collection,
      lifestyle,
      mosaic,
      ritual,
      stories: { ...storiesBase, reviews },
      faq: { ...faqBase, items: homeFaqItems },
      social: { ...socialBase, items: socialItems },
      journal: { ...journalBase, articles },
      newsletter,
    },
  };
}

function asPageTemplates(
  value: unknown,
  aboutCopy: string,
  contactLead: string,
  supportPhone: string,
  faqItems: StorefrontFaqItem[],
): StorefrontPageTemplates {
  const fallback = buildDefaultPageTemplates(aboutCopy, contactLead, supportPhone, faqItems);
  const record = asRecord(value);
  const about = deepMergeSection(fallback.about as unknown as Record<string, unknown>, record.about) as unknown as StorefrontPageTemplates["about"];
  const contact = deepMergeSection(fallback.contact as unknown as Record<string, unknown>, record.contact) as unknown as StorefrontPageTemplates["contact"];
  const faqRaw = asRecord(record.faq);
  const faq = {
    imageSrc: asStoredText(faqRaw.imageSrc, fallback.faq.imageSrc),
    imageAlt: asStoredText(faqRaw.imageAlt, fallback.faq.imageAlt),
    items: Array.isArray(faqRaw.items) ? asFaqItems(faqRaw.items) : fallback.faq.items,
  };
  const privacy = deepMergeSection(fallback.privacy as unknown as Record<string, unknown>, record.privacy) as unknown as StorefrontPageTemplates["privacy"];
  const terms = deepMergeSection(fallback.terms as unknown as Record<string, unknown>, record.terms) as unknown as StorefrontPageTemplates["terms"];
  const shipping = deepMergeSection(fallback.shipping as unknown as Record<string, unknown>, record.shipping) as unknown as StorefrontPageTemplates["shipping"];
  const returns = deepMergeSection(fallback.returns as unknown as Record<string, unknown>, record.returns) as unknown as StorefrontPageTemplates["returns"];
  return { about, contact, faq, privacy, terms, shipping, returns };
}

function asCollectionPages(value: unknown): Record<string, StorefrontCollectionPage> {
  const fallback = DEFAULT_STOREFRONT_CONTENT.collectionPages;
  const record = asRecord(value);
  const next: Record<string, StorefrontCollectionPage> = {};
  for (const key of Object.keys(fallback)) {
    const fb = fallback[key]!;
    const row = asRecord(record[key]);
    next[key] = {
      heroSrc: asStoredText(row.heroSrc, fb.heroSrc),
      titleFirst: asStoredText(row.titleFirst, fb.titleFirst),
      titleSecond: asStoredText(row.titleSecond, fb.titleSecond),
      ritualImage: asStoredText(row.ritualImage, fb.ritualImage),
      ritualTitle: asStoredText(row.ritualTitle, fb.ritualTitle),
      ritualMark: asStoredText(row.ritualMark, fb.ritualMark),
      ritualNote1Title: asStoredText(row.ritualNote1Title, fb.ritualNote1Title),
      ritualNote1Body: asStoredText(row.ritualNote1Body, fb.ritualNote1Body),
      ritualNote2Title: asStoredText(row.ritualNote2Title, fb.ritualNote2Title),
      ritualNote2Body: asStoredText(row.ritualNote2Body, fb.ritualNote2Body),
    };
  }
  return next;
}

export function resolveStorefrontContent(raw: unknown): StorefrontContent {
  const record = asRecord(raw);
  const skus = Array.isArray(record.bestSellerSkus)
    ? record.bestSellerSkus.map((item) => String(item).trim().toUpperCase()).filter(Boolean).slice(0, 3)
    : [];
  const images = asImageMap(record.shopImages, DEFAULT_STOREFRONT_CONTENT.shopImages);
  const colors = asHexMap(record.shopCardColors, DEFAULT_STOREFRONT_CONTENT.shopCardColors);
  const shopCategories = asShopCategories(record.shopCategories, images, colors);
  const shopImages = Object.fromEntries(shopCategories.map((item) => [item.id, item.image]));
  const shopCardColors = Object.fromEntries(shopCategories.map((item) => [item.id, item.color]));
  const faqItems = asFaqItems(record.faqItems);
  const aboutCopy = asStoredText(record.aboutCopy, DEFAULT_STOREFRONT_CONTENT.aboutCopy);
  const contactLead = asStoredText(record.contactLead, DEFAULT_STOREFRONT_CONTENT.contactLead);
  const supportPhone = asStoredText(record.supportPhone, DEFAULT_STOREFRONT_CONTENT.supportPhone);
  const navLinks = asNavLinks(record.navLinks);
  const pageTemplates = asPageTemplates(record.pageTemplates, aboutCopy, contactLead, supportPhone, faqItems);
  // Keep legacy about/contact/faq fields in sync with page templates when CMS pages are present
  const syncedAbout = asStoredText(asRecord(asRecord(record.pageTemplates).about).copy, aboutCopy) || aboutCopy;
  const syncedContact = asStoredText(asRecord(asRecord(record.pageTemplates).contact).lead, contactLead) || contactLead;
  const syncedPhone =
    asStoredText(asRecord(asRecord(record.pageTemplates).contact).supportPhone, supportPhone) || supportPhone;
  const home = asHome(record.home, faqItems);
  return {
    heroHeadline: asStoredText(record.heroHeadline, DEFAULT_STOREFRONT_CONTENT.heroHeadline),
    heroSupport: asStoredText(record.heroSupport, DEFAULT_STOREFRONT_CONTENT.heroSupport),
    heroProductSrc: asStoredText(record.heroProductSrc, DEFAULT_STOREFRONT_CONTENT.heroProductSrc),
    heroProductAlt: asStoredText(record.heroProductAlt, DEFAULT_STOREFRONT_CONTENT.heroProductAlt),
    brandStoryPrimarySrc: asStoredText(record.brandStoryPrimarySrc, DEFAULT_STOREFRONT_CONTENT.brandStoryPrimarySrc),
    brandStorySecondarySrc: asStoredText(record.brandStorySecondarySrc, DEFAULT_STOREFRONT_CONTENT.brandStorySecondarySrc),
    brandStoryPortraitSrc: asStoredText(record.brandStoryPortraitSrc, DEFAULT_STOREFRONT_CONTENT.brandStoryPortraitSrc),
    brandStoryLead: asStoredText(record.brandStoryLead, DEFAULT_STOREFRONT_CONTENT.brandStoryLead),
    brandStoryMid: asStoredText(record.brandStoryMid, DEFAULT_STOREFRONT_CONTENT.brandStoryMid),
    brandStoryEnd: asStoredText(record.brandStoryEnd, DEFAULT_STOREFRONT_CONTENT.brandStoryEnd),
    productHighlightsImage: asStoredText(record.productHighlightsImage, DEFAULT_STOREFRONT_CONTENT.productHighlightsImage),
    glowStatsImage: asStoredText(record.glowStatsImage, DEFAULT_STOREFRONT_CONTENT.glowStatsImage),
    faqImage: asStoredText(record.faqImage, pageTemplates.faq.imageSrc || DEFAULT_STOREFRONT_CONTENT.faqImage),
    faqImageAlt: asStoredText(record.faqImageAlt, pageTemplates.faq.imageAlt || DEFAULT_STOREFRONT_CONTENT.faqImageAlt),
    faqItems: pageTemplates.faq.items.length ? pageTemplates.faq.items : faqItems,
    features: asFeatures(record.features),
    footerStatementLead: asStoredText(record.footerStatementLead, DEFAULT_STOREFRONT_CONTENT.footerStatementLead),
    footerStatementEnd: asStoredText(record.footerStatementEnd, DEFAULT_STOREFRONT_CONTENT.footerStatementEnd),
    socialFacebook: asStoredText(record.socialFacebook, DEFAULT_STOREFRONT_CONTENT.socialFacebook),
    socialInstagram: asStoredText(record.socialInstagram, DEFAULT_STOREFRONT_CONTENT.socialInstagram),
    socialPinterest: asStoredText(record.socialPinterest, DEFAULT_STOREFRONT_CONTENT.socialPinterest),
    aboutCopy: syncedAbout,
    contactLead: syncedContact,
    supportPhone: syncedPhone,
    maintenanceMode: asBool(record.maintenanceMode),
    maintenanceMessage: asStoredText(record.maintenanceMessage, DEFAULT_STOREFRONT_CONTENT.maintenanceMessage) || "Coming Soon",
    emailFrom: asStoredText(record.emailFrom, DEFAULT_STOREFRONT_CONTENT.emailFrom) || DEFAULT_STOREFRONT_CONTENT.emailFrom,
    authLoginSrc: asStoredText(record.authLoginSrc, DEFAULT_STOREFRONT_CONTENT.authLoginSrc),
    authRegisterSrc: asStoredText(record.authRegisterSrc, DEFAULT_STOREFRONT_CONTENT.authRegisterSrc),
    authAdminSrc: asStoredText(record.authAdminSrc, DEFAULT_STOREFRONT_CONTENT.authAdminSrc),
    shopImages,
    shopCardColors,
    shopCategories,
    navLinks,
    collectionImages: asImageMap(record.collectionImages, DEFAULT_STOREFRONT_CONTENT.collectionImages),
    collectionTitles: asCollectionTitles(record.collectionTitles),
    bestSellerSkus: Array.isArray(record.bestSellerSkus) ? skus : DEFAULT_STOREFRONT_CONTENT.bestSellerSkus,
    bestSellerColors: asHexList(record.bestSellerColors, DEFAULT_STOREFRONT_CONTENT.bestSellerColors),
    heroStageColor: asHex(record.heroStageColor, DEFAULT_STOREFRONT_CONTENT.heroStageColor),
    productCardColors: asHexList(record.productCardColors, DEFAULT_STOREFRONT_CONTENT.productCardColors),
    brand: asBrand(record.brand),
    menus: asMenus(record.menus, navLinks),
    home,
    pageTemplates: {
      ...pageTemplates,
      about: { ...pageTemplates.about, copy: syncedAbout },
      contact: { ...pageTemplates.contact, lead: syncedContact, supportPhone: syncedPhone },
    },
    collectionPages: asCollectionPages(record.collectionPages),
  };
}

export function themeToCss(theme: StorefrontTheme): string {
  return `:root{--color-brand-bg:${theme.bg};--color-brand-primary:${theme.primary};--color-brand-secondary:${theme.secondary};--color-brand-accent:${theme.accent};--color-brand-mint:${theme.mint};--color-brand-blush:${theme.blush};--color-text-main:${theme.primary};--color-text-sub:color-mix(in srgb,${theme.primary} 70%,transparent);--color-text-muted:color-mix(in srgb,${theme.primary} 40%,transparent);--color-brand-border:color-mix(in srgb,${theme.primary} 8%,transparent);--page:${theme.bg};--ink:${theme.primary};--body:color-mix(in srgb,${theme.primary} 70%,transparent);--muted:color-mix(in srgb,${theme.primary} 40%,transparent);--button:${theme.primary};--button-hover:color-mix(in srgb,${theme.primary} 82%,white);--header:${theme.mint};--soft:#f8f8f8;--peach:${theme.blush};--border:color-mix(in srgb,${theme.primary} 8%,transparent);--small-accent:${theme.accent};}`;
}

export function formatMoney(amount: number, currency = "PKR"): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function tileStyle(color: string): CSSProperties {
  return { ["--tile-color"]: color } as CSSProperties;
}

export function visibleNavLinks(content: StorefrontContent): StorefrontNavLink[] {
  return content.navLinks.filter((item) => !item.hidden);
}

export function visibleShopCategories(content: StorefrontContent): StorefrontShopCategory[] {
  return content.shopCategories.filter((item) => !item.hidden);
}

export function resolveNavImages(content: StorefrontContent): Record<string, { src: string; tone: "blush" | "mint" }> {
  const next: Record<string, { src: string; tone: "blush" | "mint" }> = {};
  const olive = DEFAULT_STOREFRONT_THEME.mint.toLowerCase();
  for (const link of content.navLinks) {
    const slug = link.path.replace(/^\/collections\//, "").replace(/^\//, "");
    const category = content.shopCategories.find((item) => item.id === slug || item.href === link.path);
    const src = category?.image || content.shopImages[slug] || content.collectionImages[slug] || "";
    const color = (category?.color || content.shopCardColors[slug] || DEFAULT_STOREFRONT_THEME.blush).toLowerCase();
    next[link.id] = {
      src,
      tone: color === olive ? "mint" : "blush",
    };
  }
  return next;
}
