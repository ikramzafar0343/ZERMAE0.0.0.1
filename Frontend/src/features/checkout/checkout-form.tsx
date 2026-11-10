"use client";

import { useActionState } from "react";

import { checkoutAction } from "@/features/checkout/actions";

type State = { error?: string | undefined };

export function CheckoutForm({ itemsJson }: { itemsJson: string }) {
  const [state, action] = useActionState(async (_prev: State, formData: FormData) => {
    return checkoutAction(formData);
  }, {});

  return (
    <form id="checkout-form" action={action} className="checkout-form space-y-4" autoComplete="off">
      <input type="hidden" name="items" value={itemsJson} />
      <label className="auth-field">
        <span className="sr-only">Full name</span>
        <input name="fullName" defaultValue="" required placeholder="Full name" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">Email</span>
        <input name="email" type="email" defaultValue="" required placeholder="Email" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">Phone</span>
        <input name="phone" defaultValue="" required placeholder="Phone" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">Address</span>
        <input name="address" defaultValue="" required placeholder="Address" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">City</span>
        <input name="city" defaultValue="" required placeholder="City" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">Postal code</span>
        <input name="postalCode" defaultValue="" required placeholder="Postal code" className="auth-input" autoComplete="off" />
      </label>
      <label className="auth-field">
        <span className="sr-only">Promo code</span>
        <input name="promoCode" placeholder="Promo code (optional)" className="auth-input" autoComplete="off" />
      </label>
      <input type="hidden" name="paymentMethod" value="cod" />
      <p className="checkout-note">Cash on delivery only. You will pay when the order is delivered. Card checkout is not offered.</p>
      {state.error ? <p className="auth-form-error">{state.error}</p> : null}
      <button type="submit" className="luxury-button-solid">
        Place order
      </button>
    </form>
  );
}
