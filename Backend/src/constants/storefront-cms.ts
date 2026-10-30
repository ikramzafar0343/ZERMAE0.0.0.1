/**
 * Shopify-style storefront page/section defaults (Backend mirror).
 * Paths match Frontend media-manifest / homepage defaults.
 */
import { brandLogoWordmark, brandLogoWordmarkOnLight, brandName } from "@/constants/brand";
import { COLLECTION_HEROES, FOOTER_NAV, INFO_STILLS, NAV_ITEMS, SUPPORT_EMAIL, SUPPORT_PHONE_LOCAL } from "@/constants/site";

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

export type HeroBannerSlide = {
  desktop: string;
  mobile: string;
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
    banners: HeroBannerSlide[];
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

function navFromLinks(links: readonly { label: string; href: string }[], prefix: string): CmsNavLink[] {
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
  const shopGroup = FOOTER_NAV.find((g) => g.id === "shop");
  const houseGroup = FOOTER_NAV.find((g) => g.id === "house");
  const policiesGroup = FOOTER_NAV.find((g) => g.id === "policies");
  return {
    header: [
      { id: "hdr-shop", label: "Shop", path: "/collections/all", hidden: false },
      { id: "hdr-collection", label: "Collection", path: "/collections/all", hidden: false },
      { id: "hdr-about", label: "About", path: "/about-us", hidden: false },
      { id: "hdr-contact", label: "Contact", path: "/contact", hidden: false },
    ],
    footerShop: shopGroup
      ? navFromLinks(shopGroup.links, "fs")
      : NAV_ITEMS.map((item) => ({ id: item.id, label: item.label, path: item.path, hidden: false })),
    footerHouse: houseGroup ? navFromLinks(houseGroup.links, "fh") : [],
    footerPolicies: policiesGroup ? navFromLinks(policiesGroup.links, "fp") : [],
  };
}

const DEFAULT_FAQ: CmsFaqItem[] = [
  {
    id: "sensitivity",
    question: "Are your products safe for sensitive skin?",
    answer:
      "Many customers with reactive skin start with a patch test and introduce one product at a time. Read each product page for texture and use guidance, and pause if irritation appears.",
  },
  {
    id: "animal-testing",
    question: "Are your products cruelty-free?",
    answer:
      "Zermae is committed to cruelty-free practices. We do not test finished products on animals and work with partners aligned to that standard.",
  },
  {
    id: "sourcing",
    question: "Do you use natural ingredients?",
    answer:
      "We prioritize considered botanical and cosmetic-grade ingredients described in clear language. Full composition details appear on each product page.",
  },
];

export function buildDefaultHome(): StorefrontHome {
  return {
    sectionOrder: [...HOME_SECTION_IDS],
    sections: {
      hero: {
        hidden: false,
        line1: "Beauty that",
        line2: "feels_natural",
        support: "A skincare experience designed to nourish, restore, and reveal the effortless beauty within you.",
        ctaLabel: "Shop now",
        ctaHref: "/collections/all",
        scrollLabel: "Scroll down",
        posterSrc: "/media/hero/portrait-poster.webp",
        banners: [{ desktop: "/media/hero/portrait-poster.webp", mobile: "" }],
      },
      collection: {
        hidden: false,
        eyebrow: "",
        line1: "Shop the Collection.",
        line2: "",
        tileImageOverrides: ["", "", "", "", "", ""],
      },
      lifestyle: {
        hidden: false,
        eyebrow: "Radiant Skin",
        heading: "Feel the Difference.",
        posterSrc: "/media/lifestyle/skincare-poster.webp",
        beforeSrc: "/media/lifestyle/skincare-poster.webp",
        afterSrc: "/media/editorial/serum-portrait.webp",
      },
      mosaic: {
        hidden: false,
        eyebrow: "",
        line1: "The Zermae Approach.",
        line2: "",
        panelHeading: "Deep skin nourishment.",
        panelBody: "Formulated to hydrate, repair, and balance your skin for long-lasting radiance.",
        upperCaptionHeading: "Sustainable beauty choices",
        upperCaptionBody: "Nourishes skin for a radiant, lasting glow.",
        lowerCaptionHeading: "Feel the visible difference",
        lowerCaptionBody: "",
        leftSrc: "/media/editorial/serum-portrait.webp",
        rangeSrc: "/media/editorial/product-range.webp",
        detailSrc: "/media/editorial/skin-detail.webp",
      },
      ritual: {
        hidden: false,
        eyebrow: "Best Sellers",
        line1: "Your routine, made",
        line2: "simple and effective.",
        empty: "No products in this category yet. Explore other steps of the routine.",
        tileImageOverrides: ["", "", ""],
      },
      stories: {
        hidden: false,
        eyebrow: "Customer Stories",
        line1: "Results that make",
        line2: "a difference.",
        compositionSrc: "/media/stories/product-composition.webp",
        reviews: [
          {
            id: "r1",
            title: "My morning feel finally settled",
            body: "I swapped in the cleanser and a light serum. Skin feels calm by midday.",
            name: "Ayesha K.",
            context: "Cleanser + serum routine",
            avatar: "/media/stories/avatar-01.webp",
          },
        ],
      },
      faq: {
        hidden: false,
        eyebrow: "Skincare Questions.",
        line1: "Everything you need",
        line2: "to know.",
        intro: "Have questions about our products? We're here to help you every step of the way.",
        items: DEFAULT_FAQ,
      },
      social: {
        hidden: false,
        eyebrow: "Skincare Rituals",
        line1: "Our journey",
        line2: "continues on social.",
        followLabel: "Follow along",
        followHref: "https://instagram.com/zermae",
        handle: "@zermae",
        items: [
          {
            id: "social-1",
            src: "/media/social/portrait-01.jpg",
            href: "https://instagram.com/zermae",
            handle: "@zermae",
            alt: "Community portrait 1",
          },
        ],
      },
      journal: {
        hidden: false,
        eyebrow: "Beauty Insights",
        line1: "Your source for",
        line2: "better skin.",
        ctaLabel: "View all",
        ctaHref: "/#ha-journal",
        articles: [
          {
            id: "j1",
            title: "5 signs your skin needs more hydration",
            date: "1. 02. 2025",
            href: "/about-us",
            src: "/media/journal/article-01.webp",
            alt: "Journal article",
          },
        ],
      },
      newsletter: {
        hidden: false,
        eyebrow: "Glow Alerts",
        line1: "Beauty starts in your inbox.",
        support: "Sign up and receive exclusive skincare tips, product launches, and special discounts.",
        submitLabel: "Join waitlist",
        imageSrc: "/media/newsletter/skincare-wide.webp",
      },
    },
  };
}

export function buildDefaultCollectionPages(): Record<string, StorefrontCollectionPage> {
  const next: Record<string, StorefrontCollectionPage> = {};
  for (const [key, hero] of Object.entries(COLLECTION_HEROES)) {
    next[key] = {
      heroSrc: "/media/hero/portrait-poster.webp",
      titleFirst: hero.first,
      titleSecond: hero.second,
      ritualImage: hero.image,
      ritualTitle: "The Ritual",
      ritualMark: "Now",
      ritualNote1Title: "Considered Care",
      ritualNote1Body: "Formulas made for real routines.",
      ritualNote2Title: "Calm Finish",
      ritualNote2Body: "Textures that feel comfortable in daily use.",
    };
  }
  return next;
}

export function buildDefaultPageTemplates(
  aboutCopy: string,
  contactLead: string,
  supportPhone = SUPPORT_PHONE_LOCAL,
  faqItems: CmsFaqItem[] = DEFAULT_FAQ,
): StorefrontPageTemplates {
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
      body: `When you shop or write to us we may store your name, email, phone, delivery address, and order history.\n\nContact ${SUPPORT_EMAIL} for privacy requests.`,
    },
    terms: {
      title: "Terms of Service",
      lead: `By shopping at ${brandName} you agree to these terms.`,
      body: "Orders are subject to product availability and confirmation. Cash on delivery is available where offered at checkout.",
    },
    shipping: {
      title: "Shipping",
      lead: "We deliver across Pakistan with tracked dispatch where available.",
      body: "Delivery timing depends on your city and courier. Free shipping may apply when your cart meets the threshold shown at checkout.",
    },
    returns: {
      title: "Returns & Exchanges",
      lead: "We want you to feel confident in every ritual.",
      body: "Unused products in original packaging may be eligible for exchange. Contact client care with your order number.",
    },
  };
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
