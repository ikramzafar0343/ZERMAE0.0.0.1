"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { IconClose } from "@/components/icons/icons";
import type { StorefrontSalesPopup } from "@/constants/storefront";
import { CmsImage } from "@/features/media/cms-image";
import { loadRecentPurchases, type RecentPurchase } from "@/features/navigation/recent-purchases";

type Card = RecentPurchase & { productPath: string };

function relativeTime(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(delta)) {
    return "just now";
  }
  const minutes = Math.max(1, Math.round(Math.abs(delta) / 60000));
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function SalesPopup({ settings }: { settings: StorefrontSalesPopup }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"wait" | "in" | "out">("wait");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!settings.enabled) {
      return undefined;
    }
    let cancelled = false;
    const demos = settings.demos
      .filter((item) => !item.hidden && item.customer.trim() && item.productName.trim())
      .map((item) => ({
        firstName: item.customer.trim(),
        city: item.city.trim(),
        productId: item.id,
        productName: item.productName.trim(),
        imageUrl: item.imageUrl,
        productPath: item.productPath || "/collections/all",
        purchasedAt: new Date(Date.now() - item.minutesAgo * 60_000).toISOString(),
      }));
    loadRecentPurchases()
      .then((rows) => {
        if (cancelled) {
          return;
        }
        const live = rows.map((row) => ({ ...row, productPath: `/product/${row.productId}` }));
        setCards([...live, ...demos]);
      })
      .catch(() => {
        if (!cancelled) {
          setCards(demos);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [settings]);

  useEffect(() => {
    if (!settings.enabled || cards.length === 0) {
      return undefined;
    }
    let cancelled = false;
    let timer = 0;
    const pause = settings.intervalSeconds * 1000;
    const hold = settings.durationSeconds * 1000;
    const arm = () => {
      timer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }
        setPhase("in");
        timer = window.setTimeout(() => {
          if (cancelled) {
            return;
          }
          setPhase("out");
          timer = window.setTimeout(() => {
            if (cancelled) {
              return;
            }
            setIndex((current) => (current + 1) % cards.length);
            setPhase("wait");
            arm();
          }, 280);
        }, hold);
      }, pause);
    };
    arm();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cards.length, cycle, settings.durationSeconds, settings.enabled, settings.intervalSeconds]);

  if (!settings.enabled || cards.length === 0 || phase === "wait") {
    return null;
  }
  const card = cards[index % cards.length];
  if (!card) {
    return null;
  }
  const themeClass = settings.theme === "dark" ? "ha-sales-popup--dark" : "ha-sales-popup--light";
  const motionClass = phase === "in" ? "is-in" : "is-out";

  return (
    <aside className={`ha-sales-popup ${themeClass} ${motionClass}`} role="status" aria-live="polite">
      {card.imageUrl ? (
        <Link href={card.productPath} className="ha-sales-popup__media" tabIndex={-1} aria-hidden="true">
          <CmsImage src={card.imageUrl} alt="" width={56} height={56} className="ha-sales-popup__img" />
        </Link>
      ) : (
        <span className="ha-sales-popup__media" aria-hidden="true" />
      )}
      <div className="ha-sales-popup__copy">
        <p className="ha-sales-popup__who">
          {card.firstName}
          {card.city ? <span> in {card.city}</span> : null}
        </p>
        <p className="ha-sales-popup__event">
          purchased{" "}
          <Link href={card.productPath}>{card.productName}</Link>
        </p>
        <p className="ha-sales-popup__time">{relativeTime(card.purchasedAt)}</p>
      </div>
      <button
        type="button"
        className="ha-sales-popup__close"
        aria-label="Dismiss purchase notification"
        onClick={() => {
          setPhase("out");
          window.setTimeout(() => {
            setIndex((current) => (current + 1) % cards.length);
            setPhase("wait");
            setCycle((value) => value + 1);
          }, 280);
        }}
      >
        <IconClose />
      </button>
    </aside>
  );
}
