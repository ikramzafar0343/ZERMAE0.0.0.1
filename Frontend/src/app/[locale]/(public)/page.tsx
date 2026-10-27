import "@/app/home.css";

import { CollectionSection } from "@/components/home/CollectionSection";
import { CustomerStories } from "@/components/home/CustomerStories";
import { EditorialMosaic } from "@/components/home/EditorialMosaic";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageMotion } from "@/components/home/HomepageMotion";
import { JournalSection } from "@/components/home/JournalSection";
import { LifestyleSection } from "@/components/home/LifestyleSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { RitualSection } from "@/components/home/RitualSection";
import { SocialSection } from "@/components/home/SocialSection";
import { type HomeSectionId,shopCategoriesAsRitualTabs } from "@/constants/storefront";
import { loadHomeProducts } from "@/lib/home-products";
import { getStorefront } from "@/lib/storefront";
import { readWishlist } from "@/lib/wishlist-cookie";

export default async function HomePage() {
  const [storefront, wishlist] = await Promise.all([getStorefront(), readWishlist()]);
  const home = storefront.content.home;
  const sections = home.sections;
  const ritualTabs = shopCategoriesAsRitualTabs(storefront.content.shopCategories);

  const { collection, featured, featuredProducts, journalProducts, ritualCatalog, panelImage } = await loadHomeProducts(
    storefront.content.bestSellerSkus,
    {
      shopCategories: storefront.content.shopCategories,
      collectionOverrides: sections.collection.tileImageOverrides,
      ritualOverrides: sections.ritual.tileImageOverrides,
      ritualTabs,
    },
  );

  const currency = storefront.commerce.currency;
  const wishlistIds = wishlist.ids;

  const renderSection = (id: HomeSectionId) => {
    switch (id) {
      case "hero":
        if (sections.hero.hidden) return null;
        return (
          <HeroSection
            key={id}
            featured={featured}
            featuredProducts={featuredProducts}
            currency={currency}
            cms={sections.hero}
          />
        );
      case "collection":
        if (sections.collection.hidden) return null;
        return (
          <CollectionSection
            key={id}
            products={collection}
            currency={currency}
            wishlistIds={wishlistIds}
            cms={sections.collection}
          />
        );
      case "lifestyle":
        if (sections.lifestyle.hidden) return null;
        return (
          <LifestyleSection key={id} cms={sections.lifestyle} />
        );
      case "mosaic":
        if (sections.mosaic.hidden) return null;
        return <EditorialMosaic key={id} panelImage={panelImage} cms={sections.mosaic} />;
      case "ritual":
        if (sections.ritual.hidden) return null;
        return (
          <RitualSection
            key={id}
            catalog={ritualCatalog}
            currency={currency}
            wishlistIds={wishlistIds}
            cms={sections.ritual}
            tabs={ritualTabs}
          />
        );
      case "stories":
        if (sections.stories.hidden) return null;
        return <CustomerStories key={id} cms={sections.stories} />;
      case "faq":
        if (sections.faq.hidden) return null;
        return <FaqSection key={id} items={sections.faq.items} cms={sections.faq} />;
      case "social":
        if (sections.social.hidden) return null;
        return <SocialSection key={id} cms={sections.social} />;
      case "journal":
        if (sections.journal.hidden) return null;
        return (
          <JournalSection key={id} products={journalProducts} currency={currency} cms={sections.journal} />
        );
      case "newsletter":
        if (sections.newsletter.hidden) return null;
        return <NewsletterSection key={id} cms={sections.newsletter} />;
      default:
        return null;
    }
  };

  return <HomepageMotion>{home.sectionOrder.map((id) => renderSection(id))}</HomepageMotion>;
}
