import { createFileRoute } from "@tanstack/react-router";

import { CartPage } from "../features/cart/cart-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Cart | Midas Basket" }, noIndexMeta],
  }),
  component: CartPage,
});
