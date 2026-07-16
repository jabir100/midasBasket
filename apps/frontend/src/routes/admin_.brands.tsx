import { createFileRoute } from "@tanstack/react-router";

import { AdminBrandsPage } from "../features/admin/brands-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/brands")({
  head: () => ({
    meta: [{ title: "Brands | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminBrandsPage,
});
