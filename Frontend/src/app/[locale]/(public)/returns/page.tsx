import { LegalPage } from "@/features/content/legal-page";
import { getStorefront } from "@/lib/storefront";

export default async function ReturnsPage() {
  const storefront = await getStorefront();
  const page = storefront.content.pageTemplates.returns;
  return (
    <LegalPage eyebrow="Policies" title={page.title} lead={page.lead}>
      {page.body.split(/\n\n+/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
