import { brandName, brandShortBio } from "@/constants/brand";
import { MEDIA } from "@/lib/content/media-manifest";

export const HOME_HERO = {
  line1: "Beauty that",
  line2: "feels_natural",
  support:
    "A skincare experience designed to nourish, restore, and reveal the effortless beauty within you.",
  ctaLabel: "Shop now",
  ctaHref: "/collections/all",
  scrollLabel: "Scroll down",
} as const;

export const HOME_COLLECTION = {
  eyebrow: "",
  lines: ["The Zermae Approach."] as const,
} as const;

export const HOME_LIFESTYLE = {
  eyebrow: "Radiant Skin",
  heading: "Feel the Difference.",
} as const;

export const HOME_MOSAIC = {
  eyebrow: "",
  lines: ["The Zermae Approach."] as const,
  panelHeading: "Deep skin nourishment.",
  panelBody: "Formulated to hydrate, repair, and balance your skin for long-lasting radiance.",
  upperCaptionHeading: "Sustainable beauty choices",
  upperCaptionBody: "Nourishes skin for a radiant, lasting glow.",
  lowerCaptionHeading: "Feel the visible difference",
  lowerCaptionBody: "",
} as const;

export const HOME_RITUAL = {
  eyebrow: "Best Sellers",
  lines: ["Your routine, made", "simple and effective."] as const,
  empty: "No products in this category yet. Explore other steps of the routine.",
} as const;

export type RitualTab = {
  id: string;
  label: string;
  /** Backend/list category slug; "all" = full catalog; "new" = new arrivals */
  category: string;
  href: string;
};

/** Canonical shop categories — used by header Shop menu and Skincare Rituals tabs. */
export const SHOP_CATEGORIES: RitualTab[] = [
  { id: "all", label: "Shop All", category: "all", href: "/collections/all" },
  { id: "new", label: "New Arrivals", category: "new", href: "/collections/new" },
  { id: "serums", label: "Serums", category: "serums", href: "/collections/serums" },
  { id: "creams", label: "Creams", category: "creams", href: "/collections/creams" },
  { id: "cleansers", label: "Cleansers", category: "cleansers", href: "/collections/cleansers" },
  { id: "body", label: "Body Care", category: "body-care", href: "/collections/body" },
];

export const RITUAL_TABS: RitualTab[] = SHOP_CATEGORIES;

export const HOME_STORIES = {
  eyebrow: "Customer Stories",
  lines: ["Results that make", "a difference."] as const,
} as const;

export type HomeReview = {
  id: string;
  title: string;
  body: string;
  name: string;
  context: string;
  avatar: string;
};

export const HOME_REVIEWS: HomeReview[] = [
  {
    id: "r1",
    title: "My morning feel finally settled",
    body: "I swapped in the cleanser and a light serum. Skin feels calm by midday — no tight finish, just a soft, even look that fits my workday.",
    name: "Ayesha K.",
    context: "Cleanser + serum routine",
    avatar: MEDIA.avatars[0],
  },
  {
    id: "r2",
    title: "Cream that does not weigh me down",
    body: "The night cream sinks in without a greasy film. I wake up comfortable, and makeup sits better on days I need a polished finish.",
    name: "Mariam S.",
    context: "Lumie Night Cream",
    avatar: MEDIA.avatars[1],
  },
  {
    id: "r3",
    title: "Honest labels, quieter shelf",
    body: "I appreciated clear ingredient language. Building a three-step ritual was straightforward, and I stopped guessing what each bottle was for.",
    name: "Hira R.",
    context: "Shop All",
    avatar: MEDIA.avatars[2],
  },
  {
    id: "r4",
    title: "Body polish that feels considered",
    body: "Texture is refined, scent is soft, and my arms feel smoother after weekly use. It fits the same calm tone as the face line.",
    name: "Noor F.",
    context: "Body Care",
    avatar: MEDIA.avatars[3],
  },
  {
    id: "r5",
    title: "Serum that earns the dropper",
    body: "A few drops go far. Tone looks a little brighter after consistent use, and it layers cleanly under moisturizer without pilling.",
    name: "Sara Z.",
    context: "Vitamin C Radiance Serum",
    avatar: MEDIA.avatars[4],
  },
  {
    id: "r6",
    title: "A routine I can keep",
    body: "Simple steps, steady packaging, and shipping that arrived as promised. Zermae feels like a brand built for real weeks, not just launches.",
    name: "Fatima A.",
    context: "Repeat order",
    avatar: MEDIA.avatars[5],
  },
];

export const HOME_FAQ = {
  eyebrow: "Skincare Questions.",
  lines: ["Everything you need", "to know."] as const,
  intro: "Have questions about our products? We're here to help you every step of the way.",
} as const;

export type HomeFaqItem = { id: string; question: string; answer: string };

export const HOME_FAQ_DEFAULTS: HomeFaqItem[] = [
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
  {
    id: "choosing",
    question: "How do I choose the right products for my skin type?",
    answer:
      "Begin with cleanser, a targeted serum, and a moisturizer that matches your climate. Shop by category or use the ritual tabs on this page to browse step by step.",
  },
  {
    id: "layering",
    question: "Can I use multiple products together?",
    answer:
      "Yes. Cleanse, apply thinner textures first (serums), then cream or oil. Allow a short absorb time between steps so each layer can settle.",
  },
  {
    id: "frequency",
    question: "How often should I use your products?",
    answer:
      "Follow the product directions. Most daily serums and creams are designed for morning or evening use; start slower if your skin is adjusting.",
  },
];

export const HOME_SOCIAL = {
  eyebrow: "Skincare Rituals",
  lines: ["Our journey", "continues on social."] as const,
  followLabel: "Follow along",
  followHref: "https://instagram.com/zermae",
  handle: "@zermae",
} as const;

export type HomeSocialItem = {
  id: string;
  src: string;
  href: string;
  handle: string;
  alt: string;
};

const SOCIAL_HANDLES = ["@zermae", "@zermae.glow", "@Liana.k", "@zermae.skin", "@zermae.ritual"] as const;

export const HOME_SOCIAL_ITEMS: HomeSocialItem[] = MEDIA.social.map((src, index) => ({
  id: `social-${index + 1}`,
  src,
  href: "https://instagram.com/zermae",
  handle: SOCIAL_HANDLES[index] ?? HOME_SOCIAL.handle,
  alt: `${brandName} community portrait ${index + 1}`,
}));

export const HOME_JOURNAL = {
  eyebrow: "Beauty Insights",
  lines: ["Your source for", "better skin."] as const,
  ctaLabel: "View all",
  ctaHref: "/collections/all",
} as const;

export type HomeJournalItem = {
  id: string;
  title: string;
  date: string;
  href: string;
  src: string;
  alt: string;
};

export const HOME_JOURNAL_ITEMS: HomeJournalItem[] = [
  {
    id: "j1",
    title: "5 signs your skin needs more hydration",
    date: "1. 02. 2025",
    href: "/about-us",
    src: MEDIA.journal[0],
    alt: "Woman drinking water in warm light",
  },
  {
    id: "j2",
    title: "Choosing the right cleanser",
    date: "1. 02. 2025",
    href: "/collections/cleansers",
    src: MEDIA.journal[1],
    alt: "Woman cleansing face with soft foam",
  },
  {
    id: "j3",
    title: "Beginner skincare guide",
    date: "1. 02. 2025",
    href: "/collections/all",
    src: MEDIA.journal[2],
    alt: "Woman using cotton pads in soft light",
  },
];

export const HOME_NEWSLETTER = {
  eyebrow: "Glow Alerts",
  lines: ["Beauty starts in your inbox."] as const,
  support: "Sign up and receive exclusive skincare tips, product launches, and special discounts.",
  submitLabel: "Join waitlist",
} as const;

export const HOME_FOOTER = {
  statement: brandShortBio.slice(0, 120),
  brandMax: 200,
} as const;
