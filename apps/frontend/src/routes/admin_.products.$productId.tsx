import { createFileRoute } from "@tanstack/react-router";

import { AdminProductFormPage } from "../features/admin/product-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/products/$productId")({
  head: () => ({
    meta: [{ title: "Edit Product | Midas Basket" }, noIndexMeta],
  }),
  component: EditProductRoute,
});

function EditProductRoute() {
  const { productId } = Route.useParams();
  return <AdminProductFormPage productId={productId} />;
}
