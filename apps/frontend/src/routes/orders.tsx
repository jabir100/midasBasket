import { createFileRoute } from "@tanstack/react-router";

import { OrdersPage } from "../features/orders/orders-pages.js";

export const Route = createFileRoute("/orders")({ component: OrdersPage });
