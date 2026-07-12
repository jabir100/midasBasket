import { createFileRoute } from "@tanstack/react-router";

import { AdminTaxonomyFormPage } from "../features/admin/taxonomy-form-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/brands/$brandId")({
  head: () => ({
    meta: [{ title: "Edit Brand | Midas Basket" }, noIndexMeta],
  }),
  component: EditBrandRoute,
});

function EditBrandRoute() {
  const { brandId } = Route.useParams();
  return <AdminTaxonomyFormPage kind="brand" itemId={brandId} />;
}
