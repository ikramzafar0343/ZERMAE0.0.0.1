import Image, { type ImageProps } from "next/image";

import { resolvePublicImageUrl } from "@/lib/public-image-url";

function shouldSkipOptimizer(src: string): boolean {
  // Uploads go through API media (?w= WebP) — Next optimizer 400s on those URLs
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
  loading,
  style,
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
  style?: ImageProps["style"];
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
  if (style) {
    props.style = style;
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
