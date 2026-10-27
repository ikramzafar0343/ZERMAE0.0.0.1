import { type CommerceSettings, DEFAULT_COMMERCE_SETTINGS, resolveCommerceSettings } from "@/constants/commerce";
import {
  DEFAULT_STOREFRONT_CONTENT,
  HOME_SECTION_IDS,
  type HomeSectionId,
  resolveStorefrontContent,
  resolveStorefrontTheme,
  type StorefrontContent,
  type StorefrontTheme,
} from "@/constants/storefront";

export type StorefrontFormImages = {
  logoSrc: string;
  logoOnLightSrc: string;
  heroPosterSrc: string;
  heroBanners: string[];
  lifestylePosterSrc: string;
  lifestyleBeforeSrc: string;
  lifestyleAfterSrc: string;
  mosaicLeftSrc: string;
  mosaicRangeSrc: string;
  mosaicDetailSrc: string;
  storiesCompositionSrc: string;
  newsletterImageSrc: string;
  aboutImageSrc: string;
  contactImageSrc: string;
  faqPageImageSrc: string;
  authLoginSrc: string;
  authRegisterSrc: string;
  authAdminSrc: string;
  categoryImages: string[];
  collectionHeroSrc: Record<string, string>;
  collectionRitualSrc: Record<string, string>;
  collectionTileOverrides: string[];
  ritualTileOverrides: string[];
  reviewAvatars: string[];
  socialImages: string[];
  journalImages: string[];
  /** Legacy fields kept for resolve compatibility */
  heroProductSrc: string;
  brandStoryPrimarySrc: string;
  brandStorySecondarySrc: string;
  brandStoryPortraitSrc: string;
  productHighlightsImage: string;
  glowStatsImage: string;
  faqImage: string;
  collectionImages: Record<string, string>;
};

export type StorefrontPublishPayload = {
  commerce: CommerceSettings;
  theme: StorefrontTheme;
  content: StorefrontContent;
};

function readMenu(formData: FormData, prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: String(formData.get(`${prefix}Id_${index}`) ?? `${prefix}-${index + 1}`),
    label: String(formData.get(`${prefix}Label_${index}`) ?? ""),
    path: String(formData.get(`${prefix}Path_${index}`) ?? "/"),
    hidden: formData.get(`${prefix}Hidden_${index}`) === "on",
  }));
}

export function storefrontPublishFromForm(formData: FormData, images: StorefrontFormImages): StorefrontPublishPayload {
  const collectionKeys = Object.keys(DEFAULT_STOREFRONT_CONTENT.collectionPages);
  const categoryCount = Math.min(8, Math.max(0, Number(formData.get("categoryCount") ?? 0)));
  const categoryIndexes = Array.from({ length: categoryCount }, (_, index) => index);

  const orderRaw = String(formData.get("homeSectionOrder") ?? HOME_SECTION_IDS.join(","));
  const sectionOrder = orderRaw
    .split(",")
    .map((item) => item.trim())
    .filter((id): id is HomeSectionId => (HOME_SECTION_IDS as readonly string[]).includes(id));

  const reviewCount = Math.min(12, Math.max(0, Number(formData.get("homeReviewCount") ?? 0)));
  const homeFaqCount = Math.min(12, Math.max(0, Number(formData.get("homeFaqCount") ?? 0)));
  const socialCount = Math.min(8, Math.max(0, Number(formData.get("homeSocialCount") ?? 0)));
  const journalCount = Math.min(8, Math.max(0, Number(formData.get("homeJournalCount") ?? 0)));
  const pageFaqCount = Math.min(12, Math.max(0, Number(formData.get("pageFaqCount") ?? 0)));

  const home = {
    sectionOrder: sectionOrder.length ? sectionOrder : [...HOME_SECTION_IDS],
    sections: {
      hero: {
        hidden: formData.get("homeHeroHidden") === "on",
        line1: String(formData.get("homeHeroLine1") ?? ""),
        line2: String(formData.get("homeHeroLine2") ?? ""),
        support: String(formData.get("homeHeroSupport") ?? ""),
        ctaLabel: String(formData.get("homeHeroCtaLabel") ?? ""),
        ctaHref: String(formData.get("homeHeroCtaHref") ?? "/collections/all"),
        scrollLabel: String(formData.get("homeHeroScrollLabel") ?? "Scroll down"),
        posterSrc: images.heroBanners[0] || images.heroPosterSrc,
        banners: (images.heroBanners.length
          ? images.heroBanners
          : images.heroPosterSrc
            ? [images.heroPosterSrc]
            : []
        )
          .map((src) => src.trim())
          .filter(Boolean)
          .slice(0, 5),
      },
      collection: {
        hidden: formData.get("homeCollectionHidden") === "on",
        eyebrow: String(formData.get("homeCollectionEyebrow") ?? ""),
        line1: String(formData.get("homeCollectionLine1") ?? ""),
        line2: String(formData.get("homeCollectionLine2") ?? ""),
        tileImageOverrides: images.collectionTileOverrides,
      },
      lifestyle: {
        hidden: formData.get("homeLifestyleHidden") === "on",
        eyebrow: String(formData.get("homeLifestyleEyebrow") ?? ""),
        heading: String(formData.get("homeLifestyleHeading") ?? ""),
        posterSrc: images.lifestylePosterSrc || images.lifestyleBeforeSrc,
        beforeSrc: images.lifestyleBeforeSrc || images.lifestylePosterSrc,
        afterSrc: images.lifestyleAfterSrc,
      },
      mosaic: {
        hidden: formData.get("homeMosaicHidden") === "on",
        eyebrow: String(formData.get("homeMosaicEyebrow") ?? ""),
        line1: String(formData.get("homeMosaicLine1") ?? ""),
        line2: String(formData.get("homeMosaicLine2") ?? ""),
        panelHeading: String(formData.get("homeMosaicPanelHeading") ?? ""),
        panelBody: String(formData.get("homeMosaicPanelBody") ?? ""),
        upperCaptionHeading: String(formData.get("homeMosaicUpperHeading") ?? ""),
        upperCaptionBody: String(formData.get("homeMosaicUpperBody") ?? ""),
        lowerCaptionHeading: String(formData.get("homeMosaicLowerHeading") ?? ""),
        lowerCaptionBody: String(formData.get("homeMosaicLowerBody") ?? ""),
        leftSrc: images.mosaicLeftSrc,
        rangeSrc: images.mosaicRangeSrc,
        detailSrc: images.mosaicDetailSrc,
      },
      ritual: {
        hidden: formData.get("homeRitualHidden") === "on",
        eyebrow: String(formData.get("homeRitualEyebrow") ?? ""),
        line1: String(formData.get("homeRitualLine1") ?? ""),
        line2: String(formData.get("homeRitualLine2") ?? ""),
        empty: String(formData.get("homeRitualEmpty") ?? ""),
        tileImageOverrides: images.ritualTileOverrides,
      },
      stories: {
        hidden: formData.get("homeStoriesHidden") === "on",
        eyebrow: String(formData.get("homeStoriesEyebrow") ?? ""),
        line1: String(formData.get("homeStoriesLine1") ?? ""),
        line2: String(formData.get("homeStoriesLine2") ?? ""),
        compositionSrc: images.storiesCompositionSrc,
        reviews: Array.from({ length: reviewCount }, (_, index) => ({
          id: String(formData.get(`homeReviewId_${index}`) ?? `r${index + 1}`),
          title: String(formData.get(`homeReviewTitle_${index}`) ?? ""),
          body: String(formData.get(`homeReviewBody_${index}`) ?? ""),
          name: String(formData.get(`homeReviewName_${index}`) ?? ""),
          context: String(formData.get(`homeReviewContext_${index}`) ?? ""),
          avatar: images.reviewAvatars[index] ?? "",
        })),
      },
      faq: {
        hidden: formData.get("homeFaqHidden") === "on",
        eyebrow: String(formData.get("homeFaqEyebrow") ?? ""),
        line1: String(formData.get("homeFaqLine1") ?? ""),
        line2: String(formData.get("homeFaqLine2") ?? ""),
        intro: String(formData.get("homeFaqIntro") ?? ""),
        items: Array.from({ length: homeFaqCount }, (_, index) => ({
          id: String(formData.get(`homeFaqId_${index}`) ?? `faq-${index + 1}`),
          question: String(formData.get(`homeFaqQuestion_${index}`) ?? ""),
          answer: String(formData.get(`homeFaqAnswer_${index}`) ?? ""),
        })),
      },
      social: {
        hidden: formData.get("homeSocialHidden") === "on",
        eyebrow: String(formData.get("homeSocialEyebrow") ?? ""),
        line1: String(formData.get("homeSocialLine1") ?? ""),
        line2: String(formData.get("homeSocialLine2") ?? ""),
        followLabel: String(formData.get("homeSocialFollowLabel") ?? ""),
        followHref: String(formData.get("homeSocialFollowHref") ?? ""),
        handle: String(formData.get("homeSocialHandle") ?? ""),
        items: Array.from({ length: socialCount }, (_, index) => ({
          id: String(formData.get(`homeSocialId_${index}`) ?? `social-${index + 1}`),
          src: images.socialImages[index] ?? "",
          href: String(formData.get(`homeSocialHref_${index}`) ?? ""),
          handle: String(formData.get(`homeSocialItemHandle_${index}`) ?? ""),
          alt: String(formData.get(`homeSocialAlt_${index}`) ?? ""),
        })),
      },
      journal: {
        hidden: formData.get("homeJournalHidden") === "on",
        eyebrow: String(formData.get("homeJournalEyebrow") ?? ""),
        line1: String(formData.get("homeJournalLine1") ?? ""),
        line2: String(formData.get("homeJournalLine2") ?? ""),
        ctaLabel: String(formData.get("homeJournalCtaLabel") ?? ""),
        ctaHref: String(formData.get("homeJournalCtaHref") ?? ""),
        articles: Array.from({ length: journalCount }, (_, index) => ({
          id: String(formData.get(`homeJournalId_${index}`) ?? `j${index + 1}`),
          title: String(formData.get(`homeJournalTitle_${index}`) ?? ""),
          date: String(formData.get(`homeJournalDate_${index}`) ?? ""),
          href: String(formData.get(`homeJournalHref_${index}`) ?? "/"),
          src: images.journalImages[index] ?? "",
          alt: String(formData.get(`homeJournalAlt_${index}`) ?? ""),
        })),
      },
      newsletter: {
        hidden: formData.get("homeNewsletterHidden") === "on",
        eyebrow: String(formData.get("homeNewsletterEyebrow") ?? ""),
        line1: String(formData.get("homeNewsletterLine1") ?? ""),
        support: String(formData.get("homeNewsletterSupport") ?? ""),
        submitLabel: String(formData.get("homeNewsletterSubmit") ?? ""),
        imageSrc: images.newsletterImageSrc,
      },
    },
  };

  const pageTemplates = {
    about: {
      imageSrc: images.aboutImageSrc,
      imageAlt: String(formData.get("aboutImageAlt") ?? ""),
      eyebrow: String(formData.get("aboutEyebrow") ?? ""),
      copy: String(formData.get("aboutCopy") ?? ""),
      ctaLabel: String(formData.get("aboutCtaLabel") ?? ""),
      ctaHref: String(formData.get("aboutCtaHref") ?? "/collections/all"),
    },
    contact: {
      imageSrc: images.contactImageSrc,
      imageAlt: String(formData.get("contactImageAlt") ?? ""),
      lead: String(formData.get("contactLead") ?? ""),
      supportPhone: String(formData.get("supportPhone") ?? ""),
    },
    faq: {
      imageSrc: images.faqPageImageSrc || images.faqImage,
      imageAlt: String(formData.get("faqImageAlt") ?? "Frequently asked questions"),
      items: Array.from({ length: pageFaqCount }, (_, index) => ({
        id: String(formData.get(`pageFaqId_${index}`) ?? `pf-${index + 1}`),
        question: String(formData.get(`pageFaqQuestion_${index}`) ?? ""),
        answer: String(formData.get(`pageFaqAnswer_${index}`) ?? ""),
      })),
    },
    privacy: {
      title: String(formData.get("privacyTitle") ?? "Privacy Policy"),
      lead: String(formData.get("privacyLead") ?? ""),
      body: String(formData.get("privacyBody") ?? ""),
    },
    terms: {
      title: String(formData.get("termsTitle") ?? "Terms of Service"),
      lead: String(formData.get("termsLead") ?? ""),
      body: String(formData.get("termsBody") ?? ""),
    },
    shipping: {
      title: String(formData.get("shippingTitle") ?? "Shipping"),
      lead: String(formData.get("shippingLead") ?? ""),
      body: String(formData.get("shippingBody") ?? ""),
    },
    returns: {
      title: String(formData.get("returnsTitle") ?? "Returns & Exchanges"),
      lead: String(formData.get("returnsLead") ?? ""),
      body: String(formData.get("returnsBody") ?? ""),
    },
  };

  const collectionPages = Object.fromEntries(
    collectionKeys.map((key) => [
      key,
      {
        heroSrc: images.collectionHeroSrc[key] ?? "",
        titleFirst: String(formData.get(`collectionFirst_${key}`) ?? ""),
        titleSecond: String(formData.get(`collectionSecond_${key}`) ?? ""),
        ritualImage: images.collectionRitualSrc[key] ?? images.collectionImages[key] ?? "",
        ritualTitle: String(formData.get(`collectionRitualTitle_${key}`) ?? ""),
        ritualMark: String(formData.get(`collectionRitualMark_${key}`) ?? ""),
        ritualNote1Title: String(formData.get(`collectionNote1Title_${key}`) ?? ""),
        ritualNote1Body: String(formData.get(`collectionNote1Body_${key}`) ?? ""),
        ritualNote2Title: String(formData.get(`collectionNote2Title_${key}`) ?? ""),
        ritualNote2Body: String(formData.get(`collectionNote2Body_${key}`) ?? ""),
      },
    ]),
  );

  const shopCategories = categoryIndexes.map((index) => ({
    id: String(formData.get(`categoryId_${index}`) ?? `cat-${index + 1}`),
    title: String(formData.get(`categoryTitle_${index}`) ?? ""),
    description: String(formData.get(`categoryDescription_${index}`) ?? ""),
    href: String(formData.get(`categoryHref_${index}`) ?? "/collections/all"),
    image: images.categoryImages[index] ?? "",
    alt: String(formData.get(`categoryTitle_${index}`) ?? "Category"),
    icon: String(formData.get(`categoryIcon_${index}`) ?? "sparkle"),
    color: String(formData.get(`categoryColor_${index}`) ?? ""),
    hidden: formData.get(`categoryHidden_${index}`) === "on",
  }));

  const headerCount = Math.min(16, Math.max(0, Number(formData.get("headerNavCount") ?? 0)));
  const footerShopCount = Math.min(16, Math.max(0, Number(formData.get("footerShopCount") ?? 0)));
  const footerHouseCount = Math.min(16, Math.max(0, Number(formData.get("footerHouseCount") ?? 0)));
  const footerPoliciesCount = Math.min(16, Math.max(0, Number(formData.get("footerPoliciesCount") ?? 0)));

  const theme = resolveStorefrontTheme({
    bg: formData.get("themeBg"),
    primary: formData.get("themePrimary"),
    secondary: formData.get("themeSecondary"),
    accent: formData.get("themeAccent"),
    mint: formData.get("themeMint"),
    blush: formData.get("themeBlush"),
  });

  return {
    theme,
    commerce: resolveCommerceSettings({
      currency: DEFAULT_COMMERCE_SETTINGS.currency,
      standardShippingFee: Number(formData.get("standardShippingFee") ?? 0),
      freeShippingThreshold: Number(formData.get("freeShippingThreshold") ?? 0),
      freeShippingEnabled: formData.get("freeShippingEnabled") === "on",
      taxEnabled: formData.get("taxEnabled") === "on",
      taxRate: Number(formData.get("taxRate") ?? 0),
      taxLabel: DEFAULT_COMMERCE_SETTINGS.taxLabel,
    }),
    content: resolveStorefrontContent({
      ...DEFAULT_STOREFRONT_CONTENT,
      heroHeadline: formData.get("homeHeroLine1"),
      heroSupport: formData.get("homeHeroSupport"),
      heroProductSrc: images.heroProductSrc || images.heroPosterSrc,
      faqImage: images.faqPageImageSrc || images.faqImage,
      faqImageAlt: formData.get("faqImageAlt"),
      faqItems: pageTemplates.faq.items,
      footerStatementLead: formData.get("footerStatementLead"),
      footerStatementEnd: formData.get("footerStatementEnd"),
      socialFacebook: formData.get("socialFacebook"),
      socialInstagram: formData.get("socialInstagram"),
      socialPinterest: formData.get("socialPinterest"),
      aboutCopy: pageTemplates.about.copy,
      contactLead: pageTemplates.contact.lead,
      supportPhone: pageTemplates.contact.supportPhone,
      authLoginSrc: images.authLoginSrc,
      authRegisterSrc: images.authRegisterSrc,
      authAdminSrc: images.authAdminSrc,
      shopCategories,
      navLinks: readMenu(formData, "nav", Math.min(12, Math.max(0, Number(formData.get("navCount") ?? 0)))),
      collectionImages: Object.fromEntries(
        collectionKeys.map((key) => [key, images.collectionRitualSrc[key] || images.collectionImages[key] || ""]),
      ),
      collectionTitles: Object.fromEntries(
        collectionKeys.map((key) => [
          key,
          {
            first: String(formData.get(`collectionFirst_${key}`) ?? ""),
            second: String(formData.get(`collectionSecond_${key}`) ?? ""),
          },
        ]),
      ),
      bestSellerSkus: [formData.get("bestSellerSku1"), formData.get("bestSellerSku2"), formData.get("bestSellerSku3")],
      bestSellerColors: [formData.get("bestSellerColor1"), formData.get("bestSellerColor2"), formData.get("bestSellerColor3")],
      heroStageColor: formData.get("heroStageColor"),
      productCardColors: [
        formData.get("productCardColor1"),
        formData.get("productCardColor2"),
        formData.get("productCardColor3"),
      ],
      brand: {
        siteName: String(formData.get("brandSiteName") ?? ""),
        logoSrc: images.logoSrc,
        logoOnLightSrc: images.logoOnLightSrc,
      },
      menus: {
        header: readMenu(formData, "headerNav", headerCount),
        footerShop: readMenu(formData, "footerShop", footerShopCount),
        footerHouse: readMenu(formData, "footerHouse", footerHouseCount),
        footerPolicies: readMenu(formData, "footerPolicies", footerPoliciesCount),
      },
      home,
      pageTemplates,
      collectionPages,
    }),
  };
}
