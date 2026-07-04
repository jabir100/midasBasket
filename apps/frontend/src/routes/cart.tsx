import { createFileRoute } from "@tanstack/react-router";

import { CartPage } from "../features/cart/cart-pages.js";

export const Route = createFileRoute("/cart")({ component: CartPage });
