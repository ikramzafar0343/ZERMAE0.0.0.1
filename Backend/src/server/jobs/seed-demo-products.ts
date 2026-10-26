import { loadDotEnv } from "@/lib/load-dot-env";
import { logger } from "@/lib/logger";
import { closePool, databaseHealth } from "@/server/database/pool";
import { productService } from "@/server/services/products/product.service";

loadDotEnv();

async function seedDemoProducts(): Promise<void> {
  const health = await databaseHealth();
  if (health.status !== "connected") {
    throw new Error("PostgreSQL is not reachable");
  }
  const items = await productService.ensureBestSellers();
  logger.info(
    {
      count: items.length,
      skus: items.map((item) => item.sku),
    },
    "Demo products seeded",
  );
  await closePool();
}

void seedDemoProducts().catch(async (error) => {
  logger.error({ err: error }, "Demo product seed failed");
  await closePool().catch(() => undefined);
  process.exit(1);
});
