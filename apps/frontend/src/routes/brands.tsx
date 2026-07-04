import { createFileRoute } from "@tanstack/react-router";

import { BrandsPage } from "../features/catalog/catalog-pages.js";
import {
  canonicalLink,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../shared/seo/seo.js";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands | Midas Basket" },
      {
        name: "description",
        content:
          "Browse trusted brands available on Midas Basket and discover curated product lines.",
      },
      indexFollowMeta,
      { property: "og:title", content: "Brands | Midas Basket" },
      {
        property: "og:description",
        content:
          "Trusted brands and curated product lines for premium everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: toAbsoluteUrl("/brands") },
    ],
    links: [canonicalLink("/brands")],
  }),
  component: BrandsPage,
});
