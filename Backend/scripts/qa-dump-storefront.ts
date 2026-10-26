import { storefrontService } from "@/server/services/storefront/storefront.service";

async function main() {
  const s = await storefrontService.getFull();
  const c = s.content as any;
  console.log(
    JSON.stringify(
      {
        logoOnLight: c.brand?.logoOnLightSrc,
        hero: c.home?.sections?.hero?.posterSrc,
        lifestyle: c.home?.sections?.lifestyle?.posterSrc,
        mosaic: c.home?.sections?.mosaic,
        journal0: c.home?.sections?.journal?.articles?.[0]?.src,
        social0: c.home?.sections?.social?.items?.[0]?.src,
        newsletter: c.home?.sections?.newsletter?.imageSrc,
        about: c.pageTemplates?.about?.imageSrc,
        contact: c.pageTemplates?.contact?.imageSrc,
        faq: c.pageTemplates?.faq?.imageSrc,
        serumsHero: c.collectionPages?.serums?.heroSrc,
        serumsRitual: c.collectionPages?.serums?.ritualImage,
        sectionOrder: c.home?.sectionOrder,
        journalHidden: c.home?.sections?.journal?.hidden,
        primary: s.theme?.primary,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
