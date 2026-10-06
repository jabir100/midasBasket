import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppShell } from "../shared/layout/app-shell.js";
import { Providers } from "../shared/providers/providers.js";
import {
  defaultSocialImage,
  indexFollowMeta,
  SITE_NAME,
  socialImageMeta,
} from "../shared/seo/seo.js";
import "../styles/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Midas Basket | Premium Ecommerce" },
      {
        name: "description",
        content:
          "Shop curated essentials, featured brands, and premium everyday finds from Midas Basket.",
      },
      indexFollowMeta,
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Midas Basket | Premium Ecommerce" },
      {
        property: "og:description",
        content:
          "Shop curated essentials, featured brands, and premium everyday finds from Midas Basket.",
      },
      /*
       * Fallback card for routes that set no image of their own. Width and
       * height are left out on purpose: child routes override tags one
       * property at a time, so dimensions set here would leak onto a child
       * image of a different size. Canonical and og:url are per page for the
       * same reason; <link> tags are not deduplicated at all.
       */
      ...socialImageMeta({
        url: defaultSocialImage.url,
        alt: defaultSocialImage.alt,
      }),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "icon", href: "/favicon.png", type: "image/png" }],
  }),
  component: RootComponent,
});

function RootComponent(): ReactNode {
  return (
    <RootDocument>
      <Providers>
        <AppShell>
          <Outlet />
        </AppShell>
      </Providers>
    </RootDocument>
  );
}

function RootDocument({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
