import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { HomeFoundationPage } from "../features/home/home-foundation-page.js";
import { fetchHomepage } from "../features/home/homepage-api.js";
import { pageSeo } from "../shared/seo/seo.js";

export const Route = createFileRoute("/")({
  /*
   * Runs on the server for the first request, so the homepage is rendered
   * into the HTML (SEO, fast first paint) and the browser makes no API call
   * on initial load. Freshness afterwards is owned by the ["homepage"] query,
   * so the loader result is kept for the lifetime of the match.
   */
  loader: () => fetchHomepage(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () => {
    const seo = pageSeo({
      title: "Midas Basket | Premium Online Shopping",
      description:
        "Shop curated essentials, featured brands, flash sale products, and premium everyday finds from Midas Basket.",
      path: "/",
    });

    return {
      ...seo,
      meta: [
        ...seo.meta,
        {
          name: "keywords",
          content:
            "Midas Basket, ecommerce, online shopping, featured products, flash sale, Bangladesh",
        },
      ],
    };
  },
  component: HomeRoute,
});

function HomeRoute(): ReactNode {
  const homepage = Route.useLoaderData();
  return <HomeFoundationPage initialHomepage={homepage} />;
}
