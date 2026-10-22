import type { CatalogProduct } from "@/features/catalog/product-card";
import { resolvePublicImageUrl } from "@/lib/public-image-url";
import type { SerializedProduct } from "@/types/product";

export function productImageUrls(product: SerializedProduct): string[] {
  return product.images.map((image) => resolvePublicImageUrl(image.url)).filter(Boolean);
}

export function toCatalogProduct(product: SerializedProduct): CatalogProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description.intro,
    price: product.effectivePrice,
    originalPrice: product.originalPrice,
    images: productImageUrls(product),
    tileColor: product.tileColor,
  };
}
