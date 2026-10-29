"use server";

import { redirect } from "next/navigation";

import { ADMIN_ROLES } from "@/constants/roles";
import { DEFAULT_STOREFRONT_CONTENT, resolveStorefrontContent } from "@/constants/storefront";
import { storefrontPublishFromForm } from "@/features/admin/parse-storefront-form";
import { storefrontService } from "@/lib/api/storefront";
import { revalidateStorefront } from "@/lib/revalidate-storefront";
import { saveUpload } from "@/lib/save-upload";
import { getSessionUser } from "@/lib/session";

async function readImage(formData: FormData, field: string, existing = ""): Promise<string> {
  if (String(formData.get(`${field}Cleared`) ?? "") === "1") {
    return "";
  }
  const uploaded = await saveUpload(formData.get(`${field}File`) as File | null);
  if (uploaded) {
    return uploaded;
  }
  const fromForm = String(formData.get(field) ?? "").trim();
  if (fromForm) {
    return fromForm;
  }
  // Omitted/blank without clear (e.g. unmounted field) → keep live URL
  return existing;
}

async function readImageMap(
  formData: FormData,
  prefix: string,
  keys: string[],
  existing: Record<string, string>,
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const value = await readImage(formData, `${prefix}_${key}`, existing[key] ?? "");
      return [key, value] as const;
    }),
  );
  return Object.fromEntries(entries);
}

async function readImageList(
  formData: FormData,
  prefix: string,
  count: number,
  existing: readonly string[],
): Promise<string[]> {
  return Promise.all(
    Array.from({ length: count }, (_, index) => readImage(formData, `${prefix}_${index}`, existing[index] ?? "")),
  );
}

export async function updateCommerceSettingsAction(formData: FormData): Promise<{ error?: string }> {
  try {
    const user = await getSessionUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      redirect("/admin/login");
    }
    const current = await storefrontService.getFull();
    const live = resolveStorefrontContent(current.content);
    const home = live.home.sections;
    const collectionKeys = Object.keys(DEFAULT_STOREFRONT_CONTENT.collectionPages);
    const categoryCount = Math.min(8, Math.max(0, Number(formData.get("categoryCount") ?? 0)));
    const categoryIndexes = Array.from({ length: categoryCount }, (_, index) => index);
    const reviewCount = Math.min(12, Math.max(0, Number(formData.get("homeReviewCount") ?? 0)));
    const socialCount = Math.min(8, Math.max(0, Number(formData.get("homeSocialCount") ?? 0)));
    const journalCount = Math.min(8, Math.max(0, Number(formData.get("homeJournalCount") ?? 0)));

    const existingCollectionHero = Object.fromEntries(
      collectionKeys.map((key) => [key, live.collectionPages[key]?.heroSrc ?? ""]),
    );
    const existingCollectionRitual = Object.fromEntries(
      collectionKeys.map((key) => [key, live.collectionPages[key]?.ritualImage ?? ""]),
    );

    const existingHeroBanners =
      home.hero.banners?.filter((slide) => slide.desktop || slide.mobile).length
        ? home.hero.banners
            .filter((slide) => slide.desktop || slide.mobile)
            .slice(0, 5)
            .map((slide) => ({
              desktop: slide.desktop || slide.mobile,
              mobile: slide.mobile || "",
            }))
        : home.hero.posterSrc
          ? [{ desktop: home.hero.posterSrc, mobile: "" }]
          : [];
    const heroBannerCount = Math.min(
      5,
      Math.max(1, Number(formData.get("homeHeroBannerCount") ?? existingHeroBanners.length) || 1),
    );

    const [
      logoSrc,
      logoOnLightSrc,
      heroBannerDesktops,
      heroBannerMobiles,
      lifestylePosterSrc,
      lifestyleBeforeSrc,
      lifestyleAfterSrc,
      mosaicLeftSrc,
      mosaicRangeSrc,
      mosaicDetailSrc,
      storiesCompositionSrc,
      newsletterImageSrc,
      aboutImageSrc,
      contactImageSrc,
      faqPageImageSrc,
      authLoginSrc,
      authRegisterSrc,
      authAdminSrc,
      categoryImages,
      collectionHeroSrc,
      collectionRitualSrc,
      collectionTileOverrides,
      ritualTileOverrides,
      reviewAvatars,
      socialImages,
      journalImages,
    ] = await Promise.all([
      readImage(formData, "logoSrc", live.brand.logoSrc),
      readImage(formData, "logoOnLightSrc", live.brand.logoOnLightSrc),
      readImageList(
        formData,
        "heroBannerDesktop",
        heroBannerCount,
        existingHeroBanners.map((slide) => slide.desktop),
      ),
      readImageList(
        formData,
        "heroBannerMobile",
        heroBannerCount,
        existingHeroBanners.map((slide) => slide.mobile),
      ),
      readImage(formData, "lifestylePosterSrc", home.lifestyle.beforeSrc || home.lifestyle.posterSrc),
      readImage(formData, "lifestyleBeforeSrc", home.lifestyle.beforeSrc || home.lifestyle.posterSrc),
      readImage(formData, "lifestyleAfterSrc", home.lifestyle.afterSrc || ""),
      readImage(formData, "mosaicLeftSrc", home.mosaic.leftSrc),
      readImage(formData, "mosaicRangeSrc", home.mosaic.rangeSrc),
      readImage(formData, "mosaicDetailSrc", home.mosaic.detailSrc),
      readImage(formData, "storiesCompositionSrc", home.stories.compositionSrc),
      readImage(formData, "newsletterImageSrc", home.newsletter.imageSrc),
      readImage(formData, "aboutImageSrc", live.pageTemplates.about.imageSrc),
      readImage(formData, "contactImageSrc", live.pageTemplates.contact.imageSrc),
      readImage(formData, "faqPageImageSrc", live.pageTemplates.faq.imageSrc || live.faqImage),
      readImage(formData, "authLoginSrc", live.authLoginSrc),
      readImage(formData, "authRegisterSrc", live.authRegisterSrc),
      readImage(formData, "authAdminSrc", live.authAdminSrc),
      Promise.all(
        categoryIndexes.map((index) =>
          readImage(formData, `categoryImage_${index}`, live.shopCategories[index]?.image ?? ""),
        ),
      ),
      readImageMap(formData, "collectionHero", collectionKeys, existingCollectionHero),
      readImageMap(formData, "collectionRitual", collectionKeys, existingCollectionRitual),
      readImageList(formData, "collectionTile", 6, home.collection.tileImageOverrides),
      readImageList(formData, "ritualTile", 3, home.ritual.tileImageOverrides),
      readImageList(
        formData,
        "homeReviewAvatar",
        reviewCount,
        home.stories.reviews.map((review) => review.avatar),
      ),
      readImageList(
        formData,
        "homeSocialSrc",
        socialCount,
        home.social.items.map((item) => item.src),
      ),
      readImageList(
        formData,
        "homeJournalSrc",
        journalCount,
        home.journal.articles.map((item) => item.src),
      ),
    ]);

    const cleanedHeroBanners = Array.from({ length: heroBannerCount }, (_, index) => {
      const desktop = (heroBannerDesktops[index] ?? "").trim();
      const mobile = (heroBannerMobiles[index] ?? "").trim();
      return { desktop: desktop || mobile, mobile };
    })
      .filter((slide) => slide.desktop || slide.mobile)
      .slice(0, 5);
    const heroPosterSrc = cleanedHeroBanners[0]?.desktop ?? "";

    const published = storefrontPublishFromForm(formData, {
      logoSrc,
      logoOnLightSrc,
      heroPosterSrc,
      heroBanners: cleanedHeroBanners,
      lifestylePosterSrc,
      lifestyleBeforeSrc,
      lifestyleAfterSrc,
      mosaicLeftSrc,
      mosaicRangeSrc,
      mosaicDetailSrc,
      storiesCompositionSrc,
      newsletterImageSrc,
      aboutImageSrc,
      contactImageSrc,
      faqPageImageSrc,
      authLoginSrc,
      authRegisterSrc,
      authAdminSrc,
      categoryImages,
      collectionHeroSrc,
      collectionRitualSrc,
      collectionTileOverrides,
      ritualTileOverrides,
      reviewAvatars,
      socialImages,
      journalImages,
      heroProductSrc: heroPosterSrc,
      brandStoryPrimarySrc: "",
      brandStorySecondarySrc: "",
      brandStoryPortraitSrc: "",
      productHighlightsImage: "",
      glowStatsImage: "",
      faqImage: faqPageImageSrc,
      collectionImages: collectionRitualSrc,
    });

    // Force exact CMS image paths including clears
    published.content.brand.logoSrc = logoSrc;
    published.content.brand.logoOnLightSrc = logoOnLightSrc;
    published.content.home.sections.hero.banners = cleanedHeroBanners;
    published.content.home.sections.hero.posterSrc = heroPosterSrc;
    published.content.home.sections.lifestyle.beforeSrc = lifestyleBeforeSrc || lifestylePosterSrc;
    published.content.home.sections.lifestyle.afterSrc = lifestyleAfterSrc;
    published.content.home.sections.lifestyle.posterSrc =
      lifestyleBeforeSrc || lifestylePosterSrc || published.content.home.sections.lifestyle.posterSrc;
    published.content.home.sections.mosaic.leftSrc = mosaicLeftSrc;
    published.content.home.sections.mosaic.rangeSrc = mosaicRangeSrc;
    published.content.home.sections.mosaic.detailSrc = mosaicDetailSrc;
    published.content.home.sections.stories.compositionSrc = storiesCompositionSrc;
    published.content.home.sections.newsletter.imageSrc = newsletterImageSrc;
    published.content.pageTemplates.about.imageSrc = aboutImageSrc;
    published.content.pageTemplates.contact.imageSrc = contactImageSrc;
    published.content.pageTemplates.faq.imageSrc = faqPageImageSrc;
    published.content.faqImage = faqPageImageSrc;
    published.content.authLoginSrc = authLoginSrc;
    published.content.authRegisterSrc = authRegisterSrc;
    published.content.authAdminSrc = authAdminSrc;
    published.content.home.sections.collection.tileImageOverrides = collectionTileOverrides;
    published.content.home.sections.ritual.tileImageOverrides = ritualTileOverrides;
    published.content.home.sections.stories.reviews.forEach((review, index) => {
      review.avatar = reviewAvatars[index] ?? review.avatar;
    });
    published.content.home.sections.social.items.forEach((item, index) => {
      item.src = socialImages[index] ?? item.src;
    });
    published.content.home.sections.journal.articles.forEach((item, index) => {
      item.src = journalImages[index] ?? item.src;
    });
    for (const key of collectionKeys) {
      const page = published.content.collectionPages[key];
      if (page) {
        page.heroSrc = collectionHeroSrc[key] ?? "";
        page.ritualImage = collectionRitualSrc[key] ?? "";
      }
    }
    categoryIndexes.forEach((index) => {
      const category = published.content.shopCategories[index];
      if (category) category.image = categoryImages[index] ?? "";
    });

    published.content.maintenanceMode = current.content.maintenanceMode;
    published.content.maintenanceMessage = current.content.maintenanceMessage;
    published.content.emailFrom = current.content.emailFrom;

    await storefrontService.updatePublished(published.commerce, published.theme, published.content);
    revalidateStorefront();
    redirect("/admin/customer-side");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "Storefront could not be published" };
  }
}
