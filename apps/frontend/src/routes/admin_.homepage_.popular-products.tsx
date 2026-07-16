import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepagePopularProductsPage } from "../features/admin/homepage-popular-products-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/popular-products")({
  head: () => ({
    meta: [{ title: "Popular Products | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepagePopularProductsPage,
});
