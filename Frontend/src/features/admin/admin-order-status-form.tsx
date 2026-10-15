"use client";

import { useActionState } from "react";

import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/constants/order-status";
import { updateOrderStatusAction } from "@/features/admin/catalog-actions";

type State = { ok?: boolean; error?: string };

export function AdminOrderStatusForm({
  orderId,
  orderNumber,
  nextStatuses,
}: {
  orderId: string;
  orderNumber: string;
  nextStatuses: readonly OrderStatus[];
}) {
  const [state, action] = useActionState(async (_prev: State, formData: FormData) => {
    return updateOrderStatusAction(formData);
  }, {});

  if (nextStatuses.length === 0) {
    return null;
  }

  return (
    <form action={action} className="admin-orders-status-form">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="orderNumber" value={orderNumber} />
      {state.error ? (
        <p className="admin-product-error admin-storefront-lead" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="admin-orders-muted" role="status">
          Status updated.
        </p>
      ) : null}
      <label className="admin-product-label" htmlFor="status">
        Update status
      </label>
      <select
        id="status"
        name="status"
        defaultValue={nextStatuses[0]}
        className="admin-product-soft admin-product-select"
      >
        {nextStatuses.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      <ConfirmSubmit className="admin-product-cta" message="Update this order status?" label="Update status" />
    </form>
  );
}
