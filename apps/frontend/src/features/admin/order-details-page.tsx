import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, Receipt, User } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Skeleton, Toast } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import {
  getCurrentUser,
  getStoredAccessToken,
  logoutCustomer,
} from "../auth/auth-api.js";
import { getAdminOrder, updateOrderStatus } from "./admin-api.js";
import { orderStatuses } from "./admin-types.js";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  orderStatusLabel,
} from "./status-badge.js";
import { AdminTableSelect } from "./admin-form-controls.js";
import { AdminShell } from "./admin-shell.js";

export function AdminOrderDetailsPage({
  orderId,
}: Readonly<{ orderId: string }>): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    } else if (userQuery.data && userQuery.data.role !== "admin") {
      void navigate({ to: "/" });
    }
  }, [token, userQuery.data, navigate]);

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const orderQuery = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getAdminOrder(orderId),
    enabled: isAdmin,
  });

  const [note, setNote] = useState("");

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      updateOrderStatus(orderId, { status, ...(note ? { note } : {}) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "order", orderId],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      setNote("");
      Toast.toast.success("Order status updated");
    },
  });

  if (!token || userQuery.isLoading || userQuery.data?.role !== "admin") {
    return null;
  }

  const order = orderQuery.data;

  return (
    <AdminShell
      adminName={userQuery.data.name}
      isLoggingOut={logoutMutation.isPending}
      navCounts={{}}
      onLogout={() => {
        logoutMutation.mutate();
      }}
    >
    <div className="dashboard-pane-content order-details-page">
      <div className="order-breadcrumb">
        <Link to="/admin">Admin</Link>
        <ChevronRight size={14} />
        <span>Orders</span>
        <ChevronRight size={14} />
        <span>{order?.orderNumber ?? orderId}</span>
      </div>

      <div className="section-heading">
        <div>
          <Link
            to="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.85rem",
              color: "var(--color-midas-gray)",
              marginBottom: "0.4rem",
            }}
          >
            <ChevronLeft size={14} /> Back to orders
          </Link>
          <h3 className="admin-section-title">
            Order {order?.orderNumber ?? ""}
          </h3>
          <p className="admin-section-copy">
            {order?.createdAt
              ? new Date(order.createdAt).toLocaleString("en-BD", {
                  dateStyle: "long",
                  timeStyle: "short",
                })
              : "Loading order details…"}
          </p>
        </div>
        {order ? (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        ) : null}
      </div>

      {orderQuery.isLoading ? (
        <div className="admin-skeleton-stack" style={{ marginTop: "1.5rem" }}>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : null}

      {order ? (
        <div className="order-details-grid" style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <Card className="dashboard-card">
              <CardBody>
                <div className="admin-form-head">
                  <span className="dashboard-metric-icon">
                    <User size={18} />
                  </span>
                  <h2 className="order-details-section-title">
                    Customer info
                  </h2>
                </div>
                <div className="order-details-address">
                  <p>
                    <strong>{order.customerName}</strong>
                  </p>
                  <p>{order.customerEmail}</p>
                  <p>{order.customerPhone}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="dashboard-card">
              <CardBody>
                <div className="admin-form-head">
                  <span className="dashboard-metric-icon">
                    <MapPin size={18} />
                  </span>
                  <h2 className="order-details-section-title">
                    Shipping address
                  </h2>
                </div>
                <div className="order-details-address">
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 ? (
                    <p>{order.shippingAddress.line2}</p>
                  ) : null}
                  <p>
                    {order.shippingAddress.area}, {order.shippingAddress.city}
                  </p>
                  {order.shippingAddress.postalCode ? (
                    <p>{order.shippingAddress.postalCode}</p>
                  ) : null}
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="dashboard-card">
              <CardBody>
                <h2 className="order-details-section-title">
                  Order information
                </h2>
                <div className="order-details-row">
                  <span>Payment method</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="order-details-row">
                  <span>Payment status</span>
                  <span>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </span>
                </div>
                {order.couponCode ? (
                  <div className="order-details-row">
                    <span>Coupon</span>
                    <span>{order.couponCode}</span>
                  </div>
                ) : null}
                {order.notes ? (
                  <div className="order-details-row">
                    <span>Notes</span>
                    <span>{order.notes}</span>
                  </div>
                ) : null}
              </CardBody>
            </Card>

            <Card className="dashboard-card">
              <CardBody>
                <h2 className="order-details-section-title">
                  Update fulfilment status
                </h2>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <AdminTableSelect
                    label="Order status"
                    value={order.status}
                    isDisabled={updateStatusMutation.isPending}
                    options={orderStatuses.map((status) => ({
                      id: status,
                      label: orderStatusLabel(status),
                    }))}
                    onChange={(status) => {
                      updateStatusMutation.mutate({ status });
                    }}
                  />
                  <label className="admin-field">
                    <span>Note (optional, visible in timeline)</span>
                    <input
                      className="admin-heroui-input"
                      value={note}
                      onChange={(event) => {
                        setNote(event.target.value);
                      }}
                      placeholder="e.g. Handed to courier"
                    />
                  </label>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            <Card className="dashboard-card">
              <CardBody>
                <div className="admin-form-head">
                  <span className="dashboard-metric-icon">
                    <Receipt size={18} />
                  </span>
                  <h2 className="order-details-section-title">
                    Ordered items
                  </h2>
                </div>
                {order.items.map((item, index) => (
                  <div className="order-item-row" key={`${item.productId}-${index.toString()}`}>
                    {item.imageUrl ? (
                      <img
                        className="order-item-thumb"
                        src={item.imageUrl}
                        alt={item.title}
                      />
                    ) : (
                      <div className="order-item-thumb" />
                    )}
                    <div className="order-item-info">
                      <strong>{item.title}</strong>
                      <small>
                        {order.currency} {item.unitPrice.toLocaleString("en-BD")}{" "}
                        × {item.quantity}
                      </small>
                    </div>
                    <div className="order-item-total">
                      {order.currency} {item.lineTotal.toLocaleString("en-BD")}
                    </div>
                  </div>
                ))}

                <div className="order-summary-totals">
                  <div className="order-details-row">
                    <span>Subtotal</span>
                    <span>
                      {order.currency} {order.subTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="order-details-row">
                    <span>Discount</span>
                    <span>
                      -{order.currency}{" "}
                      {order.discountTotal.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="order-details-row">
                    <span>Delivery</span>
                    <span>
                      {order.currency} {order.shippingFee.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="order-details-row">
                    <span>Total</span>
                    <span>
                      {order.currency} {order.total.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="dashboard-card">
              <CardBody>
                <h2 className="order-details-section-title">
                  Status timeline
                </h2>
                <div className="order-details-timeline">
                  {order.statusTimeline.map((entry, index) => (
                    <div
                      className="order-timeline-entry"
                      key={`${entry.status}-${index.toString()}`}
                    >
                      <div className="order-timeline-meta">
                        <OrderStatusBadge status={entry.status} />
                        <span className="order-timeline-time">
                          {entry.timestamp
                            ? new Date(entry.timestamp).toLocaleString(
                                "en-BD",
                                { dateStyle: "medium", timeStyle: "short" },
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="order-timeline-note">
                        Updated by {entry.updatedBy}
                        {entry.note ? ` — ${entry.note}` : ""}
                      </p>
                    </div>
                  ))}
                  {order.statusTimeline.length === 0 ? (
                    <p className="form-muted">No timeline entries yet.</p>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {!orderQuery.isLoading && !order ? (
        <div className="admin-empty-state" style={{ marginTop: "1.5rem" }}>
          <Button
            tone="ghost"
            onClick={() => {
              void navigate({ to: "/admin" });
            }}
          >
            Order not found. Back to orders
          </Button>
        </div>
      ) : null}
    </div>
    </AdminShell>
  );
}
