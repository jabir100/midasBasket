import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { HomeFoundationPage } from "../features/home/home-foundation-page.js";
import { fetchHomepage } from "../features/home/homepage-api.js";
import {
  canonicalLink,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../shared/seo/seo.js";

export const Route = createFileRoute("/")({
  /*
   * Runs on the server for the first request, so the homepage is rendered
   * into the HTML (SEO, fast first paint) and the browser makes no API call
   * on initial load. Freshness afterwards is owned by the ["homepage"] query,
   * so the loader result is kept for the lifetime of the match.
   */
  loader: () => fetchHomepage(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { title: "Midas Basket | Premium Online Shopping" },
      {
        name: "description",
        content:
          "Shop curated essentials, featured brands, flash sale products, and premium everyday finds from Midas Basket.",
      },
      {
        name: "keywords",
        content:
          "Midas Basket, ecommerce, online shopping, featured products, flash sale, Bangladesh",
      },
      indexFollowMeta,
      {
        property: "og:title",
        content: "Midas Basket | Premium Online Shopping",
      },
      {
        property: "og:description",
        content:
          "A fast, secure, mobile-first ecommerce experience for curated products and trusted brands.",
      },
      { property: "og:url", content: toAbsoluteUrl("/") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonicalLink("/")],
  }),
  component: HomeRoute,
});

function HomeRoute(): ReactNode {
  const homepage = Route.useLoaderData();
  return <HomeFoundationPage initialHomepage={homepage} />;
}
