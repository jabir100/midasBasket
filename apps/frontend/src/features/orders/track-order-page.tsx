import { useMutation } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
  CreditCard,
  MapPin,
  Package,
  Search,
  User,
} from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Input, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { AdminField } from "../admin/admin-form-controls.js";
import { OrderStatusBadge, PaymentStatusBadge } from "../admin/status-badge.js";
import { OrderItemsDetail } from "./order-items-detail.js";
import { trackOrder } from "./orders-api.js";
import { TrackingStepper } from "./tracking-stepper.js";

export function TrackOrderPage(): ReactNode {
  const search = useSearch({ from: "/track" });
  const [trackForm, setTrackForm] = useState({
    orderNumber: search.orderNumber ?? "",
    email: search.email ?? "",
  });
  const hasAutoSubmitted = useRef(false);

  const trackMutation = useMutation({
    mutationFn: (input: { orderNumber: string; email?: string }) =>
      trackOrder(input.orderNumber, input.email),
    onSuccess: (order) => {
      Toast.toast.success("Order found", {
        description: order.orderNumber,
      });
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Order was not found");
    },
  });

  useEffect(() => {
    if (hasAutoSubmitted.current || !search.orderNumber) {
      return;
    }

    hasAutoSubmitted.current = true;
    trackMutation.mutate({
      orderNumber: search.orderNumber,
      ...(search.email ? { email: search.email } : {}),
    });
  }, [search.orderNumber, search.email]);

  const order = trackMutation.data;

  return (
    <main className="page-shell track-order-page">
      <section className="section-heading catalog-heading track-order-heading">
        <h3 style={{ margin: 0 }}>Track Your Order</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Enter your tracking code to see order details and delivery status.
        </p>
      </section>

      <Card className="track-search-card">
        <CardBody>
          <form
            className="track-search-form"
            onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
              event.preventDefault();
              trackMutation.mutate({
                orderNumber: trackForm.orderNumber,
                ...(trackForm.email ? { email: trackForm.email } : {}),
              });
            }}
          >
            <AdminField label="Enter Tracking Code">
              <Input
                className="admin-heroui-input"
                placeholder="e.g. MB-20260712-AB12CD"
                required
                value={trackForm.orderNumber}
                onChange={(event) => {
                  setTrackForm((current) => ({
                    ...current,
                    orderNumber: event.target.value,
                  }));
                }}
              />
            </AdminField>
            <AdminField label="Email (optional, for guest lookup)">
              <Input
                className="admin-heroui-input"
                type="email"
                placeholder="you@example.com"
                value={trackForm.email}
                onChange={(event) => {
                  setTrackForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }));
                }}
              />
            </AdminField>
            <Button
              type="submit"
              tone="primary"
              disabled={trackMutation.isPending}
              startContent={<Search size={16} />}
            >
              {trackMutation.isPending ? "Searching..." : "Track"}
            </Button>
          </form>
          {trackMutation.error ? (
            <p className="form-error">{trackMutation.error.message}</p>
          ) : null}
        </CardBody>
      </Card>

      {order ? (
        <>
          <Card className="track-status-card">
            <CardBody>
              <div className="track-status-head">
                <div>
                  <small className="admin-table-muted">
                    Order #{order.orderNumber}
                  </small>
                  <div className="track-status-badges">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
              </div>

              <TrackingStepper status={order.status} />

              <div className="track-info-grid">
                <div className="track-info-item">
                  <MapPin size={18} />
                  <div>
                    <small className="admin-table-muted">Shipping to</small>
                    <strong>{order.shippingAddress.city}</strong>
                  </div>
                </div>
                <div className="track-info-item">
                  <CreditCard size={18} />
                  <div>
                    <small className="admin-table-muted">Payment status</small>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
                <div className="track-info-item">
                  <Package size={18} />
                  <div>
                    <small className="admin-table-muted">Order date</small>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="track-detail-panels">
                <div className="track-detail-panel">
                  <h3>Shipping Information</h3>
                  <p>
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2
                      ? `, ${order.shippingAddress.line2}`
                      : ""}
                    <br />
                    {order.shippingAddress.area}, {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div className="track-detail-panel">
                  <h3>
                    <User size={16} /> Customer Information
                  </h3>
                  <p>
                    Name: {order.customerName}
                    <br />
                    Phone: {order.customerPhone}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="track-items-card">
            <CardBody>
              <h2>
                Order Items
                <small className="admin-table-muted">
                  {" "}
                  ({order.items.length} item
                  {order.items.length === 1 ? "" : "s"} in this order)
                </small>
              </h2>
              <OrderItemsDetail currency={order.currency} items={order.items} />
              <dl className="cart-summary-list track-summary-list">
                <div>
                  <dt>Subtotal</dt>
                  <dd>
                    {order.currency} {order.subTotal.toLocaleString("en-BD")}
                  </dd>
                </div>
                <div>
                  <dt>Delivery Charge</dt>
                  <dd>
                    {order.currency} {order.shippingFee.toLocaleString("en-BD")}
                  </dd>
                </div>
                {order.discountTotal > 0 ? (
                  <div>
                    <dt>Discount</dt>
                    <dd>
                      -{order.currency}{" "}
                      {order.discountTotal.toLocaleString("en-BD")}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Total Payable</dt>
                  <dd>
                    <strong>
                      {order.currency} {order.total.toLocaleString("en-BD")}
                    </strong>
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </>
      ) : null}
    </main>
  );
}
