export type SkinMediaStatus = "ready" | "placeholder";

export type SkinAsset = {
  src: string;
  objectPosition?: string;
  status: SkinMediaStatus;
  note?: string;
};

export const SKIN_MEDIA = {
  heroPortrait: {
    src: "/images/skincare/hero-portrait.jpg",
    objectPosition: "68% 28%",
    status: "placeholder",
    note: "Replace with art-directed 4:5 portrait, face upper-right",
  },
  heroProduct: {
    src: "/images/skincare/hero-product.png",
    status: "placeholder",
    note: "Transparent packshot WebP",
  },
  cleanser: { src: "/images/skincare/product-cleanser.png", status: "placeholder" as const },
  serum: { src: "/images/skincare/product-serum.png", status: "placeholder" as const },
  moisturizer: { src: "/images/skincare/product-moisturizer.png", status: "placeholder" as const },
  storyTexture: {
    src: "/images/skincare/story-texture.png",
    objectPosition: "50% 40%",
    status: "placeholder" as const,
  },
  routinePrimary: {
    src: "/images/skincare/routine-primary.jpg",
    objectPosition: "50% 30%",
    status: "placeholder" as const,
  },
  routineDetail: {
    src: "/images/skincare/routine-detail.png",
    objectPosition: "50% 50%",
    status: "placeholder" as const,
  },
  discoveryCleanse: { src: "/images/skincare/discovery-cleanse.png", status: "placeholder" as const },
  discoveryTreat: { src: "/images/skincare/discovery-treat.png", status: "placeholder" as const },
  discoveryProtect: { src: "/images/skincare/discovery-protect.png", status: "placeholder" as const },
  lifestyleWide: {
    src: "/images/skincare/lifestyle-wide.jpg",
    objectPosition: "50% 35%",
    status: "placeholder" as const,
  },
  journal1: { src: "/images/skincare/journal-1.jpg", status: "placeholder" as const },
  journal2: { src: "/images/skincare/journal-2.png", status: "placeholder" as const },
} satisfies Record<string, SkinAsset>;
