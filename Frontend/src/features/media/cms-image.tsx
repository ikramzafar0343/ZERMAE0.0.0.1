import Image, { type ImageProps } from "next/image";

import { resolvePublicImageUrl } from "@/lib/public-image-url";

function shouldSkipOptimizer(src: string): boolean {
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.startsWith("/uploads/") ||
    src.startsWith("/api/v1/media/")
  );
}

export function CmsImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const resolved = resolvePublicImageUrl(src);
  const props: ImageProps = {
    src: resolved,
    alt,
    unoptimized: shouldSkipOptimizer(resolved) || shouldSkipOptimizer(src),
  };
  if (className) {
    props.className = className;
  }
  if (sizes) {
    props.sizes = sizes;
  }
  if (priority) {
    props.priority = true;
  }
  if (fill) {
    props.fill = true;
  } else {
    props.width = width ?? 304;
    props.height = height ?? 637;
  }
  return <Image {...props} alt={alt} />;
}
