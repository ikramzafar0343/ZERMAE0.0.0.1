import type { ReactNode } from "react";

import { headers } from "next/headers";

import { MaintenanceSplash } from "@/features/site/maintenance-splash";
import { getStorefront } from "@/lib/storefront";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** Auth recovery must stay open during maintenance (admin OTP reset links, etc.). */
function isAuthRecoveryPath(pathname: string): boolean {
  return (
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/")
  );
}

/** Strip locale prefix like /en/... for path checks. */
function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en)(?=\/|$)/);
  if (!match) {
    return pathname || "/";
  }
  const rest = pathname.slice(match[0].length);
  return rest.length ? rest : "/";
}

export async function PublicSiteGate({ children }: { children: ReactNode }) {
  const headerStore = await headers();
  const rawPath =
    headerStore.get("x-pathname") ||
    headerStore.get("x-invoke-path") ||
    headerStore.get("next-url") ||
    "";
  let pathname = "/";
  if (rawPath) {
    try {
      pathname = rawPath.startsWith("http") ? new URL(rawPath).pathname : rawPath;
    } catch {
      pathname = rawPath;
    }
  }
  const path = stripLocale(pathname);
  if (isAdminPath(path) || isAuthRecoveryPath(path)) {
    return children;
  }

  const storefront = await getStorefront();
  if (!storefront.content.maintenanceMode) {
    return children;
  }
  return <MaintenanceSplash message={storefront.content.maintenanceMessage} />;
}
