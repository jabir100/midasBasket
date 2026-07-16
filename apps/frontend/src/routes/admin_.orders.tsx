import { createFileRoute } from "@tanstack/react-router";

import { AdminOrdersPage } from "../features/admin/orders-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/orders")({
  head: () => ({
    meta: [{ title: "Orders | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminOrdersPage,
});
