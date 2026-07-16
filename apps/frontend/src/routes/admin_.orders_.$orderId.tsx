import { createFileRoute } from "@tanstack/react-router";

import { AdminOrderDetailsPage } from "../features/admin/order-details-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/orders_/$orderId")({
  head: () => ({
    meta: [{ title: "Order Details | Midas Basket" }, noIndexMeta],
  }),
  component: OrderDetailsRoute,
});

function OrderDetailsRoute() {
  const { orderId } = Route.useParams();
  return <AdminOrderDetailsPage orderId={orderId} />;
}
