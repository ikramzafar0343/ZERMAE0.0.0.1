"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { resolveCommerceSettings } from "@/constants/commerce";
import {
  HOME_SECTION_LABELS,
  type HomeSectionId,
  resolveStorefrontContent,
  resolveStorefrontTheme,
  SHOP_CATEGORY_ICONS,
  type StorefrontNavLink,
  type StorefrontShopCategory,
} from "@/constants/storefront";
import { IconStorefront } from "@/features/admin/admin-nav-icons";
import { ColorField } from "@/features/admin/color-field";
import { ImageUrlField } from "@/features/admin/image-url-field";
import { updateCommerceSettingsAction } from "@/features/admin/storefront-actions";
import { UnsavedGuard } from "@/features/admin/unsaved-guard";
import type { StorefrontState } from "@/lib/api/storefront";

const TABS = [
  { id: "theme", label: "Theme" },
  { id: "home", label: "Home" },
  { id: "collections", label: "Collections" },
  { id: "pages", label: "Pages" },
  { id: "navigation", label: "Navigation" },
  { id: "shop", label: "Shop" },
  { id: "checkout", label: "Checkout" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SoftInput({
  label,
  hint,
  name,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div className="admin-product-field">
      <label className="admin-product-label" htmlFor={name}>
        {label}
      </label>
      {hint ? <p className="admin-product-kicker">{hint}</p> : null}
      <input id={name} name={name} className="admin-product-soft" {...props} />
    </div>
  );
}

function SoftArea({
  label,
  name,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="admin-product-field admin-product-field--full">
      <label className="admin-product-label" htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} className="admin-product-soft admin-product-soft-area" {...props} />
    </div>
  );
}

function PublishButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-product-cta" disabled={pending}>
      {pending ? "Publishing..." : "Publish"}
    </button>
  );
}

function SkuSelect({
  label,
  name,
  value,
  catalog,
}: {
  label: string;
  name: string;
  value: string;
  catalog: { sku: string; title: string }[];
}) {
  const options = catalog.some((item) => item.sku === value) || !value ? catalog : [{ sku: value, title: value }, ...catalog];
  return (
    <div className="admin-product-field">
      <label className="admin-product-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} className="admin-product-soft admin-product-select" defaultValue={value}>
        <option value="">Select a published product</option>
        {options.map((item) => (
          <option key={`${name}-${item.sku}`} value={item.sku}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function MenuEditor({
  title,
  prefix,
  links,
  setLinks,
}: {
  title: string;
  prefix: string;
  links: StorefrontNavLink[];
  setLinks: (next: StorefrontNavLink[] | ((current: StorefrontNavLink[]) => StorefrontNavLink[])) => void;
}) {
  return (
    <section className="admin-product-card">
      <div className="admin-storefront-row">
        <h2 className="admin-product-card-title">{title}</h2>
        <button
          type="button"
          className="admin-orders-filter"
          onClick={() =>
            setLinks((current) => [
              ...current,
              { id: `${prefix}-${Date.now()}`, label: "New link", path: "/", hidden: false },
            ])
          }
        >
          Add link
        </button>
      </div>
      <input type="hidden" name={`${prefix}Count`} value={links.length} />
      {links.map((item, index) => (
        <div key={item.id} className="admin-storefront-inline-card">
          <input type="hidden" name={`${prefix}Id_${index}`} value={item.id} />
          <SoftInput
            label="Label"
            name={`${prefix}Label_${index}`}
            defaultValue={item.label}
            onChange={(event) =>
              setLinks((current) =>
                current.map((entry, i) => (i === index ? { ...entry, label: event.target.value } : entry)),
              )
            }
          />
          <SoftInput
            label="Path"
            name={`${prefix}Path_${index}`}
            defaultValue={item.path}
            onChange={(event) =>
              setLinks((current) =>
                current.map((entry, i) => (i === index ? { ...entry, path: event.target.value } : entry)),
              )
            }
          />
          <label className="admin-product-check">
            <input
              type="checkbox"
              name={`${prefix}Hidden_${index}`}
              defaultChecked={item.hidden}
              onChange={(event) =>
                setLinks((current) =>
                  current.map((entry, i) => (i === index ? { ...entry, hidden: event.target.checked } : entry)),
                )
              }
            />
            Hide
          </label>
          <button type="button" className="admin-orders-filter" onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}>
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}

function SectionShell({
  id,
  openId,
  setOpenId,
  children,
  onMoveUp,
  onMoveDown,
}: {
  id: HomeSectionId;
  openId: HomeSectionId | null;
  setOpenId: (id: HomeSectionId | null) => void;
  children: ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const open = openId === id;
  return (
    <section className="admin-product-card">
      <div className="admin-storefront-row">
        <button type="button" className="admin-product-card-title" onClick={() => setOpenId(open ? null : id)}>
          {HOME_SECTION_LABELS[id]} {open ? "▾" : "▸"}
        </button>
        <div className="admin-storefront-row">
          <button type="button" className="admin-orders-filter" onClick={onMoveUp}>
            Up
          </button>
          <button type="button" className="admin-orders-filter" onClick={onMoveDown}>
            Down
          </button>
        </div>
      </div>
      {/* Keep fields mounted so Publish still submits image URLs from collapsed sections */}
      <div hidden={!open}>{children}</div>
    </section>
  );
}

export function StorefrontEditor({
  storefront,
  catalog,
}: {
  storefront: StorefrontState;
  catalog: { sku: string; title: string }[];
}) {
  const commerce = resolveCommerceSettings(storefront.commerce);
  const theme = resolveStorefrontTheme(storefront.theme);
  const content = resolveStorefrontContent(storefront.content);
  const [tab, setTab] = useState<TabId>("theme");
  const [sectionOrder, setSectionOrder] = useState<HomeSectionId[]>(() => [...content.home.sectionOrder]);
  const [openSection, setOpenSection] = useState<HomeSectionId | null>("hero");
  const [headerLinks, setHeaderLinks] = useState(() => content.menus.header.map((item) => ({ ...item })));
  const [footerShop, setFooterShop] = useState(() => content.menus.footerShop.map((item) => ({ ...item })));
  const [footerHouse, setFooterHouse] = useState(() => content.menus.footerHouse.map((item) => ({ ...item })));
  const [footerPolicies, setFooterPolicies] = useState(() => content.menus.footerPolicies.map((item) => ({ ...item })));
  const [shopCategories, setShopCategories] = useState<StorefrontShopCategory[]>(() =>
    content.shopCategories.map((item) => ({ ...item })),
  );
  const [reviews, setReviews] = useState(() => content.home.sections.stories.reviews.map((item) => ({ ...item })));
  const [homeFaq, setHomeFaq] = useState(() => content.home.sections.faq.items.map((item) => ({ ...item })));
  const [socialItems, setSocialItems] = useState(() => content.home.sections.social.items.map((item) => ({ ...item })));
  const [journalItems] = useState(() => {
    const articles = content.home.sections.journal.articles.map((item) => ({ ...item }));
    while (articles.length < 3) {
      articles.push({
        id: `j-${articles.length + 1}`,
        title: "",
        date: "",
        href: "/collections/all",
        src: "",
        alt: "",
      });
    }
    return articles.slice(0, 3);
  });
  const [heroBanners, setHeroBanners] = useState(() => {
    const fromCms = (content.home.sections.hero.banners ?? [])
      .map((slide) => ({
        desktop: slide.desktop.trim(),
        mobile: slide.mobile.trim(),
      }))
      .filter((slide) => slide.desktop || slide.mobile)
      .slice(0, 5);
    if (fromCms.length) return fromCms;
    const poster = content.home.sections.hero.posterSrc?.trim();
    return poster ? [{ desktop: poster, mobile: "" }] : [{ desktop: "", mobile: "" }];
  });
  const [pageFaq, setPageFaq] = useState(() => content.pageTemplates.faq.items.map((item) => ({ ...item })));
  const [publishState, publishAction] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => updateCommerceSettingsAction(formData),
    {},
  );

  const home = content.home.sections;
  const pages = content.pageTemplates;

  function moveSection(id: HomeSectionId, direction: -1 | 1) {
    setSectionOrder((current) => {
      const index = current.indexOf(id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item!);
      return copy;
    });
  }

  return (
    <div className="admin-page admin-storefront-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-orders-kicker">
            <IconStorefront /> Online Store
          </p>
          <h1 className="admin-page-title">Storefront</h1>
          <p className="admin-page-lead">
            Shopify-style customizer — change every logo, picture, menu, and section. Publish to update the live shop.
          </p>
        </div>
      </header>

      <form action={publishAction} className="admin-product-form">
        <UnsavedGuard />
        <input type="hidden" name="homeSectionOrder" value={sectionOrder.join(",")} />
        <input type="hidden" name="homeReviewCount" value={reviews.length} />
        <input type="hidden" name="homeFaqCount" value={homeFaq.length} />
        <input type="hidden" name="homeSocialCount" value={socialItems.length} />
        <input type="hidden" name="homeJournalCount" value={journalItems.length} />
        <input type="hidden" name="pageFaqCount" value={pageFaq.length} />
        <input type="hidden" name="categoryCount" value={shopCategories.length} />
        <input type="hidden" name="navCount" value={footerShop.length} />

        <div className="admin-orders-filters" role="tablist" aria-label="Storefront sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-orders-filter${tab === item.id ? " is-active" : ""}`}
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {publishState.error ? <p className="admin-product-error">{publishState.error}</p> : null}

        <div className="admin-storefront-stack" hidden={tab !== "theme"}>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Brand</h2>
            <SoftInput label="Site name" name="brandSiteName" defaultValue={content.brand.siteName} />
            <ImageUrlField name="logoSrc" label="Logo" defaultValue={content.brand.logoSrc} />
            <ImageUrlField name="logoOnLightSrc" label="Logo on light" defaultValue={content.brand.logoOnLightSrc} />
          </section>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Colors</h2>
            <ColorField name="themeBg" label="Background" defaultValue={theme.bg} />
            <ColorField name="themePrimary" label="Primary" defaultValue={theme.primary} />
            <ColorField name="themeSecondary" label="Secondary" defaultValue={theme.secondary} />
            <ColorField name="themeAccent" label="Accent" defaultValue={theme.accent} />
            <ColorField name="themeMint" label="Mint / header" defaultValue={theme.mint} />
            <ColorField name="themeBlush" label="Blush" defaultValue={theme.blush} />
            <ColorField name="productCardColor1" label="Product tile 1" defaultValue={content.productCardColors[0] ?? theme.blush} />
            <ColorField name="productCardColor2" label="Product tile 2" defaultValue={content.productCardColors[1] ?? theme.mint} />
            <ColorField name="productCardColor3" label="Product tile 3" defaultValue={content.productCardColors[2] ?? "#efe4ee"} />
            <ColorField name="heroStageColor" label="Hero stage" defaultValue={content.heroStageColor} />
          </section>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Auth banners</h2>
            <ImageUrlField name="authLoginSrc" label="Login" defaultValue={content.authLoginSrc} />
            <ImageUrlField name="authRegisterSrc" label="Register" defaultValue={content.authRegisterSrc} />
            <ImageUrlField name="authAdminSrc" label="Admin login" defaultValue={content.authAdminSrc} />
          </section>
        </div>

        <div className="admin-storefront-stack" hidden={tab !== "home"}>
          <p className="admin-product-kicker">Reorder with Up/Down. Hide a section to remove it from the homepage.</p>
          {sectionOrder.map((id) => (
            <SectionShell
              key={id}
              id={id}
              openId={openSection}
              setOpenId={setOpenSection}
              onMoveUp={() => moveSection(id, -1)}
              onMoveDown={() => moveSection(id, 1)}
            >
              {id === "hero" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeHeroHidden" defaultChecked={home.hero.hidden} /> Hide section
                  </label>
                  <p className="admin-product-kicker">
                    Hero banners (1–5). Desktop export 1920×1080 (16:9), optional 2× 3840×2160. Mobile export 1080×1920 (9:16). Keep subject in the central ~90%; top ~68px may sit under the header. Reorder with Up/Down. Multiple banners autoplay with arrows on the site.
                  </p>
                  <input type="hidden" name="homeHeroBannerCount" value={heroBanners.length} />
                  {heroBanners.map((slide, index) => (
                    <div key={`hero-banner-${index}-${slide.desktop || "empty"}-${slide.mobile || "m"}`} className="admin-storefront-inline-card">
                      <ImageUrlField
                        name={`heroBannerDesktop_${index}`}
                        label={`Banner ${index + 1} · Desktop`}
                        defaultValue={slide.desktop}
                      />
                      <ImageUrlField
                        name={`heroBannerMobile_${index}`}
                        label={`Banner ${index + 1} · Mobile`}
                        defaultValue={slide.mobile}
                      />
                      <div className="admin-orders-filters">
                        <button
                          type="button"
                          className="admin-orders-filter"
                          disabled={index === 0}
                          onClick={() =>
                            setHeroBanners((current) => {
                              const next = [...current];
                              const swap = next[index - 1]!;
                              next[index - 1] = next[index]!;
                              next[index] = swap;
                              return next;
                            })
                          }
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="admin-orders-filter"
                          disabled={index >= heroBanners.length - 1}
                          onClick={() =>
                            setHeroBanners((current) => {
                              const next = [...current];
                              const swap = next[index + 1]!;
                              next[index + 1] = next[index]!;
                              next[index] = swap;
                              return next;
                            })
                          }
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="admin-orders-filter"
                          disabled={heroBanners.length <= 1}
                          onClick={() => setHeroBanners((current) => current.filter((_, i) => i !== index))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-orders-filter"
                    disabled={heroBanners.length >= 5}
                    onClick={() =>
                      setHeroBanners((current) =>
                        current.length >= 5 ? current : [...current, { desktop: "", mobile: "" }],
                      )
                    }
                  >
                    Add banner
                  </button>
                  <SoftInput label="Line 1" name="homeHeroLine1" defaultValue={home.hero.line1} />
                  <SoftInput label="Line 2" name="homeHeroLine2" defaultValue={home.hero.line2} />
                  <SoftArea label="Support" name="homeHeroSupport" rows={3} defaultValue={home.hero.support} />
                  <SoftInput label="CTA label" name="homeHeroCtaLabel" defaultValue={home.hero.ctaLabel} />
                  <SoftInput label="CTA href" name="homeHeroCtaHref" defaultValue={home.hero.ctaHref} />
                  <SoftInput label="Scroll label" name="homeHeroScrollLabel" defaultValue={home.hero.scrollLabel} />
                </>
              ) : null}
              {id === "collection" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeCollectionHidden" defaultChecked={home.collection.hidden} /> Hide section
                  </label>
                  <p className="admin-product-kicker">
                    Heading defaults to Shop the Collection. Card names/images come from Shop categories; optional overrides below.
                  </p>
                  <SoftInput label="Eyebrow" name="homeCollectionEyebrow" defaultValue={home.collection.eyebrow} />
                  <SoftInput label="Line 1" name="homeCollectionLine1" defaultValue={home.collection.line1 || "Shop the Collection."} />
                  <SoftInput label="Line 2" name="homeCollectionLine2" defaultValue={home.collection.line2} />
                  {Array.from({ length: 6 }, (_, index) => (
                    <ImageUrlField
                      key={`ct-${index}`}
                      name={`collectionTile_${index}`}
                      label={`Tile image override ${index + 1}`}
                      defaultValue={home.collection.tileImageOverrides[index] ?? ""}
                      hint="Leave empty to use the Shop category tile image"
                    />
                  ))}
                </>
              ) : null}
              {id === "lifestyle" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeLifestyleHidden" defaultChecked={home.lifestyle.hidden} /> Hide section
                  </label>
                  <ImageUrlField
                    name="lifestyleBeforeSrc"
                    label="Before photo"
                    defaultValue={home.lifestyle.beforeSrc || home.lifestyle.posterSrc}
                  />
                  <ImageUrlField
                    name="lifestyleAfterSrc"
                    label="After photo"
                    defaultValue={home.lifestyle.afterSrc}
                  />
                  <p className="admin-product-kicker">
                    Upload matched Before and After photos (same subject, pose, and crop) so the slider aligns cleanly.
                  </p>
                  <SoftInput label="Eyebrow" name="homeLifestyleEyebrow" defaultValue={home.lifestyle.eyebrow} />
                  <SoftInput label="Heading" name="homeLifestyleHeading" defaultValue={home.lifestyle.heading} />
                </>
              ) : null}
              {id === "mosaic" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeMosaicHidden" defaultChecked={home.mosaic.hidden} /> Hide section
                  </label>
                  <SoftInput label="Eyebrow" name="homeMosaicEyebrow" defaultValue={home.mosaic.eyebrow} />
                  <SoftInput label="Line 1" name="homeMosaicLine1" defaultValue={home.mosaic.line1} />
                  <SoftInput label="Line 2" name="homeMosaicLine2" defaultValue={home.mosaic.line2} />
                  <SoftInput label="Panel heading" name="homeMosaicPanelHeading" defaultValue={home.mosaic.panelHeading} />
                  <SoftArea label="Panel body" name="homeMosaicPanelBody" rows={3} defaultValue={home.mosaic.panelBody} />
                  <SoftInput label="Upper caption" name="homeMosaicUpperHeading" defaultValue={home.mosaic.upperCaptionHeading} />
                  <SoftInput label="Upper body" name="homeMosaicUpperBody" defaultValue={home.mosaic.upperCaptionBody} />
                  <SoftInput label="Lower caption" name="homeMosaicLowerHeading" defaultValue={home.mosaic.lowerCaptionHeading} />
                  <SoftInput label="Lower body" name="homeMosaicLowerBody" defaultValue={home.mosaic.lowerCaptionBody} />
                  <ImageUrlField name="mosaicLeftSrc" label="Left image" defaultValue={home.mosaic.leftSrc} />
                  <ImageUrlField name="mosaicRangeSrc" label="Range image" defaultValue={home.mosaic.rangeSrc} />
                  <ImageUrlField name="mosaicDetailSrc" label="Detail image" defaultValue={home.mosaic.detailSrc} />
                </>
              ) : null}
              {id === "ritual" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeRitualHidden" defaultChecked={home.ritual.hidden} /> Hide section
                  </label>
                  <SoftInput label="Eyebrow" name="homeRitualEyebrow" defaultValue={home.ritual.eyebrow} />
                  <SoftInput label="Line 1" name="homeRitualLine1" defaultValue={home.ritual.line1} />
                  <SoftInput label="Line 2" name="homeRitualLine2" defaultValue={home.ritual.line2} />
                  <SoftArea label="Empty state" name="homeRitualEmpty" rows={2} defaultValue={home.ritual.empty} />
                  {Array.from({ length: 3 }, (_, index) => (
                    <ImageUrlField
                      key={`rt-${index}`}
                      name={`ritualTile_${index}`}
                      label={`Ritual tile override ${index + 1}`}
                      defaultValue={home.ritual.tileImageOverrides[index] ?? ""}
                    />
                  ))}
                </>
              ) : null}
              {id === "stories" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeStoriesHidden" defaultChecked={home.stories.hidden} /> Hide section
                  </label>
                  <ImageUrlField name="storiesCompositionSrc" label="Composition" defaultValue={home.stories.compositionSrc} />
                  <SoftInput label="Eyebrow" name="homeStoriesEyebrow" defaultValue={home.stories.eyebrow} />
                  <SoftInput label="Line 1" name="homeStoriesLine1" defaultValue={home.stories.line1} />
                  <SoftInput label="Line 2" name="homeStoriesLine2" defaultValue={home.stories.line2} />
                  <button
                    type="button"
                    className="admin-orders-filter"
                    onClick={() =>
                      setReviews((current) => [
                        ...current,
                        { id: `r-${Date.now()}`, title: "", body: "", name: "", context: "", avatar: "" },
                      ])
                    }
                  >
                    Add review
                  </button>
                  {reviews.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="admin-storefront-inline-card">
                      <input type="hidden" name={`homeReviewId_${index}`} value={item.id || `r${index + 1}`} />
                      <SoftInput label="Title" name={`homeReviewTitle_${index}`} defaultValue={item.title} />
                      <SoftArea label="Body" name={`homeReviewBody_${index}`} rows={3} defaultValue={item.body} />
                      <SoftInput label="Name" name={`homeReviewName_${index}`} defaultValue={item.name} />
                      <SoftInput label="Context" name={`homeReviewContext_${index}`} defaultValue={item.context} />
                      <ImageUrlField name={`homeReviewAvatar_${index}`} label="Avatar" defaultValue={item.avatar} />
                      <button type="button" className="admin-orders-filter" onClick={() => setReviews((current) => current.filter((_, i) => i !== index))}>
                        Delete
                      </button>
                    </div>
                  ))}
                </>
              ) : null}
              {id === "faq" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeFaqHidden" defaultChecked={home.faq.hidden} /> Hide section
                  </label>
                  <SoftInput label="Eyebrow" name="homeFaqEyebrow" defaultValue={home.faq.eyebrow} />
                  <SoftInput label="Line 1" name="homeFaqLine1" defaultValue={home.faq.line1} />
                  <SoftInput label="Line 2" name="homeFaqLine2" defaultValue={home.faq.line2} />
                  <SoftArea label="Intro" name="homeFaqIntro" rows={2} defaultValue={home.faq.intro} />
                  <button
                    type="button"
                    className="admin-orders-filter"
                    onClick={() => setHomeFaq((current) => [...current, { id: `faq-${Date.now()}`, question: "", answer: "" }])}
                  >
                    Add question
                  </button>
                  {homeFaq.map((item, index) => (
                    <div key={item.id} className="admin-storefront-inline-card">
                      <input type="hidden" name={`homeFaqId_${index}`} value={item.id} />
                      <SoftInput label="Question" name={`homeFaqQuestion_${index}`} defaultValue={item.question} />
                      <SoftArea label="Answer" name={`homeFaqAnswer_${index}`} rows={3} defaultValue={item.answer} />
                      <button type="button" className="admin-orders-filter" onClick={() => setHomeFaq((current) => current.filter((_, i) => i !== index))}>
                        Delete
                      </button>
                    </div>
                  ))}
                </>
              ) : null}
              {id === "social" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeSocialHidden" defaultChecked={home.social.hidden} /> Hide section
                  </label>
                  <SoftInput label="Eyebrow" name="homeSocialEyebrow" defaultValue={home.social.eyebrow} />
                  <SoftInput label="Line 1" name="homeSocialLine1" defaultValue={home.social.line1} />
                  <SoftInput label="Line 2" name="homeSocialLine2" defaultValue={home.social.line2} />
                  <SoftInput label="Follow label" name="homeSocialFollowLabel" defaultValue={home.social.followLabel} />
                  <SoftInput label="Follow href" name="homeSocialFollowHref" defaultValue={home.social.followHref} />
                  <SoftInput label="Handle" name="homeSocialHandle" defaultValue={home.social.handle} />
                  <button
                    type="button"
                    className="admin-orders-filter"
                    onClick={() =>
                      setSocialItems((current) => [
                        ...current,
                        { id: `social-${Date.now()}`, src: "", href: home.social.followHref, handle: "@zermae", alt: "" },
                      ])
                    }
                  >
                    Add portrait
                  </button>
                  {socialItems.map((item, index) => (
                    <div key={item.id} className="admin-storefront-inline-card">
                      <input type="hidden" name={`homeSocialId_${index}`} value={item.id} />
                      <ImageUrlField name={`homeSocialSrc_${index}`} label="Image" defaultValue={item.src} />
                      <SoftInput label="Href" name={`homeSocialHref_${index}`} defaultValue={item.href} />
                      <SoftInput label="Handle" name={`homeSocialItemHandle_${index}`} defaultValue={item.handle} />
                      <SoftInput label="Alt" name={`homeSocialAlt_${index}`} defaultValue={item.alt} />
                      <button type="button" className="admin-orders-filter" onClick={() => setSocialItems((current) => current.filter((_, i) => i !== index))}>
                        Delete
                      </button>
                    </div>
                  ))}
                </>
              ) : null}
              {id === "journal" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeJournalHidden" defaultChecked={home.journal.hidden} /> Hide section
                  </label>
                  <p className="admin-product-kicker">
                    Three insight cards: image + description under each. View all opens the CTA href (e.g. /collections/all).
                  </p>
                  <SoftInput label="Eyebrow" name="homeJournalEyebrow" defaultValue={home.journal.eyebrow} />
                  <SoftInput label="Line 1" name="homeJournalLine1" defaultValue={home.journal.line1} />
                  <SoftInput label="Line 2" name="homeJournalLine2" defaultValue={home.journal.line2} />
                  <SoftInput label="CTA label" name="homeJournalCtaLabel" defaultValue={home.journal.ctaLabel} />
                  <SoftInput
                    label="CTA href"
                    name="homeJournalCtaHref"
                    defaultValue={home.journal.ctaHref || "/collections/all"}
                  />
                  {journalItems.map((item, index) => (
                    <div key={item.id} className="admin-storefront-inline-card">
                      <input type="hidden" name={`homeJournalId_${index}`} value={item.id} />
                      <input type="hidden" name={`homeJournalDate_${index}`} value={item.date} />
                      <ImageUrlField name={`homeJournalSrc_${index}`} label={`Card ${index + 1} image`} defaultValue={item.src} />
                      <SoftInput label="Description" name={`homeJournalTitle_${index}`} defaultValue={item.title} />
                      <SoftInput label="Href" name={`homeJournalHref_${index}`} defaultValue={item.href} />
                      <SoftInput label="Alt" name={`homeJournalAlt_${index}`} defaultValue={item.alt} />
                    </div>
                  ))}
                </>
              ) : null}
              {id === "newsletter" ? (
                <>
                  <label className="admin-product-check">
                    <input type="checkbox" name="homeNewsletterHidden" defaultChecked={home.newsletter.hidden} /> Hide section
                  </label>
                  <ImageUrlField name="newsletterImageSrc" label="Background" defaultValue={home.newsletter.imageSrc} />
                  <SoftInput label="Eyebrow" name="homeNewsletterEyebrow" defaultValue={home.newsletter.eyebrow} />
                  <SoftInput label="Line" name="homeNewsletterLine1" defaultValue={home.newsletter.line1} />
                  <SoftArea label="Support" name="homeNewsletterSupport" rows={2} defaultValue={home.newsletter.support} />
                  <SoftInput label="Submit label" name="homeNewsletterSubmit" defaultValue={home.newsletter.submitLabel} />
                </>
              ) : null}
            </SectionShell>
          ))}
        </div>

        <div className="admin-storefront-stack" hidden={tab !== "collections"}>
          {Object.entries(content.collectionPages).map(([key, page]) => (
            <section key={key} className="admin-product-card">
              <h2 className="admin-product-card-title">{key}</h2>
              <ImageUrlField name={`collectionHero_${key}`} label="Hero poster" defaultValue={page.heroSrc} />
              <SoftInput label="Title first" name={`collectionFirst_${key}`} defaultValue={page.titleFirst} />
              <SoftInput label="Title second" name={`collectionSecond_${key}`} defaultValue={page.titleSecond} />
              <ImageUrlField name={`collectionRitual_${key}`} label="Ritual image" defaultValue={page.ritualImage} />
              <SoftInput label="Ritual title" name={`collectionRitualTitle_${key}`} defaultValue={page.ritualTitle} />
              <SoftInput label="Ritual mark" name={`collectionRitualMark_${key}`} defaultValue={page.ritualMark} />
              <SoftInput label="Note 1 title" name={`collectionNote1Title_${key}`} defaultValue={page.ritualNote1Title} />
              <SoftArea label="Note 1 body" name={`collectionNote1Body_${key}`} rows={2} defaultValue={page.ritualNote1Body} />
              <SoftInput label="Note 2 title" name={`collectionNote2Title_${key}`} defaultValue={page.ritualNote2Title} />
              <SoftArea label="Note 2 body" name={`collectionNote2Body_${key}`} rows={2} defaultValue={page.ritualNote2Body} />
            </section>
          ))}
        </div>

        <div className="admin-storefront-stack" hidden={tab !== "pages"}>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">About</h2>
            <ImageUrlField name="aboutImageSrc" label="Image" defaultValue={pages.about.imageSrc} />
            <SoftInput label="Image alt" name="aboutImageAlt" defaultValue={pages.about.imageAlt} />
            <SoftInput label="Eyebrow" name="aboutEyebrow" defaultValue={pages.about.eyebrow} />
            <SoftArea label="Copy" name="aboutCopy" rows={5} defaultValue={pages.about.copy} />
            <SoftInput label="CTA label" name="aboutCtaLabel" defaultValue={pages.about.ctaLabel} />
            <SoftInput label="CTA href" name="aboutCtaHref" defaultValue={pages.about.ctaHref} />
          </section>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Contact</h2>
            <ImageUrlField name="contactImageSrc" label="Image" defaultValue={pages.contact.imageSrc} />
            <SoftInput label="Image alt" name="contactImageAlt" defaultValue={pages.contact.imageAlt} />
            <SoftArea label="Lead" name="contactLead" rows={3} defaultValue={pages.contact.lead} />
            <SoftInput label="Support phone" name="supportPhone" defaultValue={pages.contact.supportPhone} />
          </section>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">FAQ page</h2>
            <ImageUrlField name="faqPageImageSrc" label="Image" defaultValue={pages.faq.imageSrc} />
            <SoftInput label="Image alt" name="faqImageAlt" defaultValue={pages.faq.imageAlt} />
            <button
              type="button"
              className="admin-orders-filter"
              onClick={() => setPageFaq((current) => [...current, { id: `pf-${Date.now()}`, question: "", answer: "" }])}
            >
              Add question
            </button>
            {pageFaq.map((item, index) => (
              <div key={item.id} className="admin-storefront-inline-card">
                <input type="hidden" name={`pageFaqId_${index}`} value={item.id} />
                <SoftInput label="Question" name={`pageFaqQuestion_${index}`} defaultValue={item.question} />
                <SoftArea label="Answer" name={`pageFaqAnswer_${index}`} rows={3} defaultValue={item.answer} />
                <button type="button" className="admin-orders-filter" onClick={() => setPageFaq((current) => current.filter((_, i) => i !== index))}>
                  Delete
                </button>
              </div>
            ))}
          </section>
          {(["privacy", "terms", "shipping", "returns"] as const).map((key) => (
            <section key={key} className="admin-product-card">
              <h2 className="admin-product-card-title">{pages[key].title}</h2>
              <SoftInput label="Title" name={`${key}Title`} defaultValue={pages[key].title} />
              <SoftArea label="Lead" name={`${key}Lead`} rows={2} defaultValue={pages[key].lead} />
              <SoftArea label="Body" name={`${key}Body`} rows={8} defaultValue={pages[key].body} />
            </section>
          ))}
        </div>

        <div className="admin-storefront-stack" hidden={tab !== "navigation"}>
          <MenuEditor title="Header links" prefix="headerNav" links={headerLinks} setLinks={setHeaderLinks} />
          <MenuEditor title="Footer — Shop" prefix="footerShop" links={footerShop} setLinks={setFooterShop} />
          <MenuEditor title="Footer — House" prefix="footerHouse" links={footerHouse} setLinks={setFooterHouse} />
          <MenuEditor title="Footer — Policies" prefix="footerPolicies" links={footerPolicies} setLinks={setFooterPolicies} />
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Footer statement & social</h2>
            <SoftInput label="Statement lead" name="footerStatementLead" defaultValue={content.footerStatementLead} />
            <SoftInput label="Statement end" name="footerStatementEnd" defaultValue={content.footerStatementEnd} />
            <SoftInput label="Facebook URL" name="socialFacebook" defaultValue={content.socialFacebook} />
            <SoftInput label="Instagram URL" name="socialInstagram" defaultValue={content.socialInstagram} />
            <SoftInput label="Pinterest URL" name="socialPinterest" defaultValue={content.socialPinterest} />
          </section>
        </div>

        <div className="admin-storefront-stack" hidden={tab !== "shop"}>
          <section className="admin-product-card">
            <div className="admin-storefront-row">
              <h2 className="admin-product-card-title">Shop categories</h2>
              <button
                type="button"
                className="admin-orders-filter"
                onClick={() =>
                  setShopCategories((current) => [
                    ...current,
                    {
                      id: `cat-${Date.now()}`,
                      title: "New category",
                      description: "",
                      href: "/collections/all",
                      image: "",
                      alt: "",
                      icon: "sparkle",
                      color: theme.blush,
                      hidden: false,
                    },
                  ])
                }
              >
                Add
              </button>
            </div>
            {shopCategories.map((item, index) => (
              <div key={item.id} className="admin-storefront-inline-card">
                <input type="hidden" name={`categoryId_${index}`} value={item.id} />
                <SoftInput label="Title" name={`categoryTitle_${index}`} defaultValue={item.title} />
                <SoftInput label="Href" name={`categoryHref_${index}`} defaultValue={item.href} />
                <SoftArea label="Description" name={`categoryDescription_${index}`} rows={2} defaultValue={item.description} />
                <ImageUrlField name={`categoryImage_${index}`} label="Tile image" defaultValue={item.image} />
                <div className="admin-product-field">
                  <label className="admin-product-label" htmlFor={`categoryIcon_${index}`}>
                    Icon
                  </label>
                  <select id={`categoryIcon_${index}`} name={`categoryIcon_${index}`} className="admin-product-soft" defaultValue={item.icon}>
                    {SHOP_CATEGORY_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <ColorField name={`categoryColor_${index}`} label="Color" defaultValue={item.color} />
                <label className="admin-product-check">
                  <input type="checkbox" name={`categoryHidden_${index}`} defaultChecked={item.hidden} /> Hide
                </label>
                <button type="button" className="admin-orders-filter" onClick={() => setShopCategories((current) => current.filter((_, i) => i !== index))}>
                  Delete
                </button>
              </div>
            ))}
          </section>
          <section className="admin-product-card">
            <h2 className="admin-product-card-title">Best sellers</h2>
            <SkuSelect label="SKU 1" name="bestSellerSku1" value={content.bestSellerSkus[0] ?? ""} catalog={catalog} />
            <SkuSelect label="SKU 2" name="bestSellerSku2" value={content.bestSellerSkus[1] ?? ""} catalog={catalog} />
            <SkuSelect label="SKU 3" name="bestSellerSku3" value={content.bestSellerSkus[2] ?? ""} catalog={catalog} />
            <ColorField name="bestSellerColor1" label="Color 1" defaultValue={content.bestSellerColors[0] ?? theme.blush} />
            <ColorField name="bestSellerColor2" label="Color 2" defaultValue={content.bestSellerColors[1] ?? theme.mint} />
            <ColorField name="bestSellerColor3" label="Color 3" defaultValue={content.bestSellerColors[2] ?? theme.blush} />
          </section>
        </div>

        <section className="admin-product-card" hidden={tab !== "checkout"}>
          <h2 className="admin-product-card-title">Checkout</h2>
          <SoftInput
            label="Standard shipping fee"
            name="standardShippingFee"
            type="number"
            step="1"
            defaultValue={commerce.standardShippingFee}
          />
          <SoftInput
            label="Free shipping threshold"
            name="freeShippingThreshold"
            type="number"
            step="1"
            defaultValue={commerce.freeShippingThreshold}
          />
          <label className="admin-product-check">
            <input type="checkbox" name="freeShippingEnabled" defaultChecked={commerce.freeShippingEnabled} /> Free shipping enabled
          </label>
          <label className="admin-product-check">
            <input type="checkbox" name="taxEnabled" defaultChecked={commerce.taxEnabled} /> Tax enabled
          </label>
          <SoftInput label="Tax rate" name="taxRate" type="number" step="0.01" defaultValue={commerce.taxRate} />
        </section>

        <div className="admin-product-actions">
          <PublishButton />
        </div>
      </form>
    </div>
  );
}
