export type MediaStatus = "ready" | "placeholder" | "missing-video";

export type MediaAsset = {
  role: string;
  src: string;
  poster?: string;
  objectPosition?: string;
  status: MediaStatus;
  note?: string;
};

export const MEDIA = {
  wordmark: {
    role: "brand-wordmark",
    src: "/media/brand/wordmark.png",
    status: "ready",
  },
  wordmarkLight: {
    role: "brand-wordmark-light",
    src: "/media/brand/wordmark-light.png",
    status: "ready",
  },
  heroPoster: {
    role: "hero-poster",
    src: "/media/hero/portrait-poster.webp",
    objectPosition: "62% 48%",
    status: "placeholder",
    note: "Replace with close braided-hair portrait; add silent MP4 at /media/hero/portrait.mp4",
  },
  heroVideo: {
    role: "hero-video",
    src: "",
    poster: "/media/hero/portrait-poster.webp",
    status: "missing-video",
  },
  lifestylePoster: {
    role: "lifestyle-poster",
    src: "/media/lifestyle/skincare-poster.webp",
    objectPosition: "50% 40%",
    status: "placeholder",
    note: "Replace with warm curly-hair cream application portrait; add /media/lifestyle/skincare.mp4",
  },
  lifestyleVideo: {
    role: "lifestyle-video",
    src: "",
    status: "missing-video",
  },
  mosaicLeft: {
    role: "mosaic-left",
    src: "/media/editorial/serum-portrait.webp",
    objectPosition: "55% 35%",
    status: "ready",
  },
  mosaicRange: {
    role: "mosaic-range",
    src: "/media/editorial/product-range.webp",
    objectPosition: "50% 45%",
    status: "ready",
  },
  mosaicDetail: {
    role: "mosaic-detail",
    src: "/media/editorial/skin-detail.webp",
    objectPosition: "50% 40%",
    status: "ready",
  },
  storiesComposition: {
    role: "stories-composition",
    src: "/media/stories/product-composition.webp",
    objectPosition: "50% 50%",
    status: "placeholder",
    note: "Replace with isolated peach-matched product still life",
  },
  newsletter: {
    role: "newsletter",
    src: "/media/newsletter/skincare-wide.webp",
    objectPosition: "50% 45%",
    status: "ready",
    note: "Full-bleed glow alerts portrait with botanical corners",
  },
  collection: [
    "/media/products/collection-01.webp",
    "/media/products/collection-02.webp",
    "/media/products/collection-03.webp",
    "/media/products/collection-04.webp",
    "/media/products/collection-05.webp",
    "/media/products/collection-06.webp",
  ] as const,
  ritual: [
    "/media/products/ritual-01.webp",
    "/media/products/ritual-02.webp",
    "/media/products/ritual-03.webp",
  ] as const,
  social: [
    "/media/social/portrait-01.jpg",
    "/media/social/portrait-02.jpg",
    "/media/social/portrait-03.jpg",
    "/media/social/portrait-04.jpg",
    "/media/social/portrait-05.jpg",
  ] as const, // square community portraits for social row
  journal: [
    "/media/journal/article-01.webp",
    "/media/journal/article-02.webp",
    "/media/journal/article-03.webp",
  ] as const,
  avatars: [
    "/media/stories/avatar-01.webp",
    "/media/stories/avatar-02.webp",
    "/media/stories/avatar-03.webp",
    "/media/stories/avatar-04.webp",
    "/media/stories/avatar-05.webp",
    "/media/stories/avatar-06.webp",
  ] as const,
} as const;
