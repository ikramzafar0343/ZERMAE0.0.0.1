import type { ReactNode } from "react";

export function RevealLine({ children }: { children: ReactNode }) {
  return (
    <span className="skin-reveal-line">
      <span className="reveal-line">{children}</span>
    </span>
  );
}
