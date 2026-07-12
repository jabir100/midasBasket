import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  PackageSearch,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Input, Skeleton, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken } from "../auth/auth-api.js";
import { getCart } from "../cart/cart-api.js";
import { AdminField } from "../admin/admin-form-controls.js";
import { OrderStatusBadge } from "../admin/status-badge.js";
import { OrderItemsDetail } from "./order-items-detail.js";
import { checkoutOrder, listMyOrders, type CheckoutInput } from "./orders-api.js";

const initialCheckoutState: CheckoutInput = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  paymentMethod: "cod",
  shippingAddress: {
    line1: "",
    area: "",
    city: "",
    country: "Bangladesh",
  },
};

export function CheckoutPage(): ReactNode {
  const token = getStoredAccessToken();
  const [form, setForm] = useState<CheckoutInput>(initialCheckoutState);
  const cartQuery = useQuery({ queryKey: ["cart"], queryFn: getCart });
  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: Boolean(token),
  });

  const hydratedForm = useMemo(() => {
    if (!profileQuery.data) {
      return form;
    }

    return {
      ...form,
      customerName: form.customerName || profileQuery.data.name,
      customerEmail: form.customerEmail || profileQuery.data.email,
    };
  }, [form, profileQuery.data]);

  const checkoutMutation = useMutation({
    mutationFn: checkoutOrder,
    onSuccess: (order) => {
      Toast.toast.success("Order placed", {
        description: order.orderNumber,
      });
    },
  });

  return (
    <main className="page-shell checkout-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>Single-page checkout</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Confirm your details and place your order using Cash on Delivery.
        </p>
      </section>

      {cartQuery.data && cartQuery.data.items.length === 0 ? (
        <p className="form-muted">
          Your cart is empty. Add items before checkout.
        </p>
      ) : null}

      <section className="checkout-layout">
        <Card className="checkout-form-card">
          <CardBody>
            <h2>Delivery details</h2>
            <form
              className="admin-modern-form"
              onSubmit={(event) => {
                event.preventDefault();
                checkoutMutation.mutate(hydratedForm);
              }}
            >
              <div className="admin-form-grid two">
                <AdminField label="Full name">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={hydratedForm.customerName}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        customerName: event.target.value,
                      }));
                    }}
                  />
                </AdminField>
                <AdminField label="Phone">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={hydratedForm.customerPhone}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        customerPhone: event.target.value,
                      }));
                    }}
                  />
                </AdminField>
              </div>

              <AdminField label="Email">
                <Input
                  className="admin-heroui-input"
                  required
                  type="email"
                  value={hydratedForm.customerEmail}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      customerEmail: event.target.value,
                    }));
                  }}
                />
              </AdminField>

              <AdminField label="Address line 1">
                <Input
                  className="admin-heroui-input"
                  required
                  value={hydratedForm.shippingAddress.line1}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      shippingAddress: {
                        ...current.shippingAddress,
                        line1: event.target.value,
                      },
                    }));
                  }}
                />
              </AdminField>

              <div className="admin-form-grid two">
                <AdminField label="Area">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={hydratedForm.shippingAddress.area}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        shippingAddress: {
                          ...current.shippingAddress,
                          area: event.target.value,
                        },
                      }));
                    }}
                  />
                </AdminField>
                <AdminField label="City">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={hydratedForm.shippingAddress.city}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        shippingAddress: {
                          ...current.shippingAddress,
                          city: event.target.value,
                        },
                      }));
                    }}
                  />
                </AdminField>
              </div>

              <AdminField label="Country">
                <Input
                  className="admin-heroui-input"
                  required
                  value={hydratedForm.shippingAddress.country}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      shippingAddress: {
                        ...current.shippingAddress,
                        country: event.target.value,
                      },
                    }));
                  }}
                />
              </AdminField>

              <div className="checkout-payment-method">
                <Banknote size={18} />
                <span>Payment method: Cash on Delivery</span>
              </div>

              <div className="admin-form-actions">
                <Button
                  type="submit"
                  tone="primary"
                  disabled={
                    checkoutMutation.isPending ||
                    (cartQuery.data?.items.length ?? 0) === 0
                  }
                >
                  {checkoutMutation.isPending
                    ? "Placing order..."
                    : "Place COD order"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="checkout-summary-card">
          <CardBody>
            <h2>Order summary</h2>

            {cartQuery.data && cartQuery.data.items.length > 0 ? (
              <ul className="checkout-item-preview-list">
                {cartQuery.data.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
                  >
                    <div className="cart-item-thumb">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div
                          className="cart-item-thumb-placeholder"
                          aria-hidden="true"
                        >
                          <PackageSearch size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <small className="admin-table-muted">
                        Qty {item.quantity}
                        {item.size && item.color
                          ? ` · ${item.size} / ${item.color}`
                          : ""}
                      </small>
                    </div>
                    <span>৳{item.lineTotal.toLocaleString("en-BD")}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <dl className="cart-summary-list">
              <div>
                <dt>Items</dt>
                <dd>{cartQuery.data?.summary.itemCount ?? 0}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>
                  ৳
                  {(cartQuery.data?.summary.subTotal ?? 0).toLocaleString(
                    "en-BD",
                  )}
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>
                  ৳
                  {(cartQuery.data?.summary.total ?? 0).toLocaleString("en-BD")}
                </dd>
              </div>
            </dl>

            <div className="checkout-trust-row">
              <Truck size={16} /> Cash on delivery, pay when it arrives
            </div>

            {checkoutMutation.data ? (
              <div className="checkout-success">
                <CircleCheck size={28} className="tone-success" />
                <strong>
                  Order placed: {checkoutMutation.data.orderNumber}
                </strong>
                <Link to="/track" className="ui-button ui-button-secondary">
                  Track this order
                </Link>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

export function OrdersPage(): ReactNode {
  const token = getStoredAccessToken();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: listMyOrders,
    enabled: Boolean(token),
  });

  return (
    <main className="page-shell orders-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>My Orders</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Review your order history, payments, and dispatch statuses.
        </p>
      </section>

      {token ? (
        <Card className="orders-card">
          <CardBody>
            {ordersQuery.isLoading ? (
              <div
                style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}
              >
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : null}
            {ordersQuery.data && ordersQuery.data.length > 0 ? (
              <ul className="orders-list">
                {ordersQuery.data.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <li
                      key={order.id}
                      className="order-row"
                      style={{ flexDirection: "column", alignItems: "stretch" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                        }}
                      >
                        <div>
                          <strong>{order.orderNumber}</strong>
                          <small>
                            {new Date(
                              order.createdAt ?? Date.now(),
                            ).toLocaleDateString("en-BD")}
                          </small>
                        </div>
                        <div className="order-row-meta">
                          <OrderStatusBadge status={order.status} />
                          <span>
                            ৳{order.totals.total.toLocaleString("en-BD")}
                          </span>
                          <button
                            type="button"
                            className="order-row-expand-btn"
                            aria-label={
                              isExpanded
                                ? `Hide items for ${order.orderNumber}`
                                : `Show items for ${order.orderNumber}`
                            }
                            onClick={() => {
                              setExpandedOrderId(isExpanded ? null : order.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      {isExpanded ? (
                        <OrderItemsDetail
                          currency={order.totals.currency}
                          items={order.items}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="cart-empty-state">
                <PackageSearch size={26} />
                <p>No customer orders found yet.</p>
                <Link to="/products" className="ui-button ui-button-secondary">
                  Browse products
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      ) : null}

      <Card className="track-card">
        <CardBody>
          <div className="track-cta">
            <div>
              <h2>Looking for an order?</h2>
              <p className="form-muted" style={{ margin: 0 }}>
                Track any order — yours or a guest checkout — with its order
                number.
              </p>
            </div>
            <Link
              to="/track"
              className="ui-button ui-button-primary"
              style={{ width: "auto" }}
            >
              Track an order
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
