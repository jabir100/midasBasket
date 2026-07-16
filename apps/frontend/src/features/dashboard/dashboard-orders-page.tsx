import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { listMyOrders } from "../orders/orders-api.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";
import { MyOrdersPanel } from "./my-orders-panel.js";

export function DashboardOrdersPage(): ReactNode {
  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: listMyOrders,
  });

  return (
    <DashboardPageShell>
      <MyOrdersPanel
        orders={ordersQuery.data ?? []}
        isLoading={ordersQuery.isLoading}
      />
    </DashboardPageShell>
  );
}
