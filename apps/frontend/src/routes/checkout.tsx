import { createFileRoute } from "@tanstack/react-router";

import { CheckoutPage } from "../features/orders/orders-pages.js";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });
