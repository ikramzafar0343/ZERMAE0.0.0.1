import Image, { type ImageProps } from "next/image";

import { resolvePublicImageUrl } from "@/lib/public-image-url";

function shouldSkipOptimizer(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
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
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
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
  } else if (loading) {
    props.loading = loading;
  }
  if (fill) {
    props.fill = true;
  } else {
    props.width = width ?? 304;
    props.height = height ?? 637;
  }
  return <Image {...props} alt={alt} />;
}
