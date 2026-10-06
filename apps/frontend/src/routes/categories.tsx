import { createFileRoute } from "@tanstack/react-router";

import { CategoriesPage } from "../features/catalog/catalog-pages.js";
import { pageSeo } from "../shared/seo/seo.js";

export const Route = createFileRoute("/categories")({
  head: () =>
    pageSeo({
      title: "Categories | Midas Basket",
      description:
        "Explore product categories on Midas Basket and jump into the right collection faster.",
      path: "/categories",
    }),
  component: CategoriesPage,
});
