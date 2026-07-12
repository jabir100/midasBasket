import { createFileRoute } from "@tanstack/react-router";

import { AdminTaxonomyFormPage } from "../features/admin/taxonomy-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/categories/new")({
  head: () => ({
    meta: [{ title: "Add Category | Midas Basket" }, noIndexMeta],
  }),
  component: NewCategoryRoute,
});

function NewCategoryRoute() {
  return <AdminTaxonomyFormPage kind="category" />;
}
