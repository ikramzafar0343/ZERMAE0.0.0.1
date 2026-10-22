"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ORDER_STATUS, type OrderStatus } from "@/constants/order-status";
import { ADMIN_ROLES } from "@/constants/roles";
import { productIdFromForm, productPayloadFromForm } from "@/features/admin/parse-product-form";
import { AppError } from "@/lib/app-error";
import { orderService } from "@/lib/api/orders";
import { productService } from "@/lib/api/products";
import { revalidateStorefront } from "@/lib/revalidate-storefront";
import { saveUpload } from "@/lib/save-upload";
import { getSessionUser } from "@/lib/session";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    redirect("/admin/login");
  }
  return user;
}

async function collectImages(formData: FormData, title: string) {
  const images: Array<{ url: string; alt: string; order: number }> = [];
  for (let index = 0; index < 8; index += 1) {
    const file = formData.get(`imageFile${index + 1}`);
    const hasFile = file instanceof File && file.size > 0;
    const uploaded = hasFile ? await saveUpload(file) : null;
    if (hasFile && !uploaded) {
      throw new Error("A product photo could not be uploaded. Try again.");
    }
    const url = uploaded || String(formData.get(`imageUrl${index + 1}`) ?? "").trim();
    if (url) {
      images.push({ url, alt: title, order: index });
    }
  }
  return images;
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size < 1) {
      return { error: "Choose an image to upload." };
    }
    const url = await saveUpload(file);
    if (!url) {
      return { error: "Image could not be uploaded." };
    }
    return { url };
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error;
    }
    return {
      error: error instanceof Error ? error.message : "Image could not be uploaded.",
    };
  }
}

export async function saveProductAction(formData: FormData): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    const id = productIdFromForm(formData);
    const images = await collectImages(formData, String(formData.get("title") ?? ""));
    const imagesCleared = String(formData.get("imagesCleared") ?? "") === "1";
    const expectedCount = Number(formData.get("imageCount") ?? 0);
    if (Number.isFinite(expectedCount) && expectedCount > 0 && images.length === 0) {
      return { error: "Product photos did not save. Upload them again." };
    }
    const payload = productPayloadFromForm(formData, images, { imagesCleared });
    if (id) {
      await productService.update(id, payload);
    } else {
      await productService.create(payload);
    }
    revalidateStorefront();
    redirect("/admin/inventory");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error;
    }
    return { error: error instanceof Error ? error.message : "Product could not be saved" };
  }
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await productService.remove(id);
  revalidateStorefront(id);
  redirect("/admin/inventory");
}

export async function updateStockAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("productId") ?? "");
  await productService.update(id, { stock: Number(formData.get("stock") ?? 0) });
  revalidateStorefront();
}

export async function updateOrderStatusAction(
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requireAdmin();
    const id = String(formData.get("orderId") ?? "");
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();
    const status = String(formData.get("status") ?? "") as OrderStatus;
    if (!id || !(Object.values(ORDER_STATUS) as string[]).includes(status)) {
      return { error: "Choose a valid status to update." };
    }
    await orderService.updateStatus(id, status);
    revalidateStorefront();
    revalidatePath("/admin/orders");
    if (orderNumber) {
      revalidatePath(`/admin/orders/${orderNumber}`);
      redirect(`/admin/orders/${orderNumber}`);
    }
    return { ok: true };
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error;
    }
    return {
      error: error instanceof AppError ? error.message : "Status could not be updated",
    };
  }
}

export async function updateOrderTrackingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await orderService.updateTracking(
    String(formData.get("orderId") ?? ""),
    String(formData.get("trackingNumber") ?? ""),
    String(formData.get("trackingUrl") ?? ""),
  );
  revalidateStorefront();
}

export async function deleteOrderAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("orderId") ?? "");
  await orderService.remove(id);
  revalidateStorefront();
  redirect("/admin/orders");
}
