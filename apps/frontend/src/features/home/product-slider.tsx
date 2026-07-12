import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

import { Badge } from "../../shared/ui/badge.js";
import type { HomepageProduct } from "./homepage.types.js";

const formatter = new Intl.NumberFormat("en-BD", {
  currency: "BDT",
  maximumFractionDigits: 0,
  style: "currency",
});

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
          <article className="product-card" key={product.id}>
            <div className="product-media" aria-hidden="true">
              {product.image.src ? (
                <img src={product.image.src} alt={product.image.alt} />
              ) : (
                <PackageSearch size={28} />
              )}
            </div>
            <div className="product-content">
              {product.badge ? <Badge>{product.badge}</Badge> : null}
              <h3>
                <a href={`/products/${product.slug}`}>{product.name}</a>
              </h3>
              <span>{product.sku}</span>
              <div className="product-price-row">
                <strong>{formatter.format(product.price)}</strong>
                {product.compareAtPrice ? (
                  <del>{formatter.format(product.compareAtPrice)}</del>
                ) : null}
              </div>
              <small>
                {product.rating.toFixed(1)} rating · {product.reviewCount}{" "}
                reviews
              </small>
            </div>
          </article>
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
