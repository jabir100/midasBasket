import { Chip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

import { Button } from "../../shared/ui/button.js";
import { toast } from "../../shared/ui/toaster.js";
import { addCartItem } from "../cart/cart-api.js";
import type { HomepageProduct } from "./homepage.types.js";

const LOW_STOCK_THRESHOLD = 10;

function StockChip({
  stockQuantity,
}: Readonly<{ stockQuantity: number }>): ReactNode {
  if (stockQuantity <= 0) {
    return (
      <Chip
        className="storefront-stock-chip storefront-stock-chip-out"
        size="sm"
      >
        Out of stock
      </Chip>
    );
  }

  if (stockQuantity <= LOW_STOCK_THRESHOLD) {
    return (
      <Chip
        className="storefront-stock-chip storefront-stock-chip-low"
        size="sm"
      >
        Low stock
      </Chip>
    );
  }

  return (
    <Chip
      className="storefront-stock-chip storefront-stock-chip-in"
      size="sm"
    >
      In stock
    </Chip>
  );
}

export function ProductSlider({
  products,
}: Readonly<{ products: HomepageProduct[] }>): ReactNode {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addCartItem({ productId, quantity: 1 }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not add to cart");
    },
  });

  if (products.length === 0) {
    return null;
  }

  function scrollByCard(direction: 1 | -1): void {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    if (maxScrollLeft > 4) {
      if (direction === 1 && track.scrollLeft >= maxScrollLeft - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      if (direction === -1 && track.scrollLeft <= 4) {
        track.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        return;
      }
    }

    const card = track.querySelector<HTMLElement>(".product-card");
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="product-slider">
      <button
        type="button"
        className="product-slider-nav product-slider-nav-prev"
        aria-label="Scroll left"
        onClick={() => {
          scrollByCard(-1);
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="product-slider-track" ref={trackRef}>
        {products.map((product) => {
          const compareAtPrice = product.compareAtPrice ?? 0;
          const hasDiscount = compareAtPrice > product.price;
          const discountPercent = hasDiscount
            ? Math.round(
                ((compareAtPrice - product.price) / compareAtPrice) * 100,
              )
            : 0;
          const badgeLabel =
            product.badge ??
            (discountPercent > 0 ? `-${String(discountPercent)}%` : undefined);
          const isOutOfStock = product.stockQuantity <= 0;

          return (
            <div
              role="button"
              tabIndex={0}
              className="product-card storefront-product-card storefront-clickable-card"
              key={product.id}
              onClick={() => {
                void navigate({
                  to: "/products/$slug",
                  params: { slug: product.slug },
                });
              }}
              onKeyDown={(event) => {
                if (
                  event.target === event.currentTarget &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  void navigate({
                    to: "/products/$slug",
                    params: { slug: product.slug },
                  });
                }
              }}
            >
              <div className="storefront-product-media-wrap">
                <div
                  className="product-media storefront-product-media"
                  aria-hidden="true"
                >
                  {product.image.src ? (
                    <img src={product.image.src} alt={product.image.alt} />
                  ) : (
                    <PackageSearch size={28} />
                  )}
                </div>
                <div className="storefront-product-badges-row">
                  {badgeLabel ? (
                    <Chip className="storefront-product-badge-chip" size="sm">
                      {badgeLabel}
                    </Chip>
                  ) : (
                    <span />
                  )}
                  <StockChip stockQuantity={product.stockQuantity} />
                </div>
              </div>
              <div className="product-content storefront-product-content">
                <h3>{product.name}</h3>
                <div className="product-price-row">
                  <strong>৳{product.price.toLocaleString("en-BD")}</strong>
                  {hasDiscount ? (
                    <del>৳{compareAtPrice.toLocaleString("en-BD")}</del>
                  ) : null}
                </div>
                <div className="catalog-card-actions storefront-card-actions-row">
                  <Button
                    tone="primary"
                    className="storefront-action-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (product.hasVariants) {
                        void navigate({
                          to: "/products/$slug",
                          params: { slug: product.slug },
                        });
                        return;
                      }
                      addToCartMutation.mutate(product.id);
                    }}
                    disabled={isOutOfStock || addToCartMutation.isPending}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    tone="secondary"
                    className="storefront-action-button storefront-buy-now-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void navigate({
                        to: "/checkout",
                        search: {
                          product: product.slug,
                          quantity: 1,
                        },
                      });
                    }}
                    disabled={isOutOfStock}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="product-slider-nav product-slider-nav-next"
        aria-label="Scroll right"
        onClick={() => {
          scrollByCard(1);
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
