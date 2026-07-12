import { createFileRoute } from "@tanstack/react-router";

import { AdminTaxonomyFormPage } from "../features/admin/taxonomy-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/brands/new")({
  head: () => ({
    meta: [{ title: "Add Brand | Midas Basket" }, noIndexMeta],
  }),
  component: NewBrandRoute,
});

function NewBrandRoute() {
  return <AdminTaxonomyFormPage kind="brand" />;
}
