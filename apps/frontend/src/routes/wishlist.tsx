import { createFileRoute } from "@tanstack/react-router";

import { WishlistPage } from "../features/wishlist/wishlist-pages.js";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });
