"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { resolveStorefrontContent } from "@/constants/storefront";
import { IconSettings } from "@/features/admin/admin-nav-icons";
import { updateSiteSettingsAction } from "@/features/admin/site-settings-actions";
import { UnsavedGuard } from "@/features/admin/unsaved-guard";
import type { StorefrontState } from "@/lib/api/storefront";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-product-cta" disabled={pending}>
      {pending ? "Saving..." : label}
    </button>
  );
}

export function SiteSettingsEditor({ storefront }: { storefront: StorefrontState }) {
  const content = resolveStorefrontContent(storefront.content);
  const [maintenanceOn, setMaintenanceOn] = useState(content.maintenanceMode);
  const [state, action] = useActionState(async (_prev: { error?: string }, formData: FormData) => {
    return updateSiteSettingsAction(formData);
  }, {});

  return (
    <UnsavedGuard>
      <form action={action} className="admin-product-page admin-product-form">
        <header className="admin-product-toolbar">
          <div className="admin-product-toolbar-copy">
            <h1 className="admin-product-title">
              <IconSettings />
              Settings
            </h1>
            <p className="admin-product-sku">
              Public visibility and the sender address for customer order emails. SMTP credentials stay on the server.
            </p>
          </div>
          <div className="admin-product-toolbar-actions">
            {state.error ? (
              <p className="admin-product-error" role="alert">
                {state.error}
              </p>
            ) : null}
            <SaveButton label="Save Changes" />
          </div>
        </header>

        <div className="admin-product-grid">
          <fieldset className="admin-product-field admin-product-field--full">
            <legend className="admin-product-label">Website visibility</legend>
            <p className="admin-product-kicker admin-storefront-lead">
              When maintenance mode is on, visitors see only your message. Admin login and the admin panel stay available.
            </p>
            <div className="admin-product-radios">
              <label className="admin-product-radio">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={maintenanceOn}
                  onChange={(event) => setMaintenanceOn(event.target.checked)}
                />
                Maintenance / Coming Soon Mode
              </label>
            </div>
            {maintenanceOn ? (
              <div className="admin-product-field admin-product-field--full" style={{ marginTop: "1rem" }}>
                <label className="admin-product-label" htmlFor="maintenanceMessage">
                  Public message
                </label>
                <p className="admin-product-kicker">Shown full-screen to every visitor (for example “Coming Soon”).</p>
                <textarea
                  id="maintenanceMessage"
                  name="maintenanceMessage"
                  className="admin-product-soft admin-product-soft-area"
                  rows={3}
                  defaultValue={content.maintenanceMessage}
                  required
                />
              </div>
            ) : (
              <input type="hidden" name="maintenanceMessage" value={content.maintenanceMessage} />
            )}
          </fieldset>

          <fieldset className="admin-product-field admin-product-field--full">
            <legend className="admin-product-label">Email settings</legend>
            <p className="admin-product-kicker admin-storefront-lead">
              Change the From address for order confirmation emails. Host, username, and password stay in server env.
            </p>
            <label className="admin-product-label" htmlFor="emailFrom">
              Sender email
            </label>
            <input
              id="emailFrom"
              name="emailFrom"
              type="text"
              className="admin-product-soft"
              defaultValue={content.emailFrom}
              placeholder="Zermae <info@zermae.com>"
              required
            />
          </fieldset>
        </div>
      </form>
    </UnsavedGuard>
  );
}
