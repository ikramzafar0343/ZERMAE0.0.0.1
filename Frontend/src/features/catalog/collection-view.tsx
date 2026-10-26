import Link from "next/link";

import { PageHero } from "@/components/shop/PageHero";
import type { MiniProduct } from "@/components/shop/ProductMiniCard";
import { normalizeCategoryFilter } from "@/constants/catalog";
import { COLLECTION_HEROES } from "@/constants/site";
import { CatalogEmptyState } from "@/features/catalog/catalog-empty-state";
import { toCatalogProduct } from "@/features/catalog/map-product";
import { ProductGrid } from "@/features/catalog/product-grid";
import { RitualFeature } from "@/features/catalog/ritual-feature";
import { HOME_HERO } from "@/lib/content/homepage";
import { productService } from "@/lib/api/products";
import { getStorefront } from "@/lib/storefront";
import { readWishlist } from "@/lib/wishlist-cookie";

const SORTS = [
  { id: "newest", label: "Newest", sort: "createdAt", order: "desc" as const },
  { id: "price-asc", label: "Price low to high", sort: "price", order: "asc" as const },
  { id: "price-desc", label: "Price high to low", sort: "price", order: "desc" as const },
  { id: "title", label: "Name", sort: "title", order: "asc" as const },
];

export async function CollectionView({
  category,
  page = 1,
  sort = "newest",
}: {
  category: string;
  page?: number | undefined;
  sort?: string | undefined;
}) {
  const slug = category in COLLECTION_HEROES ? category : "all";
  const hero = COLLECTION_HEROES[slug] ?? COLLECTION_HEROES.all;
  const selected = SORTS.find((item) => item.id === sort) ?? SORTS[0];
  const currentPage = Math.max(1, page);
  const [result, wishlist, storefront] = await Promise.all([
    productService.list({
      category: normalizeCategoryFilter(slug),
      limit: 24,
      page: currentPage,
      sort: selected?.sort,
      order: selected?.order,
    }),
    readWishlist(),
    getStorefront(),
  ]);
  const products = result.products.map(toCatalogProduct);
  const splitIndex = Math.min(6, products.length);
  const before = products.slice(0, splitIndex);
  const after = products.slice(splitIndex);
  const pageCms = storefront.content.collectionPages[slug];
  const heroImage =
    pageCms?.ritualImage || storefront.content.collectionImages[slug] || hero?.image || "";
  const titles = {
    first: pageCms?.titleFirst || storefront.content.collectionTitles[slug]?.first || hero?.first || "The",
    second: pageCms?.titleSecond || storefront.content.collectionTitles[slug]?.second || hero?.second || "Ritual",
  };
  const heroPoster = pageCms?.heroSrc || "";

  if (!hero) {
    return null;
  }

  const lead = products[0];
  const featured: MiniProduct | null = lead
    ? {
        id: lead.id,
        title: lead.title,
        price: lead.price,
        image: lead.images[0] || heroImage,
        href: `/product/${lead.id}`,
      }
    : null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <PageHero
        title={`${titles.first} ${titles.second}`}
        ctaLabel={HOME_HERO.ctaLabel}
        ctaHref="#collection-catalog"
        featured={featured}
        currency={storefront.commerce.currency}
        {...(heroPoster ? { mediaSrc: heroPoster } : {})}
      />
      <section id="collection-catalog" className="collection-catalog">
        {products.length > 0 ? (
          <nav className="collection-sort" aria-label="Sort">
            {SORTS.map((item) => (
              <Link
                key={item.id}
                href={`/collections/${slug}?sort=${item.id}`}
                className={item.id === selected?.id ? "collection-sort-active" : "collection-sort-link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        {before.length > 0 ? (
          <ProductGrid
            products={before}
            wishlistIds={wishlist.ids}
            currency={storefront.commerce.currency}
            tileColors={storefront.content.productCardColors}
          />
        ) : null}
        {products.length > 0 ? <RitualFeature image={heroImage} alt={hero.alt} tone={hero.tone} category={slug} /> : null}
        {after.length > 0 ? (
          <ProductGrid
            products={after}
            wishlistIds={wishlist.ids}
            currency={storefront.commerce.currency}
            tileColors={storefront.content.productCardColors}
          />
        ) : null}
        {products.length === 0 ? (
          <CatalogEmptyState
            eyebrow="Collection"
            title="No products in this collection"
            copy="Formulas for this ritual are not listed yet. Browse the full shop or check new arrivals while we prepare more."
            primaryHref="/collections/all"
            primaryLabel="Shop All"
            secondaryHref="/collections/new"
            secondaryLabel="New Arrivals"
          />
        ) : null}
        {result.pagination.totalPages > 1 ? (
          <nav className="collection-pager" aria-label="Pages">
            {result.pagination.hasPrev ? (
              <Link href={`/collections/${slug}?sort=${selected?.id ?? "newest"}&page=${currentPage - 1}`}>Previous</Link>
            ) : null}
            <span>
              Page {result.pagination.page} of {result.pagination.totalPages}
            </span>
            {result.pagination.hasNext ? (
              <Link href={`/collections/${slug}?sort=${selected?.id ?? "newest"}&page=${currentPage + 1}`}>Next</Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
