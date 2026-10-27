"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";

import { IconCheck, IconFile, IconTile } from "@/components/icons/icons";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import {
  CATEGORY_LABELS,
  DISCOUNT_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  PRODUCT_VOLUME_OPTIONS,
} from "@/constants/catalog";
import { DEFAULT_STOREFRONT_THEME } from "@/constants/storefront";
import { deleteProductAction, saveProductAction } from "@/features/admin/catalog-actions";
import { ColorField } from "@/features/admin/color-field";
import { createImageSlot, type ProductImageSlot, ProductImageUploader } from "@/features/admin/product-image-uploader";
import { cn } from "@/lib/cn";
import { asHexColor } from "@/lib/hex-color";
import {
  findCustomProductSize,
  formatProductSize,
  parseProductSize,
  type ProductSizeUnit,
} from "@/lib/product-size";
import type { SerializedProduct } from "@/types/product";

type FieldErrors = Partial<Record<"title" | "detail" | "sizes" | "price" | "stock" | "category" | "images", string>>;

function omitError(errors: FieldErrors, key: keyof FieldErrors): FieldErrors {
  const next = { ...errors };
  delete next[key];
  return next;
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="admin-product-field">
      <label className="admin-product-label" htmlFor={htmlFor}>
        {label}
      </label>
      {hint ? <p className="admin-product-kicker">{hint}</p> : null}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="admin-product-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ProductForm({
  product,
  blush = DEFAULT_STOREFRONT_THEME.blush,
  mint = DEFAULT_STOREFRONT_THEME.mint,
}: {
  product?: SerializedProduct;
  blush?: string;
  mint?: string;
}) {
  const isNew = !product;
  const initialCustom = useMemo(() => {
    const label = findCustomProductSize(product?.sizes ?? [], PRODUCT_VOLUME_OPTIONS);
    return label ? parseProductSize(label) : null;
  }, [product]);
  const [sizes, setSizes] = useState<string[]>(product?.sizes?.length ? [...product.sizes] : []);
  const [customEnabled, setCustomEnabled] = useState(Boolean(initialCustom));
  const [customValue, setCustomValue] = useState(initialCustom?.value ?? "");
  const [customUnit, setCustomUnit] = useState<ProductSizeUnit>(initialCustom?.unit ?? "ml");
  const [bestSeller, setBestSeller] = useState(product?.bestSeller ?? false);
  const customLabel = formatProductSize(customValue, customUnit);
  const presetSizes = sizes.filter((size) => (PRODUCT_VOLUME_OPTIONS as readonly string[]).includes(size));
  const [discountType, setDiscountType] = useState(product?.discountType || DISCOUNT_TYPES.PERCENTAGE);
  const [slots, setSlots] = useState<ProductImageSlot[]>(() =>
    (product?.images ?? []).filter((image) => image.url).map((image) => createImageSlot(image)),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [intent, setIntent] = useState<"draft" | "publish" | null>(null);
  const [saveError, setSaveError] = useState("");
  const [pending, startTransition] = useTransition();

  function validate(nextIntent: "draft" | "publish"): FieldErrors {
    const next: FieldErrors = {};
    const title = String((document.getElementById("title") as HTMLInputElement | null)?.value ?? "").trim();
    if (title.length < 2) {
      next.title = "Product name is required.";
    }
    if (slots.some((slot) => slot.uploading || (slot.file && !slot.url))) {
      next.images = "Wait for photos to finish uploading.";
    }
    if (nextIntent === "draft") {
      return next;
    }
    const detail = String((document.getElementById("detail") as HTMLTextAreaElement | null)?.value ?? "").trim();
    if (!detail) {
      next.detail = "Description is required.";
    }
    const resolvedSizes = resolveSizes();
    if (resolvedSizes.length === 0) {
      next.sizes = customEnabled && customValue.trim()
        ? "Enter a valid custom size (e.g. 7.5 ml)."
        : "Pick at least one size.";
    }
    const price = String((document.getElementById("price") as HTMLInputElement | null)?.value ?? "").trim();
    if (price === "" || Number(price) < 0) {
      next.price = "Base price is required.";
    }
    const stock = String((document.getElementById("stock") as HTMLInputElement | null)?.value ?? "").trim();
    if (stock === "" || Number(stock) < 0) {
      next.stock = "Stock is required.";
    }
    const category = String((document.getElementById("category") as HTMLSelectElement | null)?.value ?? "").trim();
    if (!category) {
      next.category = "Category is required.";
    }
    const readyImages = slots.filter((slot) => slot.url);
    if (readyImages.length === 0) {
      next.images = "Add a main product photo.";
    }
    return next;
  }

  function submit(nextIntent: "draft" | "publish") {
    const nextErrors = validate(nextIntent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const form = document.getElementById("admin-product-form") as HTMLFormElement | null;
    if (!form) {
      return;
    }
    const readyImages = slots.filter((slot) => slot.url);
    const resolvedSizes = resolveSizes();
    const formData = new FormData(form);
    formData.set("status", nextIntent === "draft" ? PRODUCT_STATUS.DRAFT : PRODUCT_STATUS.PUBLISHED);
    formData.set("sizes", resolvedSizes.join("\n"));
    formData.set("includes", resolvedSizes[0] ?? "");
    setSizes(resolvedSizes);
    formData.set(
      "tileColor",
      asHexColor((form.querySelector('input[name="tileColor"]') as HTMLInputElement | null)?.value, blush),
    );
    if (bestSeller) {
      formData.set("bestSeller", "on");
    } else {
      formData.delete("bestSeller");
    }
    formData.set("imageCount", String(readyImages.length));
    formData.set("imagesCleared", readyImages.length === 0 ? "1" : "0");
    readyImages.forEach((slot, index) => {
      formData.set(`imageUrl${index + 1}`, slot.url);
    });
    setIntent(nextIntent);
    setSaveError("");
    startTransition(() => {
      void saveProductAction(formData)
        .then((result) => {
          if (result?.error) {
            setSaveError(result.error);
          }
        })
        .catch((error: unknown) => {
          if (typeof error === "object" && error && "digest" in error) {
            return;
          }
          setSaveError(error instanceof Error ? error.message : "Product could not be saved");
        });
    });
  }

  function resolveSizes(): string[] {
    const next = [...presetSizes];
    if (customEnabled) {
      const formatted = formatProductSize(customValue, customUnit);
      if (formatted && !next.includes(formatted)) {
        next.push(formatted);
      }
    }
    return next;
  }

  function toggleSize(size: string) {
    setSizes((current) => {
      const withoutCustom = current.filter((item) => (PRODUCT_VOLUME_OPTIONS as readonly string[]).includes(item));
      const custom = customEnabled ? formatProductSize(customValue, customUnit) : null;
      const presets = withoutCustom.includes(size)
        ? withoutCustom.filter((item) => item !== size)
        : [...withoutCustom, size];
      const next = custom ? [...presets, custom] : presets;
      if (next.length > 0) {
        setErrors((errorsState) => omitError(errorsState, "sizes"));
      }
      return next;
    });
  }

  function syncCustom(nextEnabled: boolean, nextValue: string, nextUnit: ProductSizeUnit) {
    setCustomEnabled(nextEnabled);
    setCustomValue(nextValue);
    setCustomUnit(nextUnit);
    setSizes((current) => {
      const presets = current.filter((item) => (PRODUCT_VOLUME_OPTIONS as readonly string[]).includes(item));
      if (!nextEnabled) {
        return presets;
      }
      const formatted = formatProductSize(nextValue, nextUnit);
      if (!formatted) {
        return presets;
      }
      setErrors((errorsState) => omitError(errorsState, "sizes"));
      return [...presets, formatted];
    });
  }

  return (
    <div className="admin-product-page">
      <form id="admin-product-form" className="admin-product-form" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        {product ? <input type="hidden" name="id" value={product.id} /> : null}
        <input type="hidden" name="discountType" value={discountType} />

        <header className="admin-product-toolbar">
          <div className="admin-product-toolbar-copy">
            <h1 className="admin-product-title">
              <IconTile />
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>
            {product ? <p className="admin-product-sku">{product.sku}</p> : null}
          </div>
          <div className="admin-product-toolbar-actions">
            {saveError ? (
              <p className="admin-product-error" role="alert">
                {saveError}
              </p>
            ) : null}
            <button
              type="button"
              className="admin-product-ghost"
              disabled={pending || slots.some((slot) => slot.uploading)}
              onClick={() => submit("draft")}
            >
              <IconFile />
              {pending && intent === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              className="admin-product-cta"
              disabled={pending || slots.some((slot) => slot.uploading)}
              onClick={() => submit("publish")}
            >
              <IconCheck />
              {pending && intent === "publish" ? (isNew ? "Creating..." : "Saving...") : isNew ? "Add Product" : "Save Product"}
            </button>
          </div>
        </header>

        <div className="admin-product-grid">
          <section className="admin-product-card admin-product-card--general" aria-labelledby="general-heading">
            <h2 id="general-heading" className="admin-product-card-title">
              General Information
            </h2>
            <Field
              label="Name Product"
              htmlFor="title"
              error={errors.title}
            >
              <input
                id="title"
                className="admin-product-soft"
                name="title"
                defaultValue={product?.title ?? ""}
                placeholder="Lumie Night Cream"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                onBlur={(event) => {
                  const value = event.target.value.trim();
                  setErrors((current) => {
                    if (value.length >= 2) {
                      return omitError(current, "title");
                    }
                    return { ...current, title: "Product name is required." };
                  });
                }}
              />
            </Field>
            <Field label="Description Product" htmlFor="detail" error={errors.detail}>
              <textarea
                id="detail"
                className="admin-product-soft admin-product-soft-area"
                name="detail"
                rows={5}
                defaultValue={product?.description.detail || product?.description.intro || ""}
                placeholder="A rich night cream for overnight replenishment."
                aria-invalid={Boolean(errors.detail)}
                aria-describedby={errors.detail ? "detail-error" : undefined}
                onBlur={(event) => {
                  if (event.target.value.trim()) {
                    setErrors((current) => omitError(current, "detail"));
                  }
                }}
              />
            </Field>
            <div className="admin-product-pair">
              <fieldset className={cn("admin-product-field", errors.sizes && "has-error")}>
                <legend className="admin-product-label">Size</legend>
                <p className="admin-product-kicker">Pick available size</p>
                <div className="admin-product-sizes">
                  {PRODUCT_VOLUME_OPTIONS.map((size) => {
                    const selected = sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        className={cn("admin-product-size", selected && "is-selected")}
                        aria-pressed={selected}
                        aria-label={size}
                        onClick={() => toggleSize(size)}
                      >
                        {size.replace(" ml", "ml")}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className={cn("admin-product-size", customEnabled && "is-selected")}
                    aria-pressed={customEnabled}
                    aria-label="Custom size"
                    onClick={() => {
                      if (customEnabled) {
                        syncCustom(false, customValue, customUnit);
                      } else {
                        syncCustom(true, customValue || "7.5", customUnit);
                      }
                    }}
                  >
                    Custom
                  </button>
                </div>
                {customEnabled ? (
                  <div className="admin-product-fields">
                    <div className="admin-product-field">
                      <label className="admin-product-label" htmlFor="customSizeValue">
                        Custom value
                      </label>
                      <input
                        id="customSizeValue"
                        className="admin-product-soft"
                        type="number"
                        min="0.1"
                        step="0.1"
                        inputMode="decimal"
                        value={customValue}
                        placeholder="7.5"
                        onChange={(event) => syncCustom(true, event.target.value, customUnit)}
                      />
                    </div>
                    <div className="admin-product-field">
                      <label className="admin-product-label" htmlFor="customSizeUnit">
                        Unit
                      </label>
                      <select
                        id="customSizeUnit"
                        className="admin-product-soft admin-product-select"
                        value={customUnit}
                        onChange={(event) => syncCustom(true, customValue, event.target.value as ProductSizeUnit)}
                      >
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                    <p className="admin-product-kicker">
                      Preview: {customLabel ?? "—"} | Example: 50 g
                    </p>
                  </div>
                ) : null}
                {errors.sizes ? (
                  <p className="admin-product-error" role="alert">
                    {errors.sizes}
                  </p>
                ) : null}
              </fieldset>
              <fieldset className="admin-product-field">
                <legend className="admin-product-label">Placement</legend>
                <p className="admin-product-kicker">Show in best-seller slots</p>
                <div className="admin-product-radios">
                  <label className={cn("admin-product-radio", bestSeller && "is-selected")}>
                    <input
                      type="checkbox"
                      checked={bestSeller}
                      onChange={(event) => setBestSeller(event.target.checked)}
                    />
                    List this product in Best Sellers
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="admin-product-card admin-product-card--image" aria-labelledby="image-heading">
            <h2 id="image-heading" className="admin-product-card-title">
              Upload Img
            </h2>
            <ProductImageUploader
              slots={slots}
              onChange={(next) => {
                setSlots((current) => {
                  const resolved = typeof next === "function" ? next(current) : next;
                  if (resolved.some((slot) => slot.url) || resolved.length > 0) {
                    queueMicrotask(() => setErrors((errorsState) => omitError(errorsState, "images")));
                  }
                  return resolved;
                });
              }}
              error={errors.images}
            />
            <ColorField
              name="tileColor"
              label="Card backdrop"
              defaultValue={product?.tileColor || blush}
              presets={[
                { label: "Pink", color: blush },
                { label: "Olive", color: mint },
              ]}
            />
          </section>

          <section className="admin-product-card admin-product-card--pricing" aria-labelledby="pricing-heading">
            <h2 id="pricing-heading" className="admin-product-card-title">
              Pricing And Stock
            </h2>
            <div className="admin-product-fields">
              <Field label="Base Pricing" htmlFor="price" error={errors.price}>
                <span className="admin-product-affix">
                  <span className="admin-product-affix-label">PKR</span>
                  <input
                    id="price"
                    className="admin-product-soft"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    defaultValue={product?.price ?? ""}
                    placeholder="6200"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={errors.price ? "price-error" : undefined}
                  />
                </span>
              </Field>
              <Field label="Stock" htmlFor="stock" error={errors.stock}>
                <input
                  id="stock"
                  className="admin-product-soft"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  defaultValue={product?.stock ?? ""}
                  placeholder="77"
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "stock-error" : undefined}
                />
              </Field>
              <Field label="Discount" htmlFor="discount">
                <span className="admin-product-affix">
                  <input
                    id="discount"
                    className="admin-product-soft"
                    name="discount"
                    type="number"
                    min="0"
                    max={discountType === DISCOUNT_TYPES.PERCENTAGE ? 100 : undefined}
                    step="1"
                    inputMode="numeric"
                    defaultValue={product?.discount || ""}
                    placeholder="0"
                  />
                  <span className="admin-product-affix-label">{discountType === DISCOUNT_TYPES.PERCENTAGE ? "%" : "PKR"}</span>
                </span>
              </Field>
              <Field label="Discount Type" htmlFor="discountTypeSelect">
                <select
                  id="discountTypeSelect"
                  className="admin-product-soft admin-product-select"
                  value={discountType}
                  onChange={(event) => setDiscountType(event.target.value)}
                >
                  <option value={DISCOUNT_TYPES.PERCENTAGE}>Percentage</option>
                  <option value={DISCOUNT_TYPES.FIXED}>Fixed amount</option>
                </select>
              </Field>
            </div>
          </section>

          <section className="admin-product-card admin-product-card--category" aria-labelledby="category-heading">
            <h2 id="category-heading" className="admin-product-card-title">
              Category
            </h2>
            <Field label="Product Category" htmlFor="category" error={errors.category}>
              <select
                id="category"
                className="admin-product-soft admin-product-select"
                name="category"
                defaultValue={product?.category ?? "new-arrivals"}
                required
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category] ?? category}
                  </option>
                ))}
              </select>
            </Field>
          </section>
        </div>
      </form>

      {product ? (
        <section className="admin-product-danger" aria-labelledby="product-remove-heading">
          <h2 id="product-remove-heading" className="admin-product-card-title">
            Remove listing
          </h2>
          <p className="admin-product-kicker">Archives this product so it no longer appears in the shop.</p>
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <ConfirmSubmit className="admin-product-delete" message="Archive this product from the shop?" label="Delete product" />
          </form>
        </section>
      ) : null}
    </div>
  );
}
