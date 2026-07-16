import { createFileRoute } from "@tanstack/react-router";

import { DashboardWishlistPage } from "../features/dashboard/dashboard-wishlist-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard_/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardWishlistPage,
});
