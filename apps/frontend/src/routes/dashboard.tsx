import { createFileRoute } from "@tanstack/react-router";

import { DashboardOverviewPage } from "../features/dashboard/dashboard-overview-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardOverviewPage,
});
