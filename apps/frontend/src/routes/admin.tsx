import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "../features/admin/admin-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Midas Basket" }, noIndexMeta],
  }),
  component: AdminDashboardPage,
});
