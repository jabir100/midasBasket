import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CatalogPage } from "../features/catalog/catalog-pages.js";

const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: productSearchSchema,
  component: CatalogPage,
});
