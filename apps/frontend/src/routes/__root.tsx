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
  canonicalLink,
  indexFollowMeta,
  toAbsoluteUrl,
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
          "Midas Basket is being rebuilt as a premium, fast, secure, and SEO-friendly ecommerce experience.",
      },
      indexFollowMeta,
      { property: "og:site_name", content: "Midas Basket" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Midas Basket | Premium Ecommerce" },
      {
        property: "og:description",
        content:
          "Premium ecommerce storefront engineered for speed, trust, and mobile-first shopping.",
      },
      { property: "og:url", content: toAbsoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      canonicalLink("/"),
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
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
