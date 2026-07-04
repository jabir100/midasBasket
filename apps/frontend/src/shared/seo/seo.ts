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
