import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import { listAdminOrders, updateOrderStatus } from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { OrdersPanel } from "./orders-panel.js";

export function AdminOrdersPage(): ReactNode {
  const queryClient = useQueryClient();
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const ordersQuery = useQuery({
    queryKey: [
      "admin",
      "orders",
      orderStatusFilter,
      orderPaymentStatusFilter,
      orderSearch,
    ],
    queryFn: () =>
      listAdminOrders({
        ...(orderStatusFilter ? { status: orderStatusFilter } : {}),
        ...(orderPaymentStatusFilter
          ? { paymentStatus: orderPaymentStatusFilter }
          : {}),
        ...(orderSearch ? { search: orderSearch } : {}),
      }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
      paymentStatus,
    }: {
      orderId: string;
      status: string;
      paymentStatus?: string;
    }) =>
      updateOrderStatus(orderId, {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "audit"] });
      Toast.toast.success("Order updated");
    },
  });

  return (
    <AdminPageShell>
      <OrdersPanel
        isLoading={ordersQuery.isLoading}
        isUpdatingStatus={updateOrderMutation.isPending}
        orders={ordersQuery.data ?? []}
        search={orderSearch}
        statusFilter={orderStatusFilter}
        paymentStatusFilter={orderPaymentStatusFilter}
        onSearchChange={setOrderSearch}
        onStatusFilterChange={setOrderStatusFilter}
        onPaymentStatusFilterChange={setOrderPaymentStatusFilter}
        onStatusChange={(orderId, status, paymentStatus) => {
          updateOrderMutation.mutate({ orderId, status, paymentStatus });
        }}
        onPaymentStatusChange={(orderId, status, paymentStatus) => {
          updateOrderMutation.mutate({ orderId, status, paymentStatus });
        }}
      />
    </AdminPageShell>
  );
}
