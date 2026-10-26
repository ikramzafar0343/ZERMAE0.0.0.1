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
    src: "/media/hero/portrait-poster.jpg",
    objectPosition: "62% 48%",
    status: "placeholder",
    note: "Replace with close braided-hair portrait; add silent MP4 at /media/hero/portrait.mp4",
  },
  heroVideo: {
    role: "hero-video",
    src: "",
    poster: "/media/hero/portrait-poster.jpg",
    status: "missing-video",
  },
  lifestylePoster: {
    role: "lifestyle-poster",
    src: "/media/lifestyle/skincare-poster.png",
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
    src: "/media/editorial/serum-portrait.jpg",
    objectPosition: "55% 35%",
    status: "ready",
  },
  mosaicRange: {
    role: "mosaic-range",
    src: "/media/editorial/product-range.png",
    objectPosition: "50% 45%",
    status: "ready",
  },
  mosaicDetail: {
    role: "mosaic-detail",
    src: "/media/editorial/skin-detail.png",
    objectPosition: "50% 40%",
    status: "ready",
  },
  storiesComposition: {
    role: "stories-composition",
    src: "/media/stories/product-composition.png",
    objectPosition: "50% 50%",
    status: "placeholder",
    note: "Replace with isolated peach-matched product still life",
  },
  newsletter: {
    role: "newsletter",
    src: "/media/newsletter/skincare-wide.jpg",
    objectPosition: "50% 45%",
    status: "ready",
    note: "Full-bleed glow alerts portrait with botanical corners",
  },
  collection: [
    "/media/products/collection-01.png",
    "/media/products/collection-02.png",
    "/media/products/collection-03.png",
    "/media/products/collection-04.png",
    "/media/products/collection-05.png",
    "/media/products/collection-06.png",
  ] as const,
  ritual: [
    "/media/products/ritual-01.png",
    "/media/products/ritual-02.png",
    "/media/products/ritual-03.png",
  ] as const,
  social: [
    "/media/social/portrait-01.jpg",
    "/media/social/portrait-02.jpg",
    "/media/social/portrait-03.jpg",
    "/media/social/portrait-04.jpg",
    "/media/social/portrait-05.jpg",
  ] as const, // square community portraits for social row
  journal: [
    "/media/journal/article-01.jpg",
    "/media/journal/article-02.jpg",
    "/media/journal/article-03.jpg",
  ] as const,
  avatars: [
    "/media/stories/avatar-01.png",
    "/media/stories/avatar-02.png",
    "/media/stories/avatar-03.png",
    "/media/stories/avatar-04.png",
    "/media/stories/avatar-05.png",
    "/media/stories/avatar-06.png",
  ] as const,
} as const;
