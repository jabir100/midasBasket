import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  Minus,
  PackageSearch,
  Plus,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Input, Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken } from "../auth/auth-api.js";
import { getCart } from "../cart/cart-api.js";
import { getProduct } from "../catalog/catalog-api.js";
import { AdminField } from "../admin/admin-form-controls.js";
import { OrderStatusBadge } from "../admin/status-badge.js";
import { OrderItemsDetail } from "./order-items-detail.js";
import { checkoutOrder, listMyOrders, type CheckoutInput } from "./orders-api.js";
import { toast } from "../../shared/ui/toaster.js";

const LOW_STOCK_THRESHOLD = 10;

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: "/checkout" });
  const buyNowSlug = search.product?.trim() || null;
  const isBuyNowMode = Boolean(buyNowSlug);

  const [form, setForm] = useState<CheckoutInput>(initialCheckoutState);
  const [buyNowQuantity, setBuyNowQuantity] = useState(search.quantity ?? 1);
  const [buyNowSize, setBuyNowSize] = useState<string | null>(
    search.size?.trim() || null,
  );
  const [buyNowColor, setBuyNowColor] = useState<string | null>(
    search.color?.trim() || null,
  );

  useEffect(() => {
    setBuyNowQuantity(search.quantity ?? 1);
    setBuyNowSize(search.size?.trim() || null);
    setBuyNowColor(search.color?.trim() || null);
  }, [buyNowSlug, search.quantity, search.size, search.color]);

  const cartQuery = useQuery({ queryKey: ["cart"], queryFn: getCart });
  const buyNowProductQuery = useQuery({
    queryKey: ["catalog", "product", buyNowSlug],
    queryFn: () => getProduct(buyNowSlug!),
    enabled: isBuyNowMode,
  });
  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: Boolean(token),
  });

  const buyNowProduct = buyNowProductQuery.data;
  const hasBuyNowVariants = (buyNowProduct?.variants.length ?? 0) > 0;

  const buyNowSizes = useMemo(
    () => [
      ...new Set(
        (buyNowProduct?.variants ?? [])
          .map((v) => v.size.trim())
          .filter((s) => s.length > 0),
      ),
    ],
    [buyNowProduct?.variants],
  );
  const buyNowColors = useMemo(
    () => [
      ...new Set(
        (buyNowProduct?.variants ?? [])
          .map((v) => v.color.trim())
          .filter((c) => c.length > 0),
      ),
    ],
    [buyNowProduct?.variants],
  );

  useEffect(() => {
    if (!buyNowProduct || buyNowProduct.variants.length === 0) {
      return;
    }

    const match = buyNowProduct.variants.find(
      (v) =>
        (v.size.trim().toUpperCase() || null) ===
          (buyNowSize?.trim().toUpperCase() || null) &&
        (v.color.trim() || null) === (buyNowColor?.trim() || null),
    );
    if (match) {
      const normalizedSize = match.size.trim() || null;
      const normalizedColor = match.color.trim() || null;
      if (normalizedSize !== buyNowSize) {
        setBuyNowSize(normalizedSize);
      }
      if (normalizedColor !== buyNowColor) {
        setBuyNowColor(normalizedColor);
      }
      return;
    }

    const preferred =
      buyNowProduct.variants.find((v) => v.stockQuantity > 0) ??
      buyNowProduct.variants[0];
    if (preferred) {
      setBuyNowSize(preferred.size.trim() || null);
      setBuyNowColor(preferred.color.trim() || null);
    }
  }, [buyNowProduct, buyNowColor, buyNowSize]);

  const selectedBuyNowVariant = useMemo(() => {
    const variants = buyNowProduct?.variants ?? [];
    if (variants.length === 0) {
      return null;
    }
    return (
      variants.find(
        (v) =>
          (v.size.trim() || null) === buyNowSize &&
          (v.color.trim() || null) === buyNowColor,
      ) ?? null
    );
  }, [buyNowProduct?.variants, buyNowColor, buyNowSize]);

  const activeStockQuantity = hasBuyNowVariants
    ? (selectedBuyNowVariant?.stockQuantity ?? 0)
    : (buyNowProduct?.stockQuantity ?? 0);
  const isBuyNowInStock = activeStockQuantity > 0;
  const maxOrderQuantity = isBuyNowInStock
    ? activeStockQuantity > LOW_STOCK_THRESHOLD
      ? 99
      : activeStockQuantity
    : 1;

  useEffect(() => {
    if (!buyNowProduct) {
      return;
    }
    setBuyNowQuantity((current) =>
      Math.min(Math.max(current, 1), maxOrderQuantity),
    );
  }, [buyNowProduct, maxOrderQuantity]);

  function handleSelectBuyNowSize(size: string): void {
    setBuyNowSize(size);
    if (buyNowColors.length === 0) {
      return;
    }
    const variants = buyNowProduct?.variants ?? [];
    const exactMatch = variants.find(
      (v) =>
        v.size.trim() === size && (v.color.trim() || null) === buyNowColor,
    );
    if (exactMatch) {
      return;
    }
    const fallback =
      variants.find((v) => v.size.trim() === size && v.stockQuantity > 0) ??
      variants.find((v) => v.size.trim() === size);
    setBuyNowColor(fallback ? fallback.color.trim() || null : null);
  }

  function handleSelectBuyNowColor(color: string): void {
    setBuyNowColor(color);
    if (buyNowSizes.length === 0) {
      return;
    }
    const variants = buyNowProduct?.variants ?? [];
    const exactMatch = variants.find(
      (v) =>
        (v.size.trim() || null) === buyNowSize && v.color.trim() === color,
    );
    if (exactMatch) {
      return;
    }
    const fallback =
      variants.find((v) => v.color.trim() === color && v.stockQuantity > 0) ??
      variants.find((v) => v.color.trim() === color);
    setBuyNowSize(fallback ? fallback.size.trim() || null : null);
  }

  const buyNowItemCount = buyNowProduct ? buyNowQuantity : 0;
  const buyNowSubTotal = (buyNowProduct?.price ?? 0) * buyNowQuantity;
  const buyNowShippingFee =
    buyNowSubTotal > 0 ? (buyNowSubTotal >= 2000 ? 0 : 120) : 0;
  const buyNowTotal = buyNowSubTotal + buyNowShippingFee;

  const buyNowImage = useMemo(() => {
    const images = buyNowProduct?.images ?? [];
    if (buyNowColor) {
      const matching = images.find((image) => image.color === buyNowColor);
      if (matching) {
        return matching;
      }
    }
    return images[0];
  }, [buyNowColor, buyNowProduct?.images]);

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
    onSuccess: async (order, variables) => {
      toast.success("Order placed", {
        description: order.orderNumber,
      });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      await navigate({
        to: "/track",
        search: {
          orderNumber: order.orderNumber,
          email: variables.customerEmail,
        },
      });
    },
  });

  const isSubmitDisabled = isBuyNowMode
    ? !buyNowProduct || !isBuyNowInStock || checkoutMutation.isPending
    : checkoutMutation.isPending || (cartQuery.data?.items.length ?? 0) === 0;

  return (
    <main className="page-shell checkout-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>Checkout</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Confirm your details and place your order using Cash on Delivery.
        </p>
      </section>

      {!isBuyNowMode && cartQuery.data && cartQuery.data.items.length === 0 ? (
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
                if (isBuyNowMode) {
                  if (!buyNowProduct || !isBuyNowInStock) {
                    return;
                  }
                  checkoutMutation.mutate({
                    ...hydratedForm,
                    buyNowItem: {
                      productId: buyNowProduct._id,
                      quantity: buyNowQuantity,
                      ...(buyNowSize ? { size: buyNowSize } : {}),
                      ...(buyNowColor ? { color: buyNowColor } : {}),
                    },
                  });
                  return;
                }
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

              {checkoutMutation.error ? (
                <p className="form-error">{checkoutMutation.error.message}</p>
              ) : null}

              <div className="admin-form-actions">
                <Button
                  type="submit"
                  tone="primary"
                  disabled={isSubmitDisabled}
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

            {isBuyNowMode ? (
              <>
                {buyNowProductQuery.isLoading ? (
                  <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : null}

                {buyNowProductQuery.error ? (
                  <p className="form-error">
                    Unable to load selected product. It may no longer be
                    available.
                  </p>
                ) : null}

                {buyNowProduct ? (
                  <>
                    <ul className="checkout-item-preview-list">
                      <li>
                        <div className="cart-item-thumb">
                          {buyNowImage ? (
                            <img
                              src={buyNowImage.url}
                              alt={buyNowImage.alt || buyNowProduct.name}
                            />
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
                          <Link
                            to="/products/$slug"
                            params={{ slug: buyNowProduct.slug }}
                          >
                            <strong>{buyNowProduct.name}</strong>
                          </Link>
                          <small className="admin-table-muted">
                            ৳{buyNowProduct.price.toLocaleString("en-BD")}
                            {buyNowSize && buyNowColor
                              ? ` · ${buyNowSize} / ${buyNowColor}`
                              : buyNowSize
                                ? ` · ${buyNowSize}`
                                : buyNowColor
                                  ? ` · ${buyNowColor}`
                                  : ""}
                          </small>
                        </div>
                        <span>৳{buyNowSubTotal.toLocaleString("en-BD")}</span>
                      </li>
                    </ul>

                    <div className="checkout-buy-now-controls">
                      <div className="product-quantity-row">
                        <span>Quantity</span>
                        <div className="product-quantity-stepper">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={!isBuyNowInStock || buyNowQuantity <= 1}
                            onClick={() => {
                              setBuyNowQuantity((q) => Math.max(1, q - 1));
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span aria-live="polite">{buyNowQuantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={
                              !isBuyNowInStock ||
                              buyNowQuantity >= maxOrderQuantity
                            }
                            onClick={() => {
                              setBuyNowQuantity((q) =>
                                Math.min(maxOrderQuantity, q + 1),
                              );
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {hasBuyNowVariants ? (
                        <div className="checkout-variant-picker">
                          {buyNowSizes.length > 0 ? (
                            <div className="checkout-variant-group">
                              <span>Size</span>
                              <div className="checkout-variant-options">
                                {buyNowSizes.map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    aria-pressed={buyNowSize === size}
                                    className={`checkout-variant-option ${
                                      buyNowSize === size ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                      handleSelectBuyNowSize(size);
                                    }}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {buyNowColors.length > 0 ? (
                            <div className="checkout-variant-group">
                              <span>Color</span>
                              <div className="checkout-variant-options">
                                {buyNowColors.map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    aria-pressed={buyNowColor === color}
                                    className={`checkout-variant-option ${
                                      buyNowColor === color ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                      handleSelectBuyNowColor(color);
                                    }}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {!isBuyNowInStock ? (
                        <p className="form-error">
                          Selected option is currently out of stock.
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                <dl className="cart-summary-list">
                  <div>
                    <dt>Items</dt>
                    <dd>{buyNowItemCount}</dd>
                  </div>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>৳{buyNowSubTotal.toLocaleString("en-BD")}</dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>
                      {buyNowSubTotal === 0
                        ? "৳0"
                        : buyNowShippingFee === 0
                          ? "Free"
                          : `৳${buyNowShippingFee.toLocaleString("en-BD")}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>৳{buyNowTotal.toLocaleString("en-BD")}</dd>
                  </div>
                </dl>

                {(cartQuery.data?.items.length ?? 0) > 0 ? (
                  <p className="checkout-mode-switch">
                    <Link to="/checkout">
                      Checkout full cart ({cartQuery.data?.summary.itemCount}{" "}
                      items) instead
                    </Link>
                  </p>
                ) : null}
              </>
            ) : (
              <>
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
                      {(cartQuery.data?.summary.total ?? 0).toLocaleString(
                        "en-BD",
                      )}
                    </dd>
                  </div>
                </dl>
              </>
            )}

            <div className="checkout-trust-row">
              <Truck size={16} /> Cash on delivery, pay when it arrives
            </div>
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
          Your past orders and their delivery status.
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
