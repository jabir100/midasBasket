import { createFileRoute } from "@tanstack/react-router";

import { DashboardOrdersPage } from "../features/dashboard/dashboard-orders-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard_/orders")({
  head: () => ({
    meta: [{ title: "My Orders | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardOrdersPage,
});
