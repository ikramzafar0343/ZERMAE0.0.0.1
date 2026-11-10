import { formatMoney } from "@/constants/storefront";
import { CmsImage } from "@/features/media/cms-image";
import { PrintButton } from "@/features/orders/print-button";
import { resolvePublicImageUrl } from "@/lib/public-image-url";
import type { OrderRecord } from "@/types/order";

function paymentLabel(method: string): string {
  return method === "cod" ? "Cash on delivery" : method;
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderSummary({
  order,
  currency,
}: {
  order: OrderRecord;
  currency: string;
}) {
  return (
    <div className="print-receipt">
      <div className="order-confirmation-meta">
        <div className="order-confirmation-meta-item">
          <span className="order-confirmation-meta-label">Order</span>
          <span className="order-confirmation-meta-value">{order.orderNumber}</span>
        </div>
        <div className="order-confirmation-meta-item">
          <span className="order-confirmation-meta-label">Date</span>
          <span className="order-confirmation-meta-value">{formatOrderDate(order.createdAt)}</span>
        </div>
        <div className="order-confirmation-meta-item">
          <span className="order-confirmation-meta-label">Payment</span>
          <span className="order-confirmation-meta-value">{paymentLabel(order.paymentMethod)}</span>
        </div>
      </div>

      <ul className="order-confirmation-items">
        {order.items.map((item, index) => {
          const image = resolvePublicImageUrl(item.imageUrl ?? "");
          const meta = [item.color, item.size ? `Size: ${item.size}` : null, `× ${item.quantity}`]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}-${index}`} className="order-confirmation-item">
              <div className="order-confirmation-thumb relative">
                {image ? <CmsImage src={image} alt={item.name} fill sizes="60px" /> : null}
              </div>
              <div>
                <p className="order-confirmation-item-name">{item.name}</p>
                {meta ? <p className="order-confirmation-item-meta">{meta}</p> : null}
              </div>
              <span className="order-confirmation-item-price">{formatMoney(item.price * item.quantity, currency)}</span>
            </li>
          );
        })}
      </ul>

      <div className="order-confirmation-totals">
        <p className="order-confirmation-total-row">
          <span>Subtotal</span>
          <span>{formatMoney(order.subtotal, currency)}</span>
        </p>
        {order.discountAmount > 0 ? (
          <p className="order-confirmation-total-row">
            <span>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</span>
            <span>− {formatMoney(order.discountAmount, currency)}</span>
          </p>
        ) : null}
        <p className="order-confirmation-total-row">
          <span>Shipping</span>
          <span>{order.shippingFee === 0 ? "Free" : formatMoney(order.shippingFee, currency)}</span>
        </p>
        {order.taxAmount > 0 ? (
          <p className="order-confirmation-total-row">
            <span>{order.taxLabel}</span>
            <span>{formatMoney(order.taxAmount, currency)}</span>
          </p>
        ) : null}
        <p className="order-confirmation-total-row order-confirmation-total-row--final">
          <span>Total</span>
          <span>{formatMoney(order.total, currency)}</span>
        </p>
      </div>

      <div className="order-confirmation-shipping">
        <p className="order-confirmation-shipping-title">Shipping to</p>
        <p className="order-confirmation-shipping-name">{order.customer}</p>
        <p className="order-confirmation-shipping-text">
          {order.shipping.address}, {order.shipping.city} {order.shipping.postalCode}
        </p>
        {order.trackingNumber ? (
          <p className="order-confirmation-shipping-text">
            Tracking:{" "}
            {order.trackingUrl ? (
              <a href={order.trackingUrl} className="checkout-note-link">
                {order.trackingNumber}
              </a>
            ) : (
              order.trackingNumber
            )}
          </p>
        ) : null}
      </div>

      <div className="mt-6 no-print">
        <PrintButton />
      </div>
    </div>
  );
}
