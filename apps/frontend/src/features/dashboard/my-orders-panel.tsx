import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { Fragment, useState } from "react";
import { Skeleton } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { OrderItemsDetail } from "../orders/order-items-detail.js";
import type { OrderSummary } from "../orders/orders-api.js";
import { OrderStatusBadge, PaymentStatusBadge } from "../admin/status-badge.js";

export function MyOrdersPanel({
  isLoading,
  orders,
}: Readonly<{
  isLoading: boolean;
  orders: OrderSummary[];
}>): ReactNode {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <h3>My Orders</h3>
        <p>Track history, payments, and dispatch statuses of your packages.</p>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <h2>Recent Orders</h2>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && orders.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="My orders table"
              >
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Placed</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <Fragment key={order.id}>
                        <tr>
                          <td>
                            <strong>{order.orderNumber}</strong>
                          </td>
                          <td>
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
                                : "—"}
                            </small>
                          </td>
                          <td>
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td>
                            <PaymentStatusBadge status={order.paymentStatus} />
                          </td>
                          <td>
                            <strong>
                              {order.totals.currency}{" "}
                              {order.totals.total.toLocaleString("en-BD")}
                            </strong>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="order-row-expand-btn"
                              aria-label={
                                isExpanded
                                  ? `Hide items for ${order.orderNumber}`
                                  : `Show items for ${order.orderNumber}`
                              }
                              onClick={() => {
                                setExpandedOrderId(
                                  isExpanded ? null : order.id,
                                );
                              }}
                            >
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr>
                            <td colSpan={6}>
                              <OrderItemsDetail
                                currency={order.totals.currency}
                                items={order.items}
                              />
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && orders.length === 0 ? (
            <div className="admin-empty-state">
              <ShoppingBag size={28} />
              <p style={{ margin: 0 }}>No orders placed yet.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
