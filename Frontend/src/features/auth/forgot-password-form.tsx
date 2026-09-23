"use client";

import Link from "next/link";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/features/auth/actions";

type State = { error?: string | undefined; ok?: boolean | undefined; resetPath?: string | undefined };

export function ForgotPasswordForm({ forAdmin = false }: { forAdmin?: boolean }) {
  const [state, action] = useActionState(async (_prev: State, formData: FormData) => {
    return forgotPasswordAction(formData);
  }, {});

  const signInHref = forAdmin ? "/admin/login" : "/login";

  return (
    <div className="auth-form-panel">
      <div className="auth-form-header">
        <span className="auth-form-eyebrow">{forAdmin ? "Admin Access" : "Member Access"}</span>
        <h2 className="auth-form-title">Reset Password</h2>
        <p className="auth-form-subtitle">
          {forAdmin
            ? "Enter your admin account email. We will send a reset link to the shop inbox."
            : "Enter the email on your account and we will send a reset link."}
        </p>
      </div>
      <form className="auth-form" action={action}>
        {forAdmin ? <input type="hidden" name="forAdmin" value="true" /> : null}
        <label className="auth-field">
          <span className="sr-only">Email Address</span>
          <input type="email" name="email" placeholder="Email Address" autoComplete="email" required className="auth-input" />
        </label>
        {state.error ? <p className="auth-form-error">{state.error}</p> : null}
        {state.ok ? (
          <p className="contact-form-ok">
            {forAdmin
              ? "If that admin account exists, a reset link is on its way to the shop email."
              : "If that email is registered, a reset link is on its way."}
          </p>
        ) : null}
        {state.resetPath ? (
          <p className="contact-form-ok">
            Mail is not configured here. Use{" "}
            <Link href={state.resetPath} className="auth-link">
              this reset link
            </Link>
            .
          </p>
        ) : null}
        <button type="submit" className="auth-btn auth-btn-primary luxury-button-solid">
          Send reset link
        </button>
      </form>
      <p className="auth-form-meta">
        <span>Remembered it?</span>
        <Link href={signInHref} className="auth-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
