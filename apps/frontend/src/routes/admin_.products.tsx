import { createFileRoute } from "@tanstack/react-router";

import { AdminProductsPage } from "../features/admin/products-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/products")({
  head: () => ({
    meta: [{ title: "Products | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminProductsPage,
});
