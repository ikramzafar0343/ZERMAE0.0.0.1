import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow: string;
  lines: readonly string[];
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  lines,
  tone = "dark",
  align = "center",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "ha-section-heading",
        tone === "light" && "ha-section-heading--light",
        align === "left" && "text-left",
        className,
      )}
      data-section-intro
    >
      <p className="ha-eyebrow">
        {eyebrow}
        <span className="ha-eyebrow__mark" aria-hidden="true" />
      </p>
      <Tag className="ha-section-heading__title">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </Tag>
    </div>
  );
}
