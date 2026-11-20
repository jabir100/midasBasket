import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CheckoutPage } from "../features/orders/orders-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

const checkoutSearchSchema = z.object({
  product: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(99).optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: checkoutSearchSchema,
  head: () => ({
    meta: [{ title: "Checkout | Midas Basket" }, noIndexMeta],
  }),
  component: CheckoutPage,
});
