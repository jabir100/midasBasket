import { createFileRoute } from "@tanstack/react-router";

import { AdminProductFormPage } from "../features/admin/product-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/products_/new")({
  head: () => ({
    meta: [{ title: "Add Product | Midas Basket" }, noIndexMeta],
  }),
  component: NewProductRoute,
});

function NewProductRoute() {
  return <AdminProductFormPage />;
}
