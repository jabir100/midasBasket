import { createFileRoute } from "@tanstack/react-router";

import { CategoriesPage } from "../features/catalog/catalog-pages.js";
import {
  canonicalLink,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../shared/seo/seo.js";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories | Midas Basket" },
      {
        name: "description",
        content:
          "Explore product categories on Midas Basket and jump into the right collection faster.",
      },
      indexFollowMeta,
      { property: "og:title", content: "Categories | Midas Basket" },
      {
        property: "og:description",
        content:
          "Explore active catalog categories curated for faster shopping and product discovery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: toAbsoluteUrl("/categories") },
    ],
    links: [canonicalLink("/categories")],
  }),
  component: CategoriesPage,
});
