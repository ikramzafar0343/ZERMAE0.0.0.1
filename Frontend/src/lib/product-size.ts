export const PRODUCT_SIZE_UNITS = ["ml", "g"] as const;

export type ProductSizeUnit = (typeof PRODUCT_SIZE_UNITS)[number];

const SIZE_PATTERN = /^(\d+(?:\.\d+)?)\s*(ml|g)$/i;

export function normalizeSizeNumber(raw: string | number): string | null {
  const value = typeof raw === "number" ? raw : Number(String(raw).trim().replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return (Math.round(value * 1000) / 1000).toFixed(3).replace(/\.?0+$/, "");
}

export function formatProductSize(value: string | number, unit: ProductSizeUnit | string): string | null {
  const amount = normalizeSizeNumber(value);
  const normalizedUnit = String(unit).trim().toLowerCase();
  if (!amount || (normalizedUnit !== "ml" && normalizedUnit !== "g")) {
    return null;
  }
  return `${amount} ${normalizedUnit}`;
}

export function parseProductSize(label: string): { value: string; unit: ProductSizeUnit } | null {
  const match = String(label).trim().match(SIZE_PATTERN);
  if (!match) {
    return null;
  }
  const amount = normalizeSizeNumber(match[1] ?? "");
  const unit = (match[2] ?? "").toLowerCase() as ProductSizeUnit;
  if (!amount || (unit !== "ml" && unit !== "g")) {
    return null;
  }
  return { value: amount, unit };
}

export function isPresetProductSize(label: string, presets: readonly string[]): boolean {
  return presets.includes(label);
}

export function findCustomProductSize(sizes: readonly string[], presets: readonly string[]): string | null {
  return sizes.find((size) => !presets.includes(size)) ?? null;
}
