import { createFileRoute } from "@tanstack/react-router";

import { OrdersPage } from "../features/orders/orders-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [{ title: "Orders | Midas Basket" }, noIndexMeta],
  }),
  component: OrdersPage,
});
