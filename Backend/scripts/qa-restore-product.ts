/**
 * Restore Retinol Serum gallery images from storefront QA backup product snapshot
 * if present; otherwise reset first two slots to original /media/products paths.
 */
import { productService } from "@/server/services/products/product.service";

const RETINOL_ID = "0406a86e-5b36-410e-8303-47adb73b8a1e";

async function main() {
  const product = await productService.getAdmin(RETINOL_ID);
  const images = [
    { url: "/media/products/collection-01.png", alt: product.images[0]?.alt ?? "Retinol Serum", order: 0 },
    { url: "/media/products/collection-02.png", alt: product.images[1]?.alt ?? "Retinol Serum", order: 1 },
    ...product.images.slice(2).map((img, i) => ({ url: img.url, alt: img.alt, order: i + 2 })),
  ];
  // Prefer keeping non-fixture original media paths if still present past index 1
  const cleaned = product.images.map((img, i) => {
    if (i < 2 && img.url.includes("/api/v1/media/")) {
      return {
        url: i === 0 ? "/media/products/collection-01.png" : "/media/products/collection-02.png",
        alt: img.alt,
        order: i,
      };
    }
    return { url: img.url, alt: img.alt, order: i };
  });

  const updated = await productService.update(RETINOL_ID, {
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    status: product.status,
    category: product.category,
    images: cleaned.length ? cleaned : images,
    colors: product.colors,
  });
  console.log(
    JSON.stringify(
      { id: updated.id, images: updated.images.map((i) => i.url) },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
