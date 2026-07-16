import { createFileRoute } from "@tanstack/react-router";

import { DashboardInvoicesPage } from "../features/dashboard/dashboard-invoices-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard_/invoices")({
  head: () => ({
    meta: [{ title: "Invoices | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardInvoicesPage,
});
