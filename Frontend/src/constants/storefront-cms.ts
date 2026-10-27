/**
 * Shopify-style storefront page/section model.
 * Defaults mirror homepage.ts + media-manifest so the live look is unchanged until admin edits.
 */
import { brandName, brandLogoWordmark, brandLogoWordmarkOnLight } from "@/constants/brand";
import { COLLECTION_HEROES, COLLECTION_RITUALS, FOOTER_NAV, INFO_STILLS, NAV_ITEMS, SUPPORT_EMAIL } from "@/constants/site";
import {
  HOME_COLLECTION,
  HOME_FAQ,
  HOME_FAQ_DEFAULTS,
  HOME_HERO,
  HOME_JOURNAL,
  HOME_JOURNAL_ITEMS,
  HOME_LIFESTYLE,
  HOME_MOSAIC,
  HOME_NEWSLETTER,
  HOME_REVIEWS,
  HOME_RITUAL,
  HOME_SOCIAL,
  HOME_SOCIAL_ITEMS,
  HOME_STORIES,
  SHOP_CATEGORIES,
} from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

export const HOME_SECTION_IDS = [
  "hero",
  "collection",
  "lifestyle",
  "mosaic",
  "ritual",
  "stories",
  "faq",
  "social",
  "journal",
  "newsletter",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export type CmsNavLink = {
  id: string;
  label: string;
  path: string;
  hidden: boolean;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type StorefrontBrand = {
  siteName: string;
  logoSrc: string;
  logoOnLightSrc: string;
};

export type StorefrontMenus = {
  header: CmsNavLink[];
  footerShop: CmsNavLink[];
  footerHouse: CmsNavLink[];
  footerPolicies: CmsNavLink[];
};

export type StorefrontHomeReview = {
  id: string;
  title: string;
  body: string;
  name: string;
  context: string;
  avatar: string;
};

export type StorefrontHomeSocialItem = {
  id: string;
  src: string;
  href: string;
  handle: string;
  alt: string;
};

export type StorefrontHomeJournalItem = {
  id: string;
  title: string;
  date: string;
  href: string;
  src: string;
  alt: string;
};

export type StorefrontHomeSections = {
  hero: {
    hidden: boolean;
    line1: string;
    line2: string;
    support: string;
    ctaLabel: string;
    ctaHref: string;
    scrollLabel: string;
    posterSrc: string;
  };
  collection: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    tileImageOverrides: string[];
  };
  lifestyle: {
    hidden: boolean;
    eyebrow: string;
    heading: string;
    posterSrc: string;
    beforeSrc: string;
    afterSrc: string;
  };
  mosaic: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    panelHeading: string;
    panelBody: string;
    upperCaptionHeading: string;
    upperCaptionBody: string;
    lowerCaptionHeading: string;
    lowerCaptionBody: string;
    leftSrc: string;
    rangeSrc: string;
    detailSrc: string;
  };
  ritual: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    empty: string;
    tileImageOverrides: string[];
  };
  stories: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    compositionSrc: string;
    reviews: StorefrontHomeReview[];
  };
  faq: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    intro: string;
    items: CmsFaqItem[];
  };
  social: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    followLabel: string;
    followHref: string;
    handle: string;
    items: StorefrontHomeSocialItem[];
  };
  journal: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    line2: string;
    ctaLabel: string;
    ctaHref: string;
    articles: StorefrontHomeJournalItem[];
  };
  newsletter: {
    hidden: boolean;
    eyebrow: string;
    line1: string;
    support: string;
    submitLabel: string;
    imageSrc: string;
  };
};

export type StorefrontHome = {
  sectionOrder: HomeSectionId[];
  sections: StorefrontHomeSections;
};

export type StorefrontCollectionPage = {
  heroSrc: string;
  titleFirst: string;
  titleSecond: string;
  ritualImage: string;
  ritualTitle: string;
  ritualMark: string;
  ritualNote1Title: string;
  ritualNote1Body: string;
  ritualNote2Title: string;
  ritualNote2Body: string;
};

export type StorefrontPageTemplates = {
  about: {
    imageSrc: string;
    imageAlt: string;
    eyebrow: string;
    copy: string;
    ctaLabel: string;
    ctaHref: string;
  };
  contact: {
    imageSrc: string;
    imageAlt: string;
    lead: string;
    supportPhone: string;
  };
  faq: {
    imageSrc: string;
    imageAlt: string;
    items: CmsFaqItem[];
  };
  privacy: { title: string; lead: string; body: string };
  terms: { title: string; lead: string; body: string };
  shipping: { title: string; lead: string; body: string };
  returns: { title: string; lead: string; body: string };
};

function navFromLinks(
  links: readonly { label: string; href: string }[],
  prefix: string,
): CmsNavLink[] {
  return links.map((link, index) => ({
    id: `${prefix}-${index + 1}`,
    label: link.label,
    path: link.href,
    hidden: false,
  }));
}

export function buildDefaultBrand(): StorefrontBrand {
  return {
    siteName: brandName,
    logoSrc: brandLogoWordmark,
    logoOnLightSrc: brandLogoWordmarkOnLight,
  };
}

export function buildDefaultMenus(): StorefrontMenus {
  const headerDefaults: CmsNavLink[] = [
    { id: "hdr-shop", label: "Shop", path: "/collections/all", hidden: false },
    { id: "hdr-collection", label: "Collection", path: "/collections/all", hidden: false },
    { id: "hdr-about", label: "About", path: "/about-us", hidden: false },
    { id: "hdr-contact", label: "Contact", path: "/contact", hidden: false },
  ];
  const shopGroup = FOOTER_NAV.find((g) => g.id === "shop");
  const houseGroup = FOOTER_NAV.find((g) => g.id === "house");
  const policiesGroup = FOOTER_NAV.find((g) => g.id === "policies");
  return {
    header: headerDefaults,
    footerShop: shopGroup
      ? navFromLinks(shopGroup.links, "fs")
      : NAV_ITEMS.map((item) => ({ id: item.id, label: item.label, path: item.path, hidden: false })),
    footerHouse: houseGroup ? navFromLinks(houseGroup.links, "fh") : [],
    footerPolicies: policiesGroup ? navFromLinks(policiesGroup.links, "fp") : [],
  };
}

export function buildDefaultHome(): StorefrontHome {
  return {
    sectionOrder: [...HOME_SECTION_IDS],
    sections: {
      hero: {
        hidden: false,
        line1: HOME_HERO.line1,
        line2: HOME_HERO.line2,
        support: HOME_HERO.support,
        ctaLabel: HOME_HERO.ctaLabel,
        ctaHref: HOME_HERO.ctaHref,
        scrollLabel: HOME_HERO.scrollLabel,
        posterSrc: MEDIA.heroPoster.src,
      },
      collection: {
        hidden: false,
        eyebrow: HOME_COLLECTION.eyebrow,
        line1: HOME_COLLECTION.lines[0],
        line2: "",
        tileImageOverrides: Array.from({ length: 6 }, () => ""),
      },
      lifestyle: {
        hidden: false,
        eyebrow: HOME_LIFESTYLE.eyebrow,
        heading: HOME_LIFESTYLE.heading,
        posterSrc: MEDIA.lifestylePoster.src,
        beforeSrc: MEDIA.lifestylePoster.src,
        afterSrc: MEDIA.mosaicLeft.src,
      },
      mosaic: {
        hidden: false,
        eyebrow: HOME_MOSAIC.eyebrow,
        line1: HOME_MOSAIC.lines[0],
        line2: "",
        panelHeading: HOME_MOSAIC.panelHeading,
        panelBody: HOME_MOSAIC.panelBody,
        upperCaptionHeading: HOME_MOSAIC.upperCaptionHeading,
        upperCaptionBody: HOME_MOSAIC.upperCaptionBody,
        lowerCaptionHeading: HOME_MOSAIC.lowerCaptionHeading,
        lowerCaptionBody: HOME_MOSAIC.lowerCaptionBody,
        leftSrc: MEDIA.mosaicLeft.src,
        rangeSrc: MEDIA.mosaicRange.src,
        detailSrc: MEDIA.mosaicDetail.src,
      },
      ritual: {
        hidden: false,
        eyebrow: HOME_RITUAL.eyebrow,
        line1: HOME_RITUAL.lines[0],
        line2: HOME_RITUAL.lines[1],
        empty: HOME_RITUAL.empty,
        tileImageOverrides: Array.from({ length: 3 }, () => ""),
      },
      stories: {
        hidden: false,
        eyebrow: HOME_STORIES.eyebrow,
        line1: HOME_STORIES.lines[0],
        line2: HOME_STORIES.lines[1],
        compositionSrc: MEDIA.storiesComposition.src,
        reviews: HOME_REVIEWS.map((item) => ({ ...item })),
      },
      faq: {
        hidden: false,
        eyebrow: HOME_FAQ.eyebrow,
        line1: HOME_FAQ.lines[0],
        line2: HOME_FAQ.lines[1],
        intro: HOME_FAQ.intro,
        items: HOME_FAQ_DEFAULTS.map((item) => ({ ...item })),
      },
      social: {
        hidden: false,
        eyebrow: HOME_SOCIAL.eyebrow,
        line1: HOME_SOCIAL.lines[0],
        line2: HOME_SOCIAL.lines[1],
        followLabel: HOME_SOCIAL.followLabel,
        followHref: HOME_SOCIAL.followHref,
        handle: HOME_SOCIAL.handle,
        items: HOME_SOCIAL_ITEMS.map((item) => ({ ...item })),
      },
      journal: {
        hidden: false,
        eyebrow: HOME_JOURNAL.eyebrow,
        line1: HOME_JOURNAL.lines[0],
        line2: HOME_JOURNAL.lines[1],
        ctaLabel: HOME_JOURNAL.ctaLabel,
        ctaHref: HOME_JOURNAL.ctaHref,
        articles: HOME_JOURNAL_ITEMS.map((item) => ({ ...item })),
      },
      newsletter: {
        hidden: false,
        eyebrow: HOME_NEWSLETTER.eyebrow,
        line1: HOME_NEWSLETTER.lines[0],
        support: HOME_NEWSLETTER.support,
        submitLabel: HOME_NEWSLETTER.submitLabel,
        imageSrc: MEDIA.newsletter.src,
      },
    },
  };
}

export function buildDefaultCollectionPages(): Record<string, StorefrontCollectionPage> {
  const keys = Object.keys(COLLECTION_HEROES);
  const next: Record<string, StorefrontCollectionPage> = {};
  for (const key of keys) {
    const hero = COLLECTION_HEROES[key]!;
    const ritual = COLLECTION_RITUALS[key];
    next[key] = {
      heroSrc: MEDIA.heroPoster.src,
      titleFirst: hero.first,
      titleSecond: hero.second,
      ritualImage: hero.image,
      ritualTitle: ritual?.title ?? "The Ritual",
      ritualMark: ritual?.mark ?? "Now",
      ritualNote1Title: ritual?.notes[0]?.title ?? "",
      ritualNote1Body: ritual?.notes[0]?.description ?? "",
      ritualNote2Title: ritual?.notes[1]?.title ?? "",
      ritualNote2Body: ritual?.notes[1]?.description ?? "",
    };
  }
  return next;
}

export function buildDefaultPageTemplates(aboutCopy: string, contactLead: string, supportPhone: string, faqItems: CmsFaqItem[]): StorefrontPageTemplates {
  return {
    about: {
      imageSrc: INFO_STILLS.about.src,
      imageAlt: INFO_STILLS.about.alt,
      eyebrow: "Our House",
      copy: aboutCopy,
      ctaLabel: "Shop the collection",
      ctaHref: "/collections/all",
    },
    contact: {
      imageSrc: INFO_STILLS.contact.src,
      imageAlt: INFO_STILLS.contact.alt,
      lead: contactLead,
      supportPhone,
    },
    faq: {
      imageSrc: "/assets/images/women.jpg",
      imageAlt: "Frequently asked questions",
      items: faqItems.map((item) => ({ ...item })),
    },
    privacy: {
      title: "Privacy Policy",
      lead: `${brandName} collects only what we need to fulfil orders and answer your questions.`,
      body: `When you shop or write to us we may store your name, email, phone, delivery address, and order history. We use this to process cash-on-delivery orders, prevent fraud, and respond to client care.\n\nSession, bag, and wishlist cookies stay on your device so the storefront can remember your visit. We do not sell personal data. Access is limited to the people who operate this shop.\n\nTo ask what we hold, or to request a correction, email ${SUPPORT_EMAIL}.`,
    },
    terms: {
      title: "Terms of Service",
      lead: `By shopping at ${brandName} you agree to these terms.`,
      body: `Orders are subject to product availability and confirmation. Cash on delivery is available where offered at checkout. Prices are listed in the store currency and may change without notice before you place an order.\n\nPlease review product details before purchasing. If something arrives damaged or incorrect, contact us promptly with your order number.`,
    },
    shipping: {
      title: "Shipping",
      lead: "We deliver across Pakistan with tracked dispatch where available.",
      body: `Delivery timing depends on your city and courier. You will receive updates by the contact details you provide at checkout.\n\nFree shipping may apply when your cart meets the threshold shown at checkout. Standard fees appear before you confirm payment method.`,
    },
    returns: {
      title: "Returns & Exchanges",
      lead: "We want you to feel confident in every ritual.",
      body: `Unused products in original packaging may be eligible for exchange within the window stated on your order confirmation or product page.\n\nContact client care with your order number to start a return or exchange. Opened or used cosmetics may be excluded for hygiene reasons unless required by law.`,
    },
  };
}

export function shopCategoriesAsRitualTabs(categories: { id: string; title: string; href: string; hidden: boolean }[]) {
  const visible = categories.filter((item) => !item.hidden);
  const source = visible.length ? visible : SHOP_CATEGORIES.map((item) => ({
    id: item.id,
    title: item.label,
    href: item.href,
    hidden: false,
  }));
  return source.map((item) => {
    const href = item.href;
    const category =
      href.includes("/collections/new") ? "new"
      : href.includes("/collections/serums") ? "serums"
      : href.includes("/collections/creams") ? "creams"
      : href.includes("/collections/cleansers") ? "cleansers"
      : href.includes("/collections/body") ? "body-care"
      : "all";
    return {
      id: item.id,
      label: item.title,
      category,
      href,
    };
  });
}

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: "Hero",
  collection: "Collection grid",
  lifestyle: "Lifestyle band",
  mosaic: "Editorial mosaic",
  ritual: "Best sellers / Ritual",
  stories: "Customer stories",
  faq: "FAQ",
  social: "Social",
  journal: "Journal",
  newsletter: "Newsletter",
};
