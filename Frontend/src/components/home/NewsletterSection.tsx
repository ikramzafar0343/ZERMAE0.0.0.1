"use client";

import { useActionState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontHome } from "@/constants/storefront";
import { CmsImage } from "@/features/media/cms-image";
import { subscribeNewsletterAction } from "@/features/newsletter/actions";
import { HOME_NEWSLETTER } from "@/lib/content/homepage";
import { MEDIA } from "@/lib/content/media-manifest";

type State = { error?: string; ok?: boolean };

export function NewsletterSection({ cms }: { cms?: StorefrontHome["sections"]["newsletter"] }) {
  const [state, action, pending] = useActionState(async (_prev: State, formData: FormData) => {
    return subscribeNewsletterAction(formData);
  }, {});

  return (
    <section className="ha-newsletter">
      <div className="ha-newsletter__media" data-parallax-shell>
        <CmsImage
          src={cms?.imageSrc || MEDIA.newsletter.src}
          alt=""
          fill
          className="ha-media-fill"
          style={{ objectPosition: MEDIA.newsletter.objectPosition }}
          sizes="100vw"
          loading="lazy"
        />
      </div>
      <div className="ha-newsletter__overlay" aria-hidden="true" />
      <div className="ha-newsletter__content" data-section-intro>
        <SectionHeading
          eyebrow={cms?.eyebrow ?? HOME_NEWSLETTER.eyebrow}
          lines={[cms?.line1 ?? HOME_NEWSLETTER.lines[0]]}
          tone="light"
        />
        <p className="ha-newsletter__support">{cms?.support ?? HOME_NEWSLETTER.support}</p>
        <form action={action} className="ha-newsletter-form" noValidate>
          <label className="sr-only" htmlFor="ha-newsletter-email">
            Email
          </label>
          <input
            id="ha-newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Your Email"
            disabled={pending}
          />
          <button type="submit" disabled={pending}>
            {cms?.submitLabel ?? HOME_NEWSLETTER.submitLabel}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        {state.error ? (
          <p role="alert" className="ha-newsletter-form__msg ha-newsletter-form__msg--error">
            {state.error}
          </p>
        ) : null}
        {state.ok ? <p className="ha-newsletter-form__msg">You are subscribed. Thank you!</p> : null}
      </div>
    </section>
  );
}
