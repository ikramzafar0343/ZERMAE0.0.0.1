import { resolveStorefrontContent } from "@/constants/storefront";
import { storefrontService } from "@/server/services/storefront/storefront.service";
import { uploadService } from "@/server/services/upload/upload.service";

async function main() {
  const cmd = process.argv[2] ?? "nav";
  const state = await storefrontService.getFull();
  const content = resolveStorefrontContent(structuredClone(state.content));

  if (cmd === "nav") {
    const about = content.menus.header.find((l) => /about/i.test(l.label) || /about/i.test(l.href));
    if (about) {
      about.label = "About QA";
      about.href = "/about-us";
    }
    const policy = content.menus.footerPolicies.find((l) => /privacy|policy/i.test(l.label));
    if (policy) {
      policy.label = "Privacy QA";
    }
    await storefrontService.updatePublished(state.commerce, state.theme, content);
    console.log("NAV_OK", { about: about?.label, policy: policy?.label });
    return;
  }

  if (cmd === "oversized") {
    try {
      // Backend UPLOAD_MAX_FILE_SIZE defaults to 10MB (admin copy says 5MB).
      const big = Buffer.alloc(10 * 1024 * 1024 + 1024, 1);
      await uploadService.saveImage({
        mimeType: "image/jpeg",
        data: big.toString("base64"),
      });
      console.log("OVERSIZED_FAIL expected rejection");
    } catch (error) {
      console.log("OVERSIZED_OK", error instanceof Error ? error.message : String(error));
    }
    return;
  }

  console.log("Unknown", cmd);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
