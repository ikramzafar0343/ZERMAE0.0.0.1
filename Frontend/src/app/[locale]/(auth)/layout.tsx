import type { ReactNode } from "react";

import { PublicSiteGate } from "@/features/site/public-site-gate";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PublicSiteGate>{children}</PublicSiteGate>;
}
