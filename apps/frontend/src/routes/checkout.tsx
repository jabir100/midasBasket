import { createFileRoute } from "@tanstack/react-router";

import { CheckoutPage } from "../features/orders/orders-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout | Midas Basket" }, noIndexMeta],
  }),
  component: CheckoutPage,
});
