import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Input, Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import {
  clearCart,
  getCart,
  removeCartItem,
  setCartCoupon,
  updateCartItem,
} from "./cart-api.js";

export function CartPage(): ReactNode {
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const cartQuery = useQuery({ queryKey: ["cart"], queryFn: getCart });

  const mutateCart = useMutation({
    mutationFn: ({
      productId,
      quantity,
      size,
      color,
    }: {
      productId: string;
      quantity: number;
      size?: string | null;
      color?: string | null;
    }) =>
      updateCartItem({
        productId,
        quantity,
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: ({
      productId,
      size,
      color,
    }: {
      productId: string;
      size?: string | null;
      color?: string | null;
    }) =>
      removeCartItem(productId, {
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const couponMutation = useMutation({
    mutationFn: setCartCoupon,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCouponCode("");
    },
  });

  const cart = cartQuery.data;

  return (
    <main className="page-shell cart-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>Shopping cart</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Review your items and proceed to checkout.
        </p>
      </section>

      {cartQuery.isLoading ? (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
      ) : null}
      {cartQuery.error ? (
        <p className="form-error">Unable to load cart right now.</p>
      ) : null}

      <section className="cart-layout">
        <Card className="cart-items-card">
          <CardBody>
            {cart && cart.items.length > 0 ? (
              <ul className="cart-item-list">
                {cart.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
                    className="cart-item-row"
                  >
                    <div className="cart-item-thumb">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div
                          className="cart-item-thumb-placeholder"
                          aria-hidden="true"
                        >
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </div>
                    <div className="cart-item-copy">
                      <Link to="/products/$slug" params={{ slug: item.slug }}>
                        <strong>{item.title}</strong>
                      </Link>
                      {item.size && item.color ? (
                        <small className="admin-table-muted">
                          {item.size} / {item.color}
                        </small>
                      ) : null}
                      <small>৳{item.unitPrice.toLocaleString("en-BD")}</small>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-qty-stepper">
                        <Button
                          iconOnly
                          tone="ghost"
                          aria-label={`Decrease quantity for ${item.title}`}
                          onClick={() => {
                            mutateCart.mutate({
                              productId: item.productId,
                              quantity: Math.max(item.quantity - 1, 1),
                              size: item.size,
                              color: item.color,
                            });
                          }}
                          disabled={mutateCart.isPending}
                          startContent={<Minus size={14} />}
                        >
                          Decrease
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          iconOnly
                          tone="ghost"
                          aria-label={`Increase quantity for ${item.title}`}
                          onClick={() => {
                            mutateCart.mutate({
                              productId: item.productId,
                              quantity: Math.min(item.quantity + 1, 99),
                              size: item.size,
                              color: item.color,
                            });
                          }}
                          disabled={mutateCart.isPending}
                          startContent={<Plus size={14} />}
                        >
                          Increase
                        </Button>
                      </div>
                      <strong className="cart-item-line-total">
                        ৳{item.lineTotal.toLocaleString("en-BD")}
                      </strong>
                      <Button
                        iconOnly
                        tone="ghost"
                        aria-label={`Remove ${item.title} from cart`}
                        onClick={() => {
                          deleteItem.mutate({
                            productId: item.productId,
                            size: item.size,
                            color: item.color,
                          });
                        }}
                        disabled={deleteItem.isPending}
                        startContent={<Trash2 size={16} />}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cart-empty-state">
                <ShoppingBag size={26} />
                <p>Your cart is empty. Add products from the catalog.</p>
                <Link to="/products" className="ui-button ui-button-secondary">
                  Browse products
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="cart-summary-card">
          <CardBody>
            <h2>Order summary</h2>
            <dl className="cart-summary-list">
              <div>
                <dt>Items</dt>
                <dd>{cart?.summary.itemCount ?? 0}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>
                  ৳{(cart?.summary.subTotal ?? 0).toLocaleString("en-BD")}
                </dd>
              </div>
              <div>
                <dt>Discount</dt>
                <dd>
                  ৳{(cart?.summary.discountTotal ?? 0).toLocaleString("en-BD")}
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>৳{(cart?.summary.total ?? 0).toLocaleString("en-BD")}</dd>
              </div>
            </dl>

            <form
              className="cart-coupon-form"
              onSubmit={(event) => {
                event.preventDefault();
                couponMutation.mutate(couponCode);
              }}
            >
              <div className="cart-coupon-input-wrapper">
                <Tag size={16} />
                <Input
                  className="admin-heroui-input"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                  }}
                />
              </div>
              <Button
                type="submit"
                tone="secondary"
                disabled={couponMutation.isPending}
              >
                Apply
              </Button>
            </form>
            {couponMutation.error ? (
              <p className="form-error">{couponMutation.error.message}</p>
            ) : null}

            <div className="cart-summary-actions">
              <Link to="/checkout" className="ui-button ui-button-primary">
                Continue to checkout
              </Link>
              <Button
                tone="ghost"
                onClick={() => {
                  clearMutation.mutate();
                }}
                disabled={
                  clearMutation.isPending || (cart?.items.length ?? 0) === 0
                }
              >
                Clear cart
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
