"use client";

import { useActionState } from "react";

import { checkoutAction } from "@/features/checkout/actions";

type State = { error?: string | undefined };

export function CheckoutForm({ itemsJson }: { itemsJson: string }) {
  const [state, action] = useActionState(async (_prev: State, formData: FormData) => {
    return checkoutAction(formData);
  }, {});

  return (
    <form id="checkout-form" action={action} className="checkout-form" autoComplete="off">
      <input type="hidden" name="items" value={itemsJson} />

      <section className="checkout-section">
        <h2 className="checkout-section-title">Contact</h2>
        <div className="checkout-fields">
          <label className="checkout-field checkout-field--full">
            <span className="checkout-label">Full name</span>
            <input name="fullName" defaultValue="" required placeholder="Full name" className="checkout-input" autoComplete="off" />
          </label>
          <label className="checkout-field">
            <span className="checkout-label">Email</span>
            <input name="email" type="email" defaultValue="" required placeholder="Email" className="checkout-input" autoComplete="off" />
          </label>
          <label className="checkout-field">
            <span className="checkout-label">Phone</span>
            <input name="phone" defaultValue="" required placeholder="Phone" className="checkout-input" autoComplete="off" />
          </label>
        </div>
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section-title">Shipping</h2>
        <div className="checkout-fields">
          <label className="checkout-field checkout-field--full">
            <span className="checkout-label">Address</span>
            <input name="address" defaultValue="" required placeholder="Address" className="checkout-input" autoComplete="off" />
          </label>
          <label className="checkout-field">
            <span className="checkout-label">City</span>
            <input name="city" defaultValue="" required placeholder="City" className="checkout-input" autoComplete="off" />
          </label>
          <label className="checkout-field">
            <span className="checkout-label">Postal code</span>
            <input name="postalCode" defaultValue="" required placeholder="Postal code" className="checkout-input" autoComplete="off" />
          </label>
        </div>
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section-title">Payment</h2>
        <div className="checkout-payment-options">
          <label className="checkout-payment-option">
            <input type="radio" name="paymentMethod" value="cod" defaultChecked />
            <span>Cash on delivery — pay when your order arrives</span>
          </label>
        </div>
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section-title">Promo</h2>
        <div className="checkout-fields">
          <label className="checkout-field checkout-field--full">
            <span className="checkout-label">Promo code</span>
            <input name="promoCode" placeholder="Promo code (optional)" className="checkout-input" autoComplete="off" />
          </label>
        </div>
      </section>

      {state.error ? <p className="checkout-note" role="alert">{state.error}</p> : null}
      <button type="submit" className="luxury-button-solid checkout-submit">
        Place order
      </button>
    </form>
  );
}
