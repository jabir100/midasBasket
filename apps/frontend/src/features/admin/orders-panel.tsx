import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Download, Eye, Search, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton, Toast } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import { getAdminOrder, type AdminOrder } from "./admin-api.js";
import { orderStatuses } from "./admin-types.js";
import {
  OrderStatusBadge,
  PaymentMethodBadge,
  PaymentStatusBadge,
  orderStatusLabel,
} from "./status-badge.js";
import { AdminSearchInput, AdminTableSelect } from "./admin-form-controls.js";
import { printInvoice } from "./invoice.js";

const paymentStatusOptions = [
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "failed", label: "Failed" },
];

export function OrdersPanel({
  isLoading,
  isUpdatingStatus,
  onSearchChange,
  onPaymentStatusChange,
  onPaymentStatusFilterChange,
  onStatusChange,
  onStatusFilterChange,
  orders,
  paymentStatusFilter,
  search,
  statusFilter,
}: Readonly<{
  isLoading: boolean;
  isUpdatingStatus: boolean;
  onSearchChange: (value: string) => void;
  onPaymentStatusChange: (
    orderId: string,
    status: string,
    paymentStatus: string,
  ) => void;
  onPaymentStatusFilterChange: (status: string) => void;
  onStatusChange: (
    orderId: string,
    status: string,
    paymentStatus: string,
  ) => void;
  onStatusFilterChange: (status: string) => void;
  orders: AdminOrder[];
  paymentStatusFilter: string;
  search: string;
  statusFilter: string;
}>): ReactNode {
  const invoiceMutation = useMutation({
    mutationFn: getAdminOrder,
    onSuccess: (order) => {
      printInvoice(order);
    },
    onError: () => {
      Toast.toast.danger("Could not load invoice details");
    },
  });

  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <div>
          <h3 className="admin-section-title">Order management</h3>
          <p className="admin-section-copy">
            Track fulfilment, update statuses, and open an order for full
            details.
          </p>
        </div>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <div className="admin-toolbar">
            <div className="admin-toolbar-search">
              <AdminSearchInput
                icon={<Search size={16} />}
                placeholder="Search by name, email, phone, or order ID"
                value={search}
                onChange={onSearchChange}
              />
            </div>
            <div className="admin-toolbar-filter">
              <AdminTableSelect
                label="Order status"
                placeholder="All statuses"
                value={statusFilter}
                options={[
                  { id: "", label: "All statuses" },
                  ...orderStatuses.map((status) => ({
                    id: status,
                    label: orderStatusLabel(status),
                  })),
                ]}
                onChange={onStatusFilterChange}
              />
            </div>
            <div className="admin-toolbar-filter">
              <AdminTableSelect
                label="Payment status"
                placeholder="All payment statuses"
                value={paymentStatusFilter}
                options={[
                  { id: "", label: "All payment statuses" },
                  ...paymentStatusOptions,
                ]}
                onChange={onPaymentStatusFilterChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && orders.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="Orders table"
              >
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Order status</th>
                    <th>Payment method</th>
                    <th>Payment status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-order-id-cell flex flex-col">
                        <Link
                          to="/admin/orders/$orderId"
                          params={{ orderId: order.id }}
                          className="admin-order-id-link"
                        >
                          {order.orderNumber}
                        </Link>
                        <small className="admin-table-muted">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </small>
                      </td>
                      <td>
                        <div className="admin-order-customer">
                          <strong>{order.customerName}</strong>
                          <small>{order.customerEmail}</small>
                        </div>
                      </td>
                      <td>
                        <strong>
                          {order.currency} {order.total.toLocaleString("en-BD")}
                        </strong>
                      </td>
                      <td className="admin-status-select-cell">
                        <AdminTableSelect
                          label={`Update status for ${order.orderNumber}`}
                          value={order.status}
                          isDisabled={isUpdatingStatus}
                          options={orderStatuses.map((status) => ({
                            id: status,
                            label: orderStatusLabel(status),
                          }))}
                          onChange={(status) => {
                            onStatusChange(
                              order.id,
                              status,
                              order.paymentStatus,
                            );
                          }}
                          renderValue={() => (
                            <OrderStatusBadge status={order.status} />
                          )}
                        />
                      </td>
                      <td>
                        <PaymentMethodBadge
                          method={order.paymentMethod ?? "cod"}
                        />
                      </td>
                      <td>
                        <AdminTableSelect
                          label={`Update payment status for ${order.orderNumber}`}
                          value={order.paymentStatus}
                          isDisabled={isUpdatingStatus}
                          options={paymentStatusOptions}
                          onChange={(paymentStatus) => {
                            onPaymentStatusChange(
                              order.id,
                              order.status,
                              paymentStatus,
                            );
                          }}
                          renderValue={() => (
                            <PaymentStatusBadge status={order.paymentStatus} />
                          )}
                        />
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Link
                            to="/admin/orders/$orderId"
                            params={{ orderId: order.id }}
                          >
                            <Button
                              iconOnly
                              tone="ghost"
                              title="View order details"
                              startContent={<Eye size={16} />}
                            >
                              View
                            </Button>
                          </Link>
                          <Button
                            iconOnly
                            tone="ghost"
                            title="Download invoice"
                            disabled={
                              invoiceMutation.isPending &&
                              invoiceMutation.variables === order.id
                            }
                            onClick={() => {
                              invoiceMutation.mutate(order.id);
                            }}
                            startContent={<Download size={16} />}
                          >
                            Download invoice
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && orders.length === 0 ? (
            <div className="admin-empty-state">
              <ShoppingCart size={28} />
              <p style={{ margin: 0 }}>No orders match the current filters.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
