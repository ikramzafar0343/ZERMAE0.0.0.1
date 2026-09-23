"use server";

import { redirect } from "next/navigation";

import { ADMIN_ROLES } from "@/constants/roles";
import { resolveStorefrontContent } from "@/constants/storefront";
import { storefrontService } from "@/lib/api/storefront";
import { revalidateStorefront } from "@/lib/revalidate-storefront";
import { getSessionUser } from "@/lib/session";

export async function updateSiteSettingsAction(formData: FormData): Promise<{ error?: string }> {
  try {
    const user = await getSessionUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      redirect("/admin/login");
    }
    const current = await storefrontService.getFull();
    const message = String(formData.get("maintenanceMessage") ?? "").trim() || "Coming Soon";
    const emailFromRaw = String(formData.get("emailFrom") ?? "").trim();
    const content = resolveStorefrontContent({
      ...current.content,
      maintenanceMode: formData.get("maintenanceMode") === "on",
      maintenanceMessage: message,
      emailFrom: emailFromRaw || current.content.emailFrom,
    });
    await storefrontService.updatePublished(current.commerce, current.theme, content);
    revalidateStorefront();
    redirect("/admin/settings");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "Settings could not be saved" };
  }
}
