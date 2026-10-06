import { Globe } from "lucide-react";
import type { ReactNode } from "react";

import { BrandIcon, type BrandIconName } from "./brand-icons.js";
import type { PublicSocialLink, SocialPlatform } from "./contact-api.js";

export const socialPlatformMeta: Record<
  SocialPlatform,
  { label: string; icon: BrandIconName | null; placeholder: string }
> = {
  facebook: {
    label: "Facebook",
    icon: "facebook",
    placeholder: "https://facebook.com/yourpage",
  },
  instagram: {
    label: "Instagram",
    icon: "instagram",
    placeholder: "https://instagram.com/yourhandle",
  },
  youtube: {
    label: "YouTube",
    icon: "youtube",
    placeholder: "https://youtube.com/@yourchannel",
  },
  tiktok: {
    label: "TikTok",
    icon: "tiktok",
    placeholder: "https://tiktok.com/@yourhandle",
  },
  x: { label: "X (Twitter)", icon: "x", placeholder: "https://x.com/yourhandle" },
  linkedin: {
    label: "LinkedIn",
    icon: "linkedin",
    placeholder: "https://linkedin.com/company/yourcompany",
  },
  pinterest: {
    label: "Pinterest",
    icon: "pinterest",
    placeholder: "https://pinterest.com/yourprofile",
  },
  messenger: {
    label: "Messenger",
    icon: "messenger",
    placeholder: "https://m.me/yourpage",
  },
  telegram: {
    label: "Telegram",
    icon: "telegram",
    placeholder: "https://t.me/yourchannel",
  },
  website: { label: "Website", icon: null, placeholder: "https://example.com" },
};

export function socialLinkName(link: Pick<PublicSocialLink, "platform" | "label">): string {
  return link.label.trim() ? link.label : socialPlatformMeta[link.platform].label;
}

export function SocialIcon({
  platform,
  size = 18,
}: Readonly<{ platform: SocialPlatform; size?: number }>): ReactNode {
  const icon = socialPlatformMeta[platform].icon;
  return icon ? (
    <BrandIcon name={icon} size={size} />
  ) : (
    <Globe size={size} aria-hidden="true" />
  );
}

export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function toWhatsAppHref(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

export function SocialLinkList({
  className,
  links,
}: Readonly<{ className?: string; links: PublicSocialLink[] }>): ReactNode {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={["social-link-list", className].filter(Boolean).join(" ")}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={socialLinkName(link)}
            title={socialLinkName(link)}
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function WhatsAppIcon({ size = 18 }: Readonly<{ size?: number }>): ReactNode {
  return <BrandIcon name="whatsapp" size={size} />;
}
