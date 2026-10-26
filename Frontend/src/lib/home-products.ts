import type { MiniProduct } from "@/components/shop/ProductMiniCard";
import type { QuietProduct } from "@/components/shop/ProductTile";
import { productImageUrls } from "@/features/catalog/map-product";
import { productService } from "@/lib/api/products";
import { SHOP_CATEGORIES, type RitualTab } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";
import type { SerializedProduct } from "@/types/product";

type ShopCat = { id: string; title: string; href: string; hidden: boolean };

type LoadOptions = {
  shopCategories?: ShopCat[];
  collectionOverrides?: string[];
  ritualOverrides?: string[];
  ritualTabs?: RitualTab[];
};

function categoryTabs(categories?: ShopCat[]): RitualTab[] {
  const source = (categories?.filter((item) => !item.hidden) ?? []).length
    ? categories!.filter((item) => !item.hidden)
    : SHOP_CATEGORIES.map((item) => ({ id: item.id, title: item.label, href: item.href, hidden: false }));
  return source.map((item) => {
    const href = item.href;
    const category =
      href.includes("/collections/new") ? "new"
      : href.includes("/collections/serums") ? "serums"
      : href.includes("/collections/creams") ? "creams"
      : href.includes("/collections/cleansers") ? "cleansers"
      : href.includes("/collections/body") ? "body-care"
      : "all";
    return { id: item.id, label: item.title, category, href };
  });
}

export function toQuietProduct(product: SerializedProduct, fallbackImage?: string): QuietProduct {
  const images = productImageUrls(product);
  return {
    id: product.id,
    title: product.title,
    price: product.effectivePrice,
    image: images[0] || fallbackImage || MEDIA.collection[0],
  };
}

export function toMiniProduct(product: SerializedProduct, fallbackImage?: string): MiniProduct {
  const quiet = toQuietProduct(product, fallbackImage);
  return { ...quiet, href: `/product/${product.id}` };
}

export async function loadHomeProducts(bestSellerSkus: string[], options: LoadOptions = {}) {
  const tabs = options.ritualTabs?.length ? options.ritualTabs : categoryTabs(options.shopCategories);
  const collectionOverrides = options.collectionOverrides ?? [];
  const ritualOverrides = options.ritualOverrides ?? [];

  let products: SerializedProduct[] = [];
  try {
    const flagged = await productService.list({ bestSeller: true, limit: 12 });
    products = flagged.products;
    if (products.length < 6 && bestSellerSkus.length) {
      const bySku = await productService.getBySkus(bestSellerSkus);
      const seen = new Set(products.map((item) => item.id));
      for (const item of bySku) {
        if (!seen.has(item.id)) products.push(item);
      }
    }
    if (products.length < 6) {
      const listed = await productService.list({ limit: 12 });
      const seen = new Set(products.map((item) => item.id));
      for (const item of listed.products) {
        if (!seen.has(item.id)) products.push(item);
      }
    }
  } catch {
    products = [];
  }

  const collection = tabs.slice(0, 6).map((category, index) => {
    const product = products[index];
    const override = collectionOverrides[index]?.trim();
    const fallbackImage = MEDIA.collection[index] ?? MEDIA.collection[0];
    if (product) {
      const quiet = toQuietProduct(product, fallbackImage);
      return {
        ...quiet,
        title: category.label,
        image: override || quiet.image,
        href: category.href,
      };
    }
    return {
      id: `fallback-${category.id}`,
      title: category.label,
      price: 0,
      image: override || fallbackImage,
      href: category.href,
    };
  });

  const featured = collection[0]
    ? {
        id: collection[0].id,
        title: collection[0].title,
        price: collection[0].price,
        image: collection[0].image,
        href: collection[0].href ?? `/product/${collection[0].id}`,
      }
    : null;
  const lifestyle = collection.slice(0, 2).map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    href: product.href ?? `/product/${product.id}`,
  }));

  const ritualCatalog: Record<string, QuietProduct[]> = {};
  await Promise.all(
    tabs.map(async (tab) => {
      try {
        const result =
          tab.category === "all" || tab.category === "new"
            ? await productService.list({ limit: 3 })
            : await productService.list({ category: tab.category, limit: 3 });
        const mapped = result.products.slice(0, 3).map((product, index) => {
          const quiet = toQuietProduct(product, MEDIA.ritual[index] ?? MEDIA.ritual[0]);
          const override = ritualOverrides[index]?.trim();
          return { ...quiet, image: override || quiet.image };
        });
        ritualCatalog[tab.id] = mapped.length
          ? mapped
          : Array.from({ length: 3 }, (_, index) => ({
              id: `ritual-fallback-${index}`,
              title: "Coming soon",
              price: 0,
              image: ritualOverrides[index]?.trim() || MEDIA.ritual[index] || MEDIA.ritual[0],
              href: tab.href,
            }));
      } catch {
        ritualCatalog[tab.id] = Array.from({ length: 3 }, (_, index) => ({
          id: `ritual-fallback-${index}`,
          title: "Coming soon",
          price: 0,
          image: ritualOverrides[index]?.trim() || MEDIA.ritual[index] || MEDIA.ritual[0],
          href: tab.href,
        }));
      }
    }),
  );

  return { collection, featured, lifestyle, ritualCatalog, panelImage: collection[0]?.image };
}
