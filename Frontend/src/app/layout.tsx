import "./globals.css";
import "./chrome.css";
import "./hero.css";
import "./footer.css";
import "./storefront.css";

import { Inter } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import { brandDescription, brandName } from "@/constants/brand";
import { DEFAULT_STOREFRONT_THEME } from "@/constants/storefront";
import { CookieBannerLazy } from "@/features/consent/cookie-banner-lazy";
import { ThemeStyle } from "@/features/theme/theme-style";
import { getStorefront } from "@/lib/storefront";

/** Single variable Inter file — fewer font bytes on the critical path. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "https://zermae.com"),
  title: {
    default: brandName,
    template: `%s · ${brandName}`,
  },
  description: brandDescription,
  applicationName: brandName,
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico?v=2"],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let theme = DEFAULT_STOREFRONT_THEME;
  try {
    theme = (await getStorefront()).theme;
  } catch {
    // Default theme keeps first paint unblocked if the API is slow/down.
  }
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} min-h-screen bg-brand-bg antialiased`}
        style={
          {
            // Alias legacy font CSS vars so unused families do not 404 / block
            ["--font-plus-jakarta"]: "var(--font-inter)",
            ["--font-poppins"]: "var(--font-inter)",
            ["--font-cormorant"]: "var(--font-inter)",
            ["--font-manrope"]: "var(--font-inter)",
            ["--font-dm-sans"]: "var(--font-inter)",
          } as CSSProperties
        }
      >
        <ThemeStyle theme={theme} />
        {children}
        <CookieBannerLazy />
      </body>
    </html>
  );
}
