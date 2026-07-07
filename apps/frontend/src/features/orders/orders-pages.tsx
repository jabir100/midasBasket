import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock3, Truck } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { Skeleton, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken } from "../auth/auth-api.js";
import { getCart } from "../cart/cart-api.js";
import {
  checkoutOrder,
  listMyOrders,
  trackOrder,
  type CheckoutInput,
} from "./orders-api.js";

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
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                checkoutMutation.mutate(hydratedForm);
              }}
            >
              <label>
                <span>Full name</span>
                <input
                  required
                  value={hydratedForm.customerName}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      customerName: event.target.value,
                    }));
                  }}
                />
              </label>
              <label>
                <span>Email</span>
                <input
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
              </label>
              <label>
                <span>Phone</span>
                <input
                  required
                  value={hydratedForm.customerPhone}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      customerPhone: event.target.value,
                    }));
                  }}
                />
              </label>
              <label>
                <span>Address line 1</span>
                <input
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
              </label>
              <label>
                <span>Area</span>
                <input
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
              </label>
              <label>
                <span>City</span>
                <input
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
              </label>
              <label>
                <span>Country</span>
                <input
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
              </label>
              <Button
                type="submit"
                tone="primary"
                disabled={
                  checkoutMutation.isPending ||
                  (cartQuery.data?.items.length ?? 0) === 0
                }
              >
                Place COD order
              </Button>
              {checkoutMutation.isPending ? (
                <p className="form-muted">Creating your order...</p>
              ) : null}
              {checkoutMutation.error ? (
                <p className="form-error">{checkoutMutation.error.message}</p>
              ) : null}
            </form>
          </CardBody>
        </Card>

        <Card className="checkout-summary-card">
          <CardBody>
            <h2>Checkout summary</h2>
            <p className="form-muted">Payment method: Cash on delivery (COD)</p>
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

            {checkoutMutation.data ? (
              <div className="checkout-success">
                <strong>
                  Order placed: {checkoutMutation.data.orderNumber}
                </strong>
                <Link to="/orders" className="ui-button ui-button-secondary">
                  View order tracking
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
  const [trackForm, setTrackForm] = useState({ orderNumber: "", email: "" });
  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: listMyOrders,
    enabled: Boolean(token),
  });

  const trackMutation = useMutation({
    mutationFn: (input: { orderNumber: string; email?: string }) =>
      trackOrder(input.orderNumber, input.email),
    onSuccess: (order) => {
      Toast.toast.success("Order found", {
        description: order.status,
      });
    },
  });

  return (
    <main className="page-shell orders-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>Orders and tracking</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Review your order timeline, status progression, and payment state.
        </p>
      </section>

      {token ? (
        <Card className="orders-card">
          <CardBody>
            <h2>My orders</h2>
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
                {ordersQuery.data.map((order) => (
                  <li key={order.id} className="order-row">
                    <div>
                      <strong>{order.orderNumber}</strong>
                      <small>
                        {new Date(
                          order.createdAt ?? Date.now(),
                        ).toLocaleDateString("en-BD")}
                      </small>
                    </div>
                    <div className="order-row-meta">
                      <span>{order.status}</span>
                      <span>৳{order.totals.total.toLocaleString("en-BD")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="form-muted">No customer orders found yet.</p>
            )}
          </CardBody>
        </Card>
      ) : null}

      <Card className="track-card">
        <CardBody>
          <h2>Track an order</h2>
          <form
            className="track-order-form"
            onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
              event.preventDefault();
              trackMutation.mutate({
                orderNumber: trackForm.orderNumber,
                ...(trackForm.email ? { email: trackForm.email } : {}),
              });
            }}
          >
            <input
              placeholder="Order number"
              required
              value={trackForm.orderNumber}
              onChange={(event) => {
                setTrackForm((current) => ({
                  ...current,
                  orderNumber: event.target.value,
                }));
              }}
            />
            <input
              placeholder="Email (optional for guest lookup)"
              type="email"
              value={trackForm.email}
              onChange={(event) => {
                setTrackForm((current) => ({
                  ...current,
                  email: event.target.value,
                }));
              }}
            />
            <Button
              type="submit"
              tone="secondary"
              disabled={trackMutation.isPending}
            >
              Track order
            </Button>
          </form>

          {trackMutation.error ? (
            <p className="form-error">{trackMutation.error.message}</p>
          ) : null}

          {trackMutation.data ? (
            <div className="order-tracking-card">
              <div className="order-tracking-head">
                <strong>{trackMutation.data.orderNumber}</strong>
                <span>{trackMutation.data.status}</span>
              </div>
              <ul className="tracking-timeline">
                {trackMutation.data.statusTimeline.map((entry) => (
                  <li key={`${entry.status}-${entry.timestamp}`}>
                    <Clock3 size={16} />
                    <div>
                      <strong>{entry.status}</strong>
                      <small>
                        {new Date(entry.timestamp).toLocaleString("en-BD")}
                      </small>
                      {entry.note ? <p>{entry.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="form-muted">
                <Truck size={16} /> Payment: {trackMutation.data.paymentMethod}{" "}
                · {trackMutation.data.paymentStatus}
              </p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </main>
  );
}
