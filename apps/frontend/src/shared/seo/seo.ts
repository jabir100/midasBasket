import { frontendEnv } from "../config/env.js";

const siteUrl = frontendEnv.VITE_PUBLIC_SITE_URL.replace(/\/+$/, "");

export const noIndexMeta = {
  name: "robots",
  content: "noindex, nofollow, noarchive",
} as const;

export const indexFollowMeta = {
  name: "robots",
  content: "index, follow",
} as const;

export function toAbsoluteUrl(path: string): string {
  if (!path || path === "/") {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalLink(path: string): {
  rel: "canonical";
  href: string;
} {
  return {
    rel: "canonical",
    href: toAbsoluteUrl(path),
  };
}

export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const SITE_NAME = "Midas Basket";

export type SocialImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

/** 1.91:1 is the card ratio Facebook, WhatsApp, LinkedIn and X all crop to. */
const SOCIAL_IMAGE_WIDTH = 1200;
const SOCIAL_IMAGE_HEIGHT = 630;

export const defaultSocialImage: SocialImage = {
  url: "/og-image.jpg",
  alt: "Midas Basket: curated essentials from trusted brands",
  width: SOCIAL_IMAGE_WIDTH,
  height: SOCIAL_IMAGE_HEIGHT,
};

const cloudinaryUploadPrefix =
  /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

function toAbsoluteAssetUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : toAbsoluteUrl(url);
}

/*
 * Social crawlers ignore or crop images that are too small, too large or in
 * an unexpected ratio, and not all of them read WebP. Cloudinary uploads are
 * re-served as a padded 1200x630 JPEG so the whole product stays in frame;
 * any other URL is passed through as-is (made absolute) with unknown size.
 */
export function toSocialImage(image: {
  url: string;
  alt?: string;
}): SocialImage {
  const alt = image.alt?.trim() ? image.alt.trim() : SITE_NAME;
  const prefix = cloudinaryUploadPrefix.exec(image.url)?.[0];

  if (!prefix) {
    return { url: toAbsoluteAssetUrl(image.url), alt };
  }

  return {
    url: `${prefix}c_pad,b_white,w_${String(SOCIAL_IMAGE_WIDTH)},h_${String(SOCIAL_IMAGE_HEIGHT)},f_jpg,q_auto/${image.url.slice(prefix.length)}`,
    alt,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
  };
}

export function socialImageMeta(
  image: SocialImage,
): (
  { property: string; content: string } | { name: string; content: string }
)[] {
  const url = toAbsoluteAssetUrl(image.url);

  return [
    { property: "og:image", content: url },
    { property: "og:image:alt", content: image.alt },
    ...(image.width && image.height
      ? [
          { property: "og:image:width", content: String(image.width) },
          { property: "og:image:height", content: String(image.height) },
        ]
      : []),
    { name: "twitter:image", content: url },
    { name: "twitter:image:alt", content: image.alt },
  ];
}

/**
 * Title, description, canonical and Open Graph / X card tags for an
 * indexable page. X falls back to the og:* title and description.
 */
export function pageSeo({
  title,
  description,
  path,
  image = defaultSocialImage,
  type = "website",
}: Readonly<{
  title: string;
  description: string;
  path: string;
  image?: SocialImage;
  type?: "website" | "product";
}>) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      indexFollowMeta,
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: toAbsoluteUrl(path) },
      ...socialImageMeta(image),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonicalLink(path)],
  };
}
