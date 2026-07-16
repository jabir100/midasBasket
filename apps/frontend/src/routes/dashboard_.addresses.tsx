import { createFileRoute } from "@tanstack/react-router";

import { DashboardAddressesPage } from "../features/dashboard/dashboard-addresses-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard_/addresses")({
  head: () => ({
    meta: [{ title: "Addresses | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardAddressesPage,
});
