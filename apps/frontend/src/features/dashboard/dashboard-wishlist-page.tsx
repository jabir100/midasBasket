import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getWishlist } from "../wishlist/wishlist-api.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";
import { WishlistPanel } from "./wishlist-panel.js";

export function DashboardWishlistPage(): ReactNode {
  const wishlistQuery = useQuery({
    queryKey: ["wishlist", "items"],
    queryFn: getWishlist,
  });

  return (
    <DashboardPageShell>
      <WishlistPanel
        items={wishlistQuery.data ?? []}
        isLoading={wishlistQuery.isLoading}
      />
    </DashboardPageShell>
  );
}
