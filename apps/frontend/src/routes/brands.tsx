import { createFileRoute } from "@tanstack/react-router";

import { BrandsPage } from "../features/catalog/catalog-pages.js";
import { pageSeo } from "../shared/seo/seo.js";

export const Route = createFileRoute("/brands")({
  head: () =>
    pageSeo({
      title: "Brands | Midas Basket",
      description:
        "Browse trusted brands available on Midas Basket and discover curated product lines.",
      path: "/brands",
    }),
  component: BrandsPage,
});
