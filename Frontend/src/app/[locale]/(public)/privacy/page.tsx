import { LegalPage } from "@/features/content/legal-page";
import { getStorefront } from "@/lib/storefront";

export default async function PrivacyPage() {
  const storefront = await getStorefront();
  const page = storefront.content.pageTemplates.privacy;
  return (
    <LegalPage eyebrow="Policies" title={page.title} lead={page.lead}>
      {page.body.split(/\n\n+/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
