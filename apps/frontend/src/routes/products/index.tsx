import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CatalogPage } from "../../features/catalog/catalog-pages.js";
import { pageSeo } from "../../shared/seo/seo.js";

const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
  limit: z.enum(["9", "12", "18"]).optional(),
});

/*
 * An index route rather than a layout over /products/$slug, so the listing's
 * head tags (canonical, og:image) never merge into product detail pages.
 */
export const Route = createFileRoute("/products/")({
  validateSearch: productSearchSchema,
  head: () =>
    pageSeo({
      title: "Products | Midas Basket",
      description:
        "Browse products with search, category, and brand filters on the Midas Basket catalog.",
      path: "/products",
    }),
  component: CatalogPage,
});
