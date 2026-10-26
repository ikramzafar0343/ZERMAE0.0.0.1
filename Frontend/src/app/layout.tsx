import "./globals.css";
import "./chrome.css";
import "./hero.css";
import "./footer.css";
import "./storefront.css";

import { Cormorant_Garamond, DM_Sans, Inter, Manrope, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import type { ReactNode } from "react";

import { brandDescription, brandName } from "@/constants/brand";
import { DEFAULT_STOREFRONT_THEME } from "@/constants/storefront";
import { CookieBanner } from "@/features/consent/cookie-banner";
import { ThemeStyle } from "@/features/theme/theme-style";
import { getStorefront } from "@/lib/storefront";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
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
        className={`${plusJakarta.variable} ${poppins.variable} ${cormorant.variable} ${inter.variable} ${manrope.variable} ${dmSans.variable} min-h-screen bg-brand-bg antialiased`}
      >
        <ThemeStyle theme={theme} />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
