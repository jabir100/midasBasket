import { createFileRoute } from "@tanstack/react-router";

import { WishlistPage } from "../features/wishlist/wishlist-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist | Midas Basket" }, noIndexMeta],
  }),
  component: WishlistPage,
});
