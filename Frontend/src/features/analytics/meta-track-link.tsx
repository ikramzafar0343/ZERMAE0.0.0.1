"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { trackMetaCustom } from "@/lib/meta-pixel";

type MetaTrackLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  event: string;
  children: ReactNode;
};

export function MetaTrackLink({ event, children, ...props }: MetaTrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={() => {
        trackMetaCustom(event);
      }}
    >
      {children}
    </Link>
  );
}
