import { createFileRoute } from "@tanstack/react-router";

import { AdminCategoriesPage } from "../features/admin/categories-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/categories")({
  head: () => ({
    meta: [{ title: "Categories | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminCategoriesPage,
});
