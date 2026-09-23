import { getEnv } from "@/lib/env";
import { storefrontService } from "@/server/services/storefront/storefront.service";

/** Extract a bare email from `Name <addr@host>` or a plain address. */
export function extractEmailAddress(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const angled = trimmed.match(/<([^>]+)>/);
  const candidate = (angled?.[1] ?? trimmed).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) {
    return null;
  }
  return candidate;
}

/**
 * Shop ops inbox for admin OTP / admin password-reset:
 * storefront emailFrom → SUPPORT_EMAIL → EMAIL_FROM.
 */
export async function resolveShopNotifyEmail(): Promise<string> {
  const env = getEnv();
  try {
    const storefront = await storefrontService.getFull();
    const fromContent = extractEmailAddress(storefront.content.emailFrom ?? "");
    if (fromContent) {
      return fromContent;
    }
  } catch {
    // fall through to env
  }
  return (
    extractEmailAddress(env.SUPPORT_EMAIL) ??
    extractEmailAddress(env.EMAIL_FROM) ??
    env.SUPPORT_EMAIL
  );
}
