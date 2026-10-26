import { HomeFaq } from "@/features/catalog/home-faq";
import { getStorefront } from "@/lib/storefront";

export default async function FaqPage() {
  const storefront = await getStorefront();
  const faq = storefront.content.pageTemplates.faq;
  const content = {
    ...storefront.content,
    faqImage: faq.imageSrc || storefront.content.faqImage,
    faqImageAlt: faq.imageAlt || storefront.content.faqImageAlt,
    faqItems: faq.items.length ? faq.items : storefront.content.faqItems,
  };
  return (
    <div className="bg-brand-bg">
      <HomeFaq content={content} />
    </div>
  );
}
