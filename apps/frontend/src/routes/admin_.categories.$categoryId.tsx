import { createFileRoute } from "@tanstack/react-router";

import { AdminTaxonomyFormPage } from "../features/admin/taxonomy-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/categories/$categoryId")({
  head: () => ({
    meta: [{ title: "Edit Category | Midas Basket" }, noIndexMeta],
  }),
  component: EditCategoryRoute,
});

function EditCategoryRoute() {
  const { categoryId } = Route.useParams();
  return <AdminTaxonomyFormPage kind="category" itemId={categoryId} />;
}
