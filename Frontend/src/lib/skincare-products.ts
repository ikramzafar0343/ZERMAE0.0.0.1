import { productImageUrls } from "@/features/catalog/map-product";
import { productService } from "@/lib/api/products";
import { SKIN_MEDIA } from "@/lib/content/skincare-media";
import type { FeaturedSkinProduct } from "@/lib/skincare-data";
import type { SerializedProduct } from "@/types/product";

const FALLBACKS = [SKIN_MEDIA.cleanser.src, SKIN_MEDIA.serum.src, SKIN_MEDIA.moisturizer.src] as const;
const TONES: FeaturedSkinProduct["tone"][] = ["mist", "sand", "taupe"];

function benefitFromProduct(product: SerializedProduct): string {
  return product.description.intro?.trim().slice(0, 90) || "A considered daily essential.";
}

function sizeFromProduct(product: SerializedProduct): string {
  return product.specifications.includes?.trim() || product.sizes[0] || "30 ml";
}

export async function loadFeaturedSkinProducts(bestSellerSkus: string[]): Promise<FeaturedSkinProduct[]> {
  let products: SerializedProduct[] = [];
  try {
    const flagged = await productService.list({ bestSeller: true, limit: 6 });
    products = flagged.products;
    if (products.length < 3 && bestSellerSkus.length) {
      const bySku = await productService.getBySkus(bestSellerSkus);
      const seen = new Set(products.map((item) => item.id));
      for (const item of bySku) {
        if (!seen.has(item.id)) products.push(item);
      }
    }
    if (products.length < 3) {
      const listed = await productService.list({ limit: 6 });
      const seen = new Set(products.map((item) => item.id));
      for (const item of listed.products) {
        if (!seen.has(item.id)) products.push(item);
      }
    }
  } catch {
    products = [];
  }

  return products.slice(0, 3).map((product, index) => {
    const images = productImageUrls(product);
    return {
      id: product.id,
      title: product.title,
      benefit: benefitFromProduct(product),
      size: sizeFromProduct(product),
      price: product.effectivePrice,
      image: images[0] || FALLBACKS[index] || FALLBACKS[0],
      category: product.category.replace(/-/g, " "),
      tone: TONES[index] ?? "mist",
    };
  });
}
