import { productService } from "@/server/services/products/product.service";
import { uploadService } from "@/server/services/upload/upload.service";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");
const FIXTURE_DIR = path.join(ROOT, "Frontend", "public", "media", "_qa-fixtures");

async function upload(name: string) {
  const buffer = await readFile(path.join(FIXTURE_DIR, name));
  const result = await uploadService.saveImage({
    mimeType: "image/jpeg",
    data: buffer.toString("base64"),
  });
  return result.url;
}

async function main() {
  const listed = await productService.list({ status: "all", limit: 50, search: "retinol" });
  const card =
    listed.products.find((p) => /retinol/i.test(p.title) || /retinol/i.test(p.slug)) ??
    (await productService.list({ status: "all", limit: 1 })).products[0];
  if (!card) {
    throw new Error("No products found");
  }
  const retinol = await productService.getAdmin(card.id);
  const [cheesecake, pastrami] = await Promise.all([upload("cheesecake.jpg"), upload("pastrami.jpg")]);
  const images = [
    { url: cheesecake, alt: "QA fixture cheesecake", order: 0 },
    { url: pastrami, alt: "QA fixture pastrami", order: 1 },
    ...retinol.images.slice(2).map((img, i) => ({ ...img, order: i + 2 })),
  ].slice(0, Math.max(2, retinol.images.length));

  const updated = await productService.update(retinol.id, {
    title: retinol.title,
    slug: retinol.slug,
    sku: retinol.sku,
    description: retinol.description,
    price: retinol.price,
    compareAtPrice: retinol.compareAtPrice,
    stock: retinol.stock,
    status: retinol.status,
    category: retinol.category,
    images,
    colors: retinol.colors,
  });
  console.log(
    JSON.stringify(
      {
        id: updated.id,
        slug: updated.slug,
        images: updated.images.map((i) => i.url),
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
