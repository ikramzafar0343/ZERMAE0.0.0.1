import { brandName, brandShortBio } from "@/constants/brand";
import { SKIN_MEDIA } from "@/lib/content/skincare-media";

export const SKIN_COPY = {
  heroEyebrow: "A MORE CONSIDERED RITUAL",
  heroLines: ["Skin, in its", "most natural", "element."] as const,
  heroIntro: "Thoughtful formulas for daily care — calm textures, honest language, and rituals that feel intuitive.",
  heroCta: "Discover the collection",
  heroCtaHref: "/collections/all",
  heroSecondary: "Our philosophy",
  heroSecondaryHref: "/about-us",
  manifestoEyebrow: "01 / OUR APPROACH",
  manifestoLines: ["Skincare should feel as", "intuitive as caring", "for yourself."] as const,
  manifestoSupport: brandShortBio.slice(0, 160),
  collectionEyebrow: "02 / THE ESSENTIALS",
  collectionTitle: "The essentials",
  collectionShopAll: "Shop all",
  storyEyebrow: "03 / MADE WITH INTENTION",
  storyTitle: "Care is a ritual.",
  storyBody:
    "Every formula is considered for daily use — botanical ingredients described clearly, textures chosen for comfort, and packaging made to live on your shelf with quiet confidence.",
  storyCta: "Read our story",
  storyCtaHref: "/about-us",
  routineTitle: ["Thoughtfully made.", "Beautifully simple."] as const,
  routineBenefits: [
    { id: "01", label: "Daily hydration", body: "Lightweight textures that keep skin comfortable through the day." },
    { id: "02", label: "Gentle finish", body: "Soft, balanced feel without heavy residue or exaggerated claims." },
    { id: "03", label: "Simple ritual", body: "Cleanse, treat, and protect — a calm three-step cadence." },
  ] as const,
  journeyLabel: "YOUR DAILY RITUAL",
  journeyStages: [
    {
      id: "cleanse",
      step: "01",
      word: "CLEANSE",
      title: "Start with a soft reset",
      body: "Remove the day gently so skin feels clear and ready for care.",
      image: SKIN_MEDIA.discoveryCleanse.src,
      href: "/collections/cleansers",
      cta: "Shop cleansers",
    },
    {
      id: "treat",
      step: "02",
      word: "TREAT",
      title: "Layer what skin needs",
      body: "Serums and targeted care that settle cleanly under moisturizer.",
      image: SKIN_MEDIA.discoveryTreat.src,
      href: "/collections/serums",
      cta: "Shop serums",
    },
    {
      id: "protect",
      step: "03",
      word: "PROTECT",
      title: "Seal comfort in",
      body: "Finish with cream or body care that keeps the barrier at ease.",
      image: SKIN_MEDIA.discoveryProtect.src,
      href: "/collections/creams",
      cta: "Shop creams",
    },
  ] as const,
  lifestyleEyebrow: "04 / REAL SKIN. REAL CARE.",
  lifestyleQuote: `“${brandName} keeps the ritual quiet — honest formulas, calm packaging, and skin that feels looked after.”`,
  journalTitle: "The skin journal",
  journalExplore: "Explore journal",
  journalExploreHref: "/about-us",
  journalItems: [
    {
      id: "j1",
      category: "Guidance",
      date: "Mar 2026",
      title: "Building a three-step morning ritual",
      href: "/about-us",
      image: SKIN_MEDIA.journal1.src,
    },
    {
      id: "j2",
      category: "Care",
      date: "Feb 2026",
      title: "Why texture matters as much as ingredients",
      href: "/collections/all",
      image: SKIN_MEDIA.journal2.src,
    },
  ] as const,
  footerHeading: "Your skin deserves care.",
  footerCta: "Explore skincare",
  footerCtaHref: "/collections/all",
} as const;

export type FeaturedSkinProduct = {
  id: string;
  title: string;
  benefit: string;
  size: string;
  price: number;
  image: string;
  category: string;
  tone: "mist" | "sand" | "taupe";
};
