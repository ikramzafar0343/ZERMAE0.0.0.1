import type { CSSProperties } from "react";

import { announcementIsVisible, type StorefrontAnnouncement } from "@/constants/storefront";

const COPIES = 8;

export function AnnouncementBar({ announcement }: { announcement: StorefrontAnnouncement }) {
  if (!announcementIsVisible(announcement)) {
    return null;
  }
  const lines = announcement.messages.filter((item) => !item.hidden && item.text.trim()).map((item) => item.text.trim());
  const sequence = Array.from({ length: COPIES }, () => lines).flat();
  const style = {
    "--announce-bg": announcement.background,
    "--announce-color": announcement.color,
    "--announce-duration": `${announcement.speed}s`,
  } as CSSProperties;

  return (
    <div className="ha-announce" style={style} role="region" aria-label="Announcement">
      <div className="ha-announce__track">
        <p className="ha-announce__group">
          {sequence.map((text, index) => (
            <span className="ha-announce__item" key={`a-${index}`}>
              {text}
            </span>
          ))}
        </p>
        <p className="ha-announce__group" aria-hidden="true">
          {sequence.map((text, index) => (
            <span className="ha-announce__item" key={`b-${index}`}>
              {text}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
