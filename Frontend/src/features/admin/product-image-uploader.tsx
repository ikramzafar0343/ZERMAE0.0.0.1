"use client";

import { useId, useRef, useState } from "react";

import { IconClose, IconPlus } from "@/components/icons/icons";
import { uploadProductImageAction } from "@/features/admin/catalog-actions";
import { CmsImage } from "@/features/media/cms-image";

const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp";

export type ProductImageSlot = {
  id: string;
  preview: string;
  file: File | null;
  url: string;
  uploading?: boolean;
};

export function createImageSlot(image?: { url: string }): ProductImageSlot {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    preview: image?.url ?? "",
    file: null,
    url: image?.url ?? "",
  };
}

export function ProductImageUploader({
  slots,
  onChange,
  error,
}: {
  slots: ProductImageSlot[];
  onChange: (slots: ProductImageSlot[] | ((current: ProductImageSlot[]) => ProductImageSlot[])) => void;
  error?: string | undefined;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");
  const primary = slots[0];
  const message = error || localError;
  const uploading = slots.some((slot) => slot.uploading);

  function revokeBlob(preview: string) {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  }

  async function uploadSlot(slotId: string, file: File) {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProductImageAction(formData);
    onChange((current) => {
      const index = current.findIndex((slot) => slot.id === slotId);
      if (index < 0) {
        return current;
      }
      const existing = current[index];
      if (!existing) {
        return current;
      }
      if (result.error || !result.url) {
        revokeBlob(existing.preview);
        return current.filter((slot) => slot.id !== slotId);
      }
      revokeBlob(existing.preview);
      const next = [...current];
      next[index] = {
        id: existing.id,
        preview: result.url,
        file: null,
        url: result.url,
        uploading: false,
      };
      return next;
    });
    if (result.error || !result.url) {
      setLocalError(result.error ?? "Image could not be uploaded.");
    }
  }

  function addFiles(fileList: FileList | File[]) {
    const problems: string[] = [];
    const pending: ProductImageSlot[] = [];
    let available = MAX_IMAGES - slots.length;
    for (const file of Array.from(fileList)) {
      if (available <= 0) {
        problems.push(`You can add up to ${MAX_IMAGES} photos.`);
        break;
      }
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        problems.push(`${file.name} must be PNG, JPG, or WEBP.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        problems.push(`${file.name} must be 5MB or smaller.`);
        continue;
      }
      pending.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        preview: URL.createObjectURL(file),
        file,
        url: "",
        uploading: true,
      });
      available -= 1;
    }
    setLocalError(problems[0] ?? "");
    if (pending.length === 0) {
      return;
    }
    onChange((current) => {
      const room = Math.max(0, MAX_IMAGES - current.length);
      const toAdd = pending.slice(0, room);
      for (const skipped of pending.slice(room)) {
        revokeBlob(skipped.preview);
      }
      return toAdd.length > 0 ? [...current, ...toAdd] : current;
    });
    const room = Math.max(0, MAX_IMAGES - slots.length);
    for (const slot of pending.slice(0, room)) {
      if (slot.file) {
        void uploadSlot(slot.id, slot.file);
      }
    }
  }

  function removeAt(index: number) {
    const slot = slots[index];
    if (slot) {
      revokeBlob(slot.preview);
    }
    onChange(slots.filter((_, itemIndex) => itemIndex !== index));
  }

  function setPrimary(index: number) {
    if (index <= 0) {
      return;
    }
    const next = [...slots];
    const [picked] = next.splice(index, 1);
    if (picked) {
      next.unshift(picked);
    }
    onChange(next);
  }

  return (
    <div className="admin-product-upload-block">
      <input
        id={inputId}
        ref={inputRef}
        className="admin-product-upload-input"
        type="file"
        accept={ACCEPT}
        multiple
        disabled={uploading || slots.length >= MAX_IMAGES}
        onChange={(event) => {
          if (event.target.files) {
            addFiles(event.target.files);
          }
          event.target.value = "";
        }}
      />
      <button
        type="button"
        className={`admin-product-stage${dragOver ? " is-over" : ""}`}
        onClick={() => inputRef.current?.click()}
        disabled={uploading || slots.length >= MAX_IMAGES}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (event.dataTransfer.files.length) {
            addFiles(event.dataTransfer.files);
          }
        }}
        aria-label={primary ? "Replace or add product photos" : "Upload product photos"}
      >
        {primary?.preview ? (
          primary.preview.startsWith("blob:") ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview while uploading
            <img src={primary.preview} alt="Main product photo" className="admin-product-stage-image" />
          ) : (
            <CmsImage src={primary.preview} alt="Main product photo" width={420} height={280} className="admin-product-stage-image" />
          )
        ) : (
          <span className="admin-product-stage-empty">Drop a photo here or click to upload</span>
        )}
      </button>
      <div className="admin-product-thumb-row">
        {slots.map((slot, index) => (
          <div
            key={slot.id}
            className={`admin-product-thumb${index === 0 ? " is-active" : ""}${slot.uploading ? " is-uploading" : ""}`}
          >
            <button type="button" className="admin-product-thumb-pick" onClick={() => setPrimary(index)} aria-label={`Set photo ${index + 1} as main`}>
              {slot.preview.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview while uploading
                <img src={slot.preview} alt="" className="admin-product-thumb-img" />
              ) : (
                <CmsImage src={slot.preview} alt="" width={48} height={48} className="admin-product-thumb-img" />
              )}
            </button>
            <button type="button" className="admin-product-thumb-remove" onClick={() => removeAt(index)} aria-label={`Remove photo ${index + 1}`}>
              <IconClose />
            </button>
          </div>
        ))}
        {slots.length < MAX_IMAGES ? (
          <button
            type="button"
            className="admin-product-thumb-add"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label="Add photo"
          >
            <IconPlus />
          </button>
        ) : null}
      </div>
      {message ? (
        <p className="admin-product-error" role="alert">
          {message}
        </p>
      ) : uploading ? (
        <p className="admin-product-kicker">Uploading photo…</p>
      ) : (
        <p className="admin-product-kicker">PNG, JPG, or WEBP. Up to 5MB each. First photo is the shop image.</p>
      )}
    </div>
  );
}
