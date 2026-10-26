/**
 * Production QA helper: backup storefront, apply fixture images, optional restore.
 * Usage:
 *   npx tsx scripts/qa-storefront-fixtures.ts backup
 *   npx tsx scripts/qa-storefront-fixtures.ts apply
 *   npx tsx scripts/qa-storefront-fixtures.ts hide-journal
 *   npx tsx scripts/qa-storefront-fixtures.ts reorder-social
 *   npx tsx scripts/qa-storefront-fixtures.ts theme-probe
 *   npx tsx scripts/qa-storefront-fixtures.ts clear-faq
 *   npx tsx scripts/qa-storefront-fixtures.ts restore
 *   npx tsx scripts/qa-storefront-fixtures.ts negative-mime
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { resolveStorefrontContent } from "@/constants/storefront";
import { storefrontService } from "@/server/services/storefront/storefront.service";
import { uploadService } from "@/server/services/upload/upload.service";

const ROOT = path.resolve(process.cwd(), "..");
const FIXTURE_DIR = path.join(ROOT, "Frontend", "public", "media", "_qa-fixtures");
const BACKUP_PATH = path.join(ROOT, "Frontend", "public", "media", "_qa-fixtures", "storefront-backup.json");
const REPORT_PATH = path.join(ROOT, "docs", "qa-storefront-report.md");

async function uploadFixture(fileName: string): Promise<string> {
  const filePath = path.join(FIXTURE_DIR, fileName);
  const buffer = await readFile(filePath);
  const result = await uploadService.saveImage({
    mimeType: "image/jpeg",
    data: buffer.toString("base64"),
  });
  return result.url;
}

async function backup() {
  const state = await storefrontService.getFull();
  await mkdir(path.dirname(BACKUP_PATH), { recursive: true });
  await writeFile(BACKUP_PATH, JSON.stringify(state, null, 2), "utf8");
  console.log(`BACKUP_OK ${BACKUP_PATH}`);
}

async function restore() {
  const raw = JSON.parse(await readFile(BACKUP_PATH, "utf8"));
  await storefrontService.updatePublished(raw.commerce, raw.theme, resolveStorefrontContent(raw.content));
  console.log("RESTORE_OK");
}

async function apply() {
  const state = await storefrontService.getFull();
  const [cheesecake, taco, pastrami, bagel] = await Promise.all([
    uploadFixture("cheesecake.jpg"),
    uploadFixture("taco.jpg"),
    uploadFixture("pastrami.jpg"),
    uploadFixture("bagel.jpg"),
  ]);
  console.log(JSON.stringify({ cheesecake, taco, pastrami, bagel }, null, 2));

  const content = resolveStorefrontContent(structuredClone(state.content));
  content.brand.logoOnLightSrc = bagel;
  content.home.sections.hero.posterSrc = cheesecake;
  content.home.sections.lifestyle.posterSrc = taco;
  content.home.sections.mosaic.leftSrc = taco;
  content.home.sections.mosaic.rangeSrc = pastrami;
  content.home.sections.mosaic.detailSrc = bagel;
  content.home.sections.stories.compositionSrc = pastrami;
  content.home.sections.newsletter.imageSrc = cheesecake;
  if (content.home.sections.journal.articles[0]) {
    content.home.sections.journal.articles[0].src = bagel;
  }
  if (content.home.sections.social.items[0]) {
    content.home.sections.social.items[0].src = taco;
  }
  if (content.collectionPages.serums) {
    content.collectionPages.serums.heroSrc = taco;
    content.collectionPages.serums.ritualImage = pastrami;
  }
  content.pageTemplates.about.imageSrc = pastrami;
  content.pageTemplates.contact.imageSrc = bagel;
  content.pageTemplates.faq.imageSrc = cheesecake;
  content.faqImage = cheesecake;

  await storefrontService.updatePublished(state.commerce, state.theme, content);
  console.log("APPLY_OK");
}

async function hideJournal() {
  const state = await storefrontService.getFull();
  const content = resolveStorefrontContent(structuredClone(state.content));
  content.home.sections.journal.hidden = true;
  await storefrontService.updatePublished(state.commerce, state.theme, content);
  console.log("HIDE_JOURNAL_OK");
}

async function reorderSocial() {
  const state = await storefrontService.getFull();
  const content = resolveStorefrontContent(structuredClone(state.content));
  const order = [...content.home.sectionOrder];
  const socialIdx = order.indexOf("social");
  const faqIdx = order.indexOf("faq");
  if (socialIdx >= 0 && faqIdx >= 0) {
    order.splice(socialIdx, 1);
    const newFaqIdx = order.indexOf("faq");
    order.splice(newFaqIdx, 0, "social");
    content.home.sectionOrder = order;
  }
  content.home.sections.journal.hidden = false;
  await storefrontService.updatePublished(state.commerce, state.theme, content);
  console.log("REORDER_SOCIAL_OK", content.home.sectionOrder.join(","));
}

async function themeProbe() {
  const state = await storefrontService.getFull();
  const theme = { ...state.theme, primary: "#7a1f1f" };
  await storefrontService.updatePublished(state.commerce, theme, state.content);
  console.log("THEME_PROBE_OK #7a1f1f");
}

async function clearFaq() {
  const state = await storefrontService.getFull();
  const content = resolveStorefrontContent(structuredClone(state.content));
  content.pageTemplates.faq.imageSrc = "";
  content.faqImage = "";
  await storefrontService.updatePublished(state.commerce, state.theme, content);
  console.log("CLEAR_FAQ_OK");
}

async function negativeMime() {
  try {
    await uploadService.saveImage({ mimeType: "application/pdf", data: Buffer.from("%PDF").toString("base64") });
    console.log("NEGATIVE_MIME_FAIL expected rejection");
  } catch (error) {
    console.log("NEGATIVE_MIME_OK", error instanceof Error ? error.message : String(error));
  }
}

async function writeReport(lines: string[]) {
  await mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, lines.join("\n"), "utf8");
  console.log(`REPORT_OK ${REPORT_PATH}`);
}

const cmd = process.argv[2] ?? "help";

async function main() {
  switch (cmd) {
    case "backup":
      await backup();
      break;
    case "apply":
      await apply();
      break;
    case "hide-journal":
      await hideJournal();
      break;
    case "reorder-social":
      await reorderSocial();
      break;
    case "theme-probe":
      await themeProbe();
      break;
    case "clear-faq":
      await clearFaq();
      break;
    case "restore":
      await restore();
      break;
    case "negative-mime":
      await negativeMime();
      break;
    case "report":
      await writeReport(process.argv.slice(3));
      break;
    default:
      console.log("Unknown command", cmd);
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
