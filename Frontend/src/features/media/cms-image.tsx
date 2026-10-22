import Image, { type ImageProps } from "next/image";

function shouldSkipOptimizer(src: string): boolean {
  // blob/data: not fetchable by the optimizer
  // /uploads/: runtime files served by nginx (not always on the Next disk at optimize time)
  return src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("/uploads/");
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
  const props: ImageProps = {
    src,
    alt,
    unoptimized: shouldSkipOptimizer(src),
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
