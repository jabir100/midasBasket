import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CatalogPage } from "../features/catalog/catalog-pages.js";
import {
  canonicalLink,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../shared/seo/seo.js";

const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: productSearchSchema,
  head: () => ({
    meta: [
      { title: "Products | Midas Basket" },
      {
        name: "description",
        content:
          "Browse products with search, category, and brand filters on the Midas Basket catalog.",
      },
      indexFollowMeta,
      { property: "og:title", content: "Products | Midas Basket" },
      {
        property: "og:description",
        content:
          "Discover curated products with practical filters and fast loading catalog pages.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: toAbsoluteUrl("/products") },
    ],
    links: [canonicalLink("/products")],
  }),
  component: CatalogPage,
});
