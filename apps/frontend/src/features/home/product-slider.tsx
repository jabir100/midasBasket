import { Chip } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

import type { HomepageProduct } from "./homepage.types.js";

const formatter = new Intl.NumberFormat("en-BD", {
  currency: "BDT",
  maximumFractionDigits: 0,
  style: "currency",
});

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

  if (products.length === 0) {
    return null;
  }

  function scrollByCard(direction: 1 | -1): void {
    const track = trackRef.current;
    if (!track) return;

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
        {products.map((product) => (
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="product-card storefront-product-card storefront-clickable-card"
            key={product.id}
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
                {product.badge ? (
                  <Chip className="storefront-product-badge-chip" size="sm">
                    {product.badge}
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
                <strong>{formatter.format(product.price)}</strong>
                {product.compareAtPrice ? (
                  <del>{formatter.format(product.compareAtPrice)}</del>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
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
