import { redirect } from "next/navigation";

import { ADMIN_ROLES } from "@/constants/roles";
import { SiteSettingsEditor } from "@/features/admin/site-settings-editor";
import { getSessionUser } from "@/lib/session";
import { getStorefront } from "@/lib/storefront";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    redirect("/admin/login");
  }
  const storefront = await getStorefront();
  return <SiteSettingsEditor storefront={storefront} />;
}
