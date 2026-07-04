import { createFileRoute } from "@tanstack/react-router";

import { CustomerDashboardPage } from "../features/dashboard/dashboard-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard | Midas Basket" }, noIndexMeta],
  }),
  component: CustomerDashboardPage,
});
