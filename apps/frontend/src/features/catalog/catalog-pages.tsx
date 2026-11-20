import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Chip, Skeleton } from "@heroui/react";

import { Badge } from "../../shared/ui/badge.js";
import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { toAbsoluteUrl } from "../../shared/seo/seo.js";
import { getStoredAccessToken } from "../auth/auth-api.js";
import { addCartItem } from "../cart/cart-api.js";
import { ProductSlider } from "../home/product-slider.js";
import type { HomepageProduct } from "../home/homepage.types.js";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../wishlist/wishlist-api.js";
import {
  getProduct,
  listBrands,
  listCategories,
  listProducts,
  type CatalogProduct,
} from "./catalog-api.js";
import { toast } from "../../shared/ui/toaster.js";

function ProductSkeletonGrid(): ReactNode {
  return (
    <div className="catalog-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="catalog-product-card">
          <div className="catalog-product-media" style={{ padding: 0 }}>
            <Skeleton className="w-full h-full aspect-square" />
          </div>
          <CardBody>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-5 w-1/3 rounded-lg" />
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <Skeleton className="h-10 flex-1 rounded-full" />
                <Skeleton className="h-10 flex-1 rounded-full" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function TaxonomySkeletonGrid(): ReactNode {
  return (
    <div className="category-grid taxonomy-page-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="taxonomy-tile-skeleton rounded-2xl" />
      ))}
    </div>
  );
}

export function CatalogPage(): ReactNode {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: "/products/" });

  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [priceCap, setPriceCap] = useState(100000);

  const selectedCategory = search.category ?? "";
  const selectedSort = search.sort ?? "newest";
  const selectedLimit = search.limit ?? "9";

  const params = useMemo(() => {
    const next = new URLSearchParams();
    if (search.search) {
      next.set("search", search.search);
    }
    if (search.category) {
      next.set("category", search.category);
    }
    if (search.brand) {
      next.set("brand", search.brand);
    }
    if (search.sort) {
      next.set("sort", search.sort);
    }
    next.set("limit", search.limit ?? "9");
    return next;
  }, [search.brand, search.category, search.limit, search.search, search.sort]);

  const productsQuery = useQuery({
    queryKey: ["catalog", "products", params.toString()],
    queryFn: () => listProducts(params),
  });

  const categoriesQuery = useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: listCategories,
  });

  const filteredProducts = useMemo(() => {
    const products = productsQuery.data?.products ?? [];

    return products.filter((product) => {
      const stockPass =
        availability === "all"
          ? true
          : availability === "in"
            ? product.stockQuantity > 0
            : product.stockQuantity === 0;

      return stockPass && product.price <= priceCap;
    });
  }, [availability, priceCap, productsQuery.data?.products]);

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addCartItem({ productId, quantity: 1 }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
  });

  function updateProductSearch(next: {
    category?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    limit?: "9" | "12" | "18";
  }): void {
    void navigate({
      to: "/products",
      search: (prev) => ({
        ...prev,
        ...(next.category !== undefined ? { category: next.category } : {}),
        ...(next.sort !== undefined ? { sort: next.sort } : {}),
        ...(next.limit !== undefined ? { limit: next.limit } : {}),
      }),
    });
  }

  return (
    <main className="page-shell catalog-page">
      <CatalogHeader
        title="Products"
        description="Groceries and everyday essentials."
      />

      <section className="storefront-products-layout">
        <aside className="storefront-filter-panel" aria-label="Product filters">
          <div className="storefront-filter-header">
            <h4>Filters</h4>
            <button
              type="button"
              className="storefront-filter-clear"
              onClick={() => {
                setAvailability("all");
                setPriceCap(100000);
                updateProductSearch({
                  category: "",
                  sort: "newest",
                  limit: "9",
                });
              }}
            >
              Clear All
            </button>
          </div>

          <div className="storefront-filter-group">
            <h5>Availability</h5>
            <label>
              <input
                type="checkbox"
                checked={availability === "in"}
                onChange={(event) => {
                  setAvailability(event.target.checked ? "in" : "all");
                }}
              />
              <span>In Stock</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={availability === "out"}
                onChange={(event) => {
                  setAvailability(event.target.checked ? "out" : "all");
                }}
              />
              <span>Out of Stock</span>
            </label>
          </div>

          <div className="storefront-filter-group">
            <h5>Price Range</h5>
            <input
              type="range"
              min={0}
              max={100000}
              step={500}
              value={priceCap}
              onChange={(event) => {
                setPriceCap(Number(event.target.value));
              }}
            />
            <p>BDT 0 - BDT {priceCap.toLocaleString("en-BD")}</p>
          </div>

          <div className="storefront-filter-group">
            <h5>Categories</h5>
            {categoriesQuery.isLoading ? (
              <p className="form-muted">Loading...</p>
            ) : null}
            {(categoriesQuery.data ?? []).map((category) => (
              <label key={category._id}>
                <input
                  type="checkbox"
                  checked={selectedCategory === category.slug}
                  onChange={(event) => {
                    updateProductSearch({
                      category: event.target.checked ? category.slug : "",
                    });
                  }}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className="storefront-products-main">
          <div className="storefront-products-toolbar">
            <label>
              <span>Sort By</span>
              <select
                value={selectedSort}
                onChange={(event) => {
                  updateProductSearch({
                    sort: event.target.value as
                      "newest" | "price-asc" | "price-desc",
                  });
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
            <label>
              <span>Show</span>
              <select
                value={selectedLimit}
                onChange={(event) => {
                  updateProductSearch({
                    limit: event.target.value as "9" | "12" | "18",
                  });
                }}
              >
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="18">18</option>
              </select>
            </label>
          </div>

          {productsQuery.isLoading ? (
            <ProductSkeletonGrid />
          ) : (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={(productId) => {
                addToCartMutation.mutate(productId);
              }}
              isMutating={addToCartMutation.isPending}
            />
          )}
        </div>
      </section>

      {productsQuery.error ? (
        <p className="form-error">Unable to load products from the API.</p>
      ) : null}
    </main>
  );
}

const LOW_STOCK_THRESHOLD = 10;

function normalizeOption(value: string | undefined | null): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function getPreferredVariant(
  variants: CatalogProduct["variants"] | undefined,
): { size: string | null; color: string | null } {
  if (!variants || variants.length === 0) {
    return { size: null, color: null };
  }
  const preferred = variants.find((v) => v.stockQuantity > 0) ?? variants[0];
  return {
    size: normalizeOption(preferred?.size),
    color: normalizeOption(preferred?.color),
  };
}

export function ProductDetailPage({
  slug,
  initialProduct,
}: Readonly<{
  slug: string;
  initialProduct?: CatalogProduct;
}>): ReactNode {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const productQuery = useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => getProduct(slug),
    ...(initialProduct ? { initialData: initialProduct } : {}),
  });
  const product = productQuery.data;
  const hasVariants = (product?.variants.length ?? 0) > 0;

  const sizes = useMemo(
    () => [
      ...new Set(
        (product?.variants ?? [])
          .map((v) => v.size.trim())
          .filter((s) => s.length > 0),
      ),
    ],
    [product?.variants],
  );
  const colors = useMemo(
    () => [
      ...new Set(
        (product?.variants ?? [])
          .map((v) => v.color.trim())
          .filter((c) => c.length > 0),
      ),
    ],
    [product?.variants],
  );

  const initialVariant = getPreferredVariant(initialProduct?.variants);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    initialVariant.size,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialVariant.color,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hasAuthToken, setHasAuthToken] = useState(false);

  useEffect(() => {
    setHasAuthToken(Boolean(getStoredAccessToken()));
  }, []);

  useEffect(() => {
    setQuantity(1);
    const preferred = getPreferredVariant(product?.variants);
    setSelectedSize(preferred.size);
    setSelectedColor(preferred.color);
  }, [product?._id, product?.variants]);

  const galleryImages = useMemo(() => {
    const images = product?.images ?? [];
    if (!selectedColor) {
      return images;
    }
    const matching = images.filter((image) => image.color === selectedColor);
    return matching.length > 0 ? matching : images;
  }, [product?.images, selectedColor]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [galleryImages]);

  const selectedVariant = useMemo(() => {
    const variants = product?.variants ?? [];
    if (variants.length === 0) {
      return null;
    }
    return (
      variants.find(
        (v) =>
          (v.size.trim() || null) === selectedSize &&
          (v.color.trim() || null) === selectedColor,
      ) ?? null
    );
  }, [product?.variants, selectedSize, selectedColor]);

  const activeStockQuantity = hasVariants
    ? (selectedVariant?.stockQuantity ?? 0)
    : (product?.stockQuantity ?? 0);
  const isInStock = activeStockQuantity > 0;
  const maxOrderQuantity = isInStock
    ? activeStockQuantity > LOW_STOCK_THRESHOLD
      ? 99
      : activeStockQuantity
    : 1;

  useEffect(() => {
    setQuantity((current) =>
      Math.min(Math.max(current, 1), maxOrderQuantity),
    );
  }, [maxOrderQuantity]);

  function handleSelectSize(size: string): void {
    setSelectedSize(size);
    if (colors.length === 0) {
      return;
    }
    const variants = product?.variants ?? [];
    const exactMatch = variants.find(
      (v) =>
        v.size.trim() === size &&
        (v.color.trim() || null) === selectedColor,
    );
    if (exactMatch) {
      return;
    }
    const fallback =
      variants.find((v) => v.size.trim() === size && v.stockQuantity > 0) ??
      variants.find((v) => v.size.trim() === size);
    setSelectedColor(fallback ? fallback.color.trim() || null : null);
  }

  function handleSelectColor(color: string): void {
    setSelectedColor(color);
    if (sizes.length === 0) {
      return;
    }
    const variants = product?.variants ?? [];
    const exactMatch = variants.find(
      (v) =>
        (v.size.trim() || null) === selectedSize &&
        v.color.trim() === color,
    );
    if (exactMatch) {
      return;
    }
    const fallback =
      variants.find((v) => v.color.trim() === color && v.stockQuantity > 0) ??
      variants.find((v) => v.color.trim() === color);
    setSelectedSize(fallback ? fallback.size.trim() || null : null);
  }

  const addToCartMutation = useMutation({
    mutationFn: async () =>
      addCartItem({
        productId: product?._id ?? "",
        quantity,
        ...(selectedSize ? { size: selectedSize } : {}),
        ...(selectedColor ? { color: selectedColor } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not add to cart");
    },
  });

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: hasAuthToken,
  });

  const isWishlisted = Boolean(
    product &&
      wishlistQuery.data?.some((item) => item.productId === product._id),
  );

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (!product) return [];
      return isWishlisted
        ? removeWishlistItem(product._id)
        : addWishlistItem(product._id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      );
    },
    onError: (error: Error) => {
      toast.info(error.message || "Log in to save products to wishlist.");
    },
  });

  const relatedProductsQuery = useQuery({
    queryKey: ["catalog", "related", slug],
    queryFn: () => listProducts(new URLSearchParams({ limit: "12" })),
  });

  const relatedProducts: HomepageProduct[] = useMemo(
    () =>
      (relatedProductsQuery.data?.products ?? [])
        .filter((item) => item.slug !== slug && item._id !== product?._id)
        .slice(0, 10)
        .map((item) => ({
          id: item._id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          ...(item.compareAtPrice
            ? { compareAtPrice: item.compareAtPrice }
            : {}),
          stockQuantity: item.stockQuantity,
          hasVariants: item.variants.length > 0,
          currency: "BDT" as const,
          rating: 0,
          reviewCount: 0,
          image: item.images[0]
            ? {
                src: item.images[0].url,
                alt: item.images[0].alt,
                width: 1200,
                height: 900,
              }
            : {
                src: "/images/homepage/placeholder.webp",
                alt: item.name,
                width: 1200,
                height: 900,
              },
        })),
    [product?._id, relatedProductsQuery.data?.products, slug],
  );

  const isProductInStock = (product?.stockQuantity ?? 0) > 0;
  const canSubmitAddToCart = hasVariants
    ? Boolean(selectedVariant && selectedVariant.stockQuantity > 0)
    : isProductInStock;
  const compareAtPrice = product?.compareAtPrice ?? 0;
  const hasDiscount = Boolean(product && compareAtPrice > product.price);
  const savings = hasDiscount ? compareAtPrice - (product?.price ?? 0) : 0;
  const discountPercent =
    hasDiscount && compareAtPrice > 0
      ? Math.round((savings / compareAtPrice) * 100)
      : 0;
  const shortSummary =
    product?.shortDescription &&
    product.shortDescription.trim().length > 0 &&
    product.shortDescription.trim() !== product.description.trim()
      ? product.shortDescription.trim()
      : null;

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        description: product.shortDescription ?? product.description,
        image: product.images.map((image) =>
          image.url.startsWith("/") ? toAbsoluteUrl(image.url) : image.url,
        ),
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: product.price.toFixed(2),
          availability: isProductInStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: toAbsoluteUrl(`/products/${slug}`),
        },
      }
    : null;

  return (
    <main className="page-shell product-detail-page">
      {productJsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      ) : null}
      {product ? (
        <>
          <section className="product-detail">
            <div className="product-detail-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/products">Products</Link>
              <span>/</span>
              <span>{product.name}</span>
            </div>

            <div className="product-detail-left">
              <div className="product-media-gallery">
                <div className="product-media">
                  {galleryImages[selectedImageIndex] ? (
                    <img
                      src={galleryImages[selectedImageIndex].url}
                      alt={galleryImages[selectedImageIndex].alt}
                    />
                  ) : (
                    <span>{product.name}</span>
                  )}
                  {discountPercent > 0 ? (
                    <span className="product-media-discount-badge">
                      -{discountPercent}%
                    </span>
                  ) : null}
                  {galleryImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className="product-media-nav product-media-nav-prev"
                        aria-label="Previous image"
                        onClick={() => {
                          setSelectedImageIndex(
                            (current) =>
                              (current - 1 + galleryImages.length) %
                              galleryImages.length,
                          );
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="product-media-nav product-media-nav-next"
                        aria-label="Next image"
                        onClick={() => {
                          setSelectedImageIndex(
                            (current) => (current + 1) % galleryImages.length,
                          );
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  ) : null}
                </div>
                {galleryImages.length > 1 ? (
                  <div className="product-media-thumbs">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image.url}
                        type="button"
                        aria-label={`View image ${String(index + 1)}`}
                        className={`product-media-thumb ${
                          index === selectedImageIndex ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedImageIndex(index);
                        }}
                      >
                        <img src={image.url} alt={image.alt} />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <section
                className="product-description-section"
                aria-labelledby="product-description-heading"
              >
                <div className="product-description-header">
                  <h2 id="product-description-heading">Product Description</h2>
                </div>
                <div className="product-description-body">
                  {product.description}
                </div>
                {product.tags.length > 0 ? (
                  <div className="product-description-tags">
                    {product.tags.map((tag) => (
                      <span key={tag} className="product-description-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>

            <div className="product-detail-copy">
              <div className="product-detail-meta-row">
                <Badge>SKU: {product.sku}</Badge>
                <span
                  className={`product-detail-stock ${
                    !isInStock
                      ? "is-out"
                      : activeStockQuantity <= LOW_STOCK_THRESHOLD
                        ? "is-low"
                        : ""
                  }`}
                >
                  {!isInStock
                    ? "Out of stock"
                    : activeStockQuantity <= LOW_STOCK_THRESHOLD
                      ? `Low stock (${String(activeStockQuantity)} left)`
                      : "In stock"}
                </span>
              </div>

              <h1 className="product-detail-title">{product.name}</h1>

              {shortSummary ? (
                <p className="product-detail-summary">{shortSummary}</p>
              ) : null}

              <div className="product-detail-price-box">
                <div className="product-detail-price-row">
                  <strong>৳{product.price.toLocaleString("en-BD")}</strong>
                  {hasDiscount ? (
                    <>
                      <del>৳{compareAtPrice.toLocaleString("en-BD")}</del>
                      <span className="product-discount-pill">
                        Save ৳{savings.toLocaleString("en-BD")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {hasVariants ? (
                <div className="product-variant-picker">
                  {sizes.length > 0 ? (
                    <div className="product-variant-group">
                      <div className="product-variant-label-row">
                        <span>Size</span>
                        {selectedSize ? (
                          <strong>{selectedSize}</strong>
                        ) : null}
                      </div>
                      <div className="product-variant-options">
                        {sizes.map((size) => {
                          const hasSizeStock = product.variants.some(
                            (v) =>
                              v.size.trim() === size && v.stockQuantity > 0,
                          );
                          return (
                            <button
                              key={size}
                              type="button"
                              aria-pressed={selectedSize === size}
                              className={`product-variant-option ${
                                selectedSize === size ? "selected" : ""
                              } ${!hasSizeStock ? "is-out-of-stock" : ""}`}
                              onClick={() => {
                                handleSelectSize(size);
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {colors.length > 0 ? (
                    <div className="product-variant-group">
                      <div className="product-variant-label-row">
                        <span>Color</span>
                        {selectedColor ? (
                          <strong>{selectedColor}</strong>
                        ) : null}
                      </div>
                      <div className="product-variant-options">
                        {colors.map((color) => {
                          const hasColorStock = product.variants.some(
                            (v) =>
                              v.color.trim() === color && v.stockQuantity > 0,
                          );
                          return (
                            <button
                              key={color}
                              type="button"
                              aria-pressed={selectedColor === color}
                              className={`product-variant-option ${
                                selectedColor === color ? "selected" : ""
                              } ${!hasColorStock ? "is-out-of-stock" : ""}`}
                              onClick={() => {
                                handleSelectColor(color);
                              }}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {!selectedVariant && (selectedSize || selectedColor) ? (
                    <p className="form-error">
                      This combination is not available.
                    </p>
                  ) : null}
                  {selectedVariant?.stockQuantity === 0 ? (
                    <p className="form-error">
                      Selected option is currently out of stock.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="product-quantity-row">
                <span>Quantity</span>
                <div className="product-quantity-stepper">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={!canSubmitAddToCart || quantity <= 1}
                    onClick={() => {
                      setQuantity((q) => Math.max(1, q - 1));
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={
                      !canSubmitAddToCart || quantity >= maxOrderQuantity
                    }
                    onClick={() => {
                      setQuantity((q) => Math.min(maxOrderQuantity, q + 1));
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="product-detail-actions">
                <Button
                  tone="primary"
                  className="product-detail-add-btn"
                  disabled={!canSubmitAddToCart || addToCartMutation.isPending}
                  startContent={<ShoppingBag size={18} />}
                  onClick={() => {
                    addToCartMutation.mutate();
                  }}
                >
                  {!isProductInStock ||
                  (hasVariants && selectedVariant?.stockQuantity === 0)
                    ? "Out of stock"
                    : hasVariants && !selectedVariant
                      ? "Select options"
                      : addToCartMutation.isPending
                        ? "Adding..."
                        : "Add to cart"}
                </Button>

                <Button
                  tone="secondary"
                  className="product-detail-buy-btn"
                  disabled={!canSubmitAddToCart}
                  onClick={() => {
                    void navigate({
                      to: "/checkout",
                      search: {
                        product: product.slug,
                        quantity,
                        ...(selectedSize ? { size: selectedSize } : {}),
                        ...(selectedColor ? { color: selectedColor } : {}),
                      },
                    });
                  }}
                >
                  Buy now
                </Button>

                <Button
                  iconOnly
                  tone="secondary"
                  className={`product-detail-wishlist-btn ${
                    isWishlisted ? "is-saved" : ""
                  }`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Save to wishlist"
                  }
                  disabled={wishlistMutation.isPending}
                  startContent={
                    <Heart
                      size={18}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  }
                  onClick={() => {
                    if (!getStoredAccessToken()) {
                      toast.info("Log in to save products to wishlist.");
                      return;
                    }
                    wishlistMutation.mutate();
                  }}
                >
                  {isWishlisted ? "Saved" : "Save"}
                </Button>
              </div>

              <div className="product-trust-list">
                <div>
                  <Truck size={16} aria-hidden="true" />
                  <span>Fast nationwide delivery &amp; order tracking</span>
                </div>
                <div>
                  <BadgeCheck size={16} aria-hidden="true" />
                  <span>Cash on delivery available</span>
                </div>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 ? (
            <section
              className="product-related-section"
              aria-labelledby="related-products-title"
            >
              <div className="section-heading">
                <div>
                  <h3 id="related-products-title">Related products</h3>
                </div>
                <Link to="/products">All products</Link>
              </div>
              <ProductSlider products={relatedProducts} />
            </section>
          ) : null}
        </>
      ) : null}
      {productQuery.isLoading ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          <Skeleton className="h-6 w-1/4 rounded-lg" />
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-8 w-1/4 rounded-lg" />
        </div>
      ) : null}
      {productQuery.error ? (
        <p className="form-error">Product was not found.</p>
      ) : null}
    </main>
  );
}

export function CategoriesPage(): ReactNode {
  const categoriesQuery = useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: listCategories,
  });

  return (
    <main className="page-shell catalog-page">
      <CatalogHeader
        title="Categories"
        description="Browse products by category."
      />
      {categoriesQuery.isLoading ? (
        <TaxonomySkeletonGrid />
      ) : (
        <div className="category-grid taxonomy-page-grid">
          {(categoriesQuery.data ?? []).map((category) => (
            <TaxonomyTile
              key={category._id}
              name={category.name}
              href={`/products?category=${category.slug}`}
              variant="category"
              {...(category.image ? { image: category.image } : {})}
            />
          ))}
        </div>
      )}
      {categoriesQuery.error ? (
        <p className="form-error">Unable to load categories.</p>
      ) : null}
    </main>
  );
}

export function BrandsPage(): ReactNode {
  const brandsQuery = useQuery({
    queryKey: ["catalog", "brands"],
    queryFn: listBrands,
  });

  return (
    <main className="page-shell catalog-page">
      <CatalogHeader
        title="Brands"
        description="Browse products by brand."
      />
      {brandsQuery.isLoading ? (
        <TaxonomySkeletonGrid />
      ) : (
        <div className="brand-grid taxonomy-page-grid">
          {(brandsQuery.data ?? []).map((brand) => (
            <TaxonomyTile
              key={brand._id}
              name={brand.name}
              href={`/products?brand=${brand.slug}`}
              variant="brand"
              {...(brand.logo ? { image: brand.logo } : {})}
            />
          ))}
        </div>
      )}
      {brandsQuery.error ? (
        <p className="form-error">Unable to load brands.</p>
      ) : null}
    </main>
  );
}

function CatalogHeader({
  description,
  title,
}: Readonly<{ description: string; title: string }>): ReactNode {
  return (
    <section className="section-heading catalog-heading">
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
        {description}
      </p>
    </section>
  );
}

function ProductGrid({
  products,
  onAddToCart,
  isMutating,
}: Readonly<{
  products: CatalogProduct[];
  onAddToCart: (productId: string) => void;
  isMutating: boolean;
}>): ReactNode {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <p className="form-muted">No published products are available yet.</p>
    );
  }

  return (
    <div className="catalog-grid storefront-products-grid">
      {products.map((product) => (
        <Card
          key={product._id}
          className="catalog-product-card storefront-grid-product-card storefront-clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => {
            void navigate({
              to: "/products/$slug",
              params: { slug: product.slug },
            });
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void navigate({
                to: "/products/$slug",
                params: { slug: product.slug },
              });
            }
          }}
        >
          <div className="catalog-product-media storefront-grid-product-media">
            <Chip
              className={`storefront-stock-chip ${
                product.stockQuantity <= 0
                  ? "storefront-stock-chip-out"
                  : product.stockQuantity <= 10
                    ? "storefront-stock-chip-low"
                    : "storefront-stock-chip-in"
              }`}
              size="sm"
            >
              {product.stockQuantity <= 0
                ? "Out of stock"
                : product.stockQuantity <= 10
                  ? "Low stock"
                  : "In stock"}
            </Chip>
            {product.images[0] ? (
              <img src={product.images[0].url} alt={product.images[0].alt} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
          <CardBody className="storefront-grid-product-content">
            <p className="storefront-card-eyebrow">
              {product.tags[0]?.toUpperCase() ?? "MIDAS BASKET"}
            </p>
            <h2>{product.name}</h2>
            <div className="product-price-row">
              <strong>৳{product.price.toLocaleString("en-BD")}</strong>
              {product.compareAtPrice ? (
                <del>৳{product.compareAtPrice.toLocaleString("en-BD")}</del>
              ) : null}
            </div>
            <div className="catalog-card-actions storefront-card-actions-row">
              <Button
                tone="primary"
                className="storefront-action-button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (product.variants.length > 0) {
                    void navigate({
                      to: "/products/$slug",
                      params: { slug: product.slug },
                    });
                    return;
                  }
                  onAddToCart(product._id);
                }}
                disabled={isMutating || product.stockQuantity <= 0}
              >
                {product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                tone="secondary"
                className="storefront-action-button storefront-buy-now-button"
                onClick={(event) => {
                  event.stopPropagation();
                  const preferred = getPreferredVariant(product.variants);
                  void navigate({
                    to: "/checkout",
                    search: {
                      product: product.slug,
                      quantity: 1,
                      ...(preferred.size ? { size: preferred.size } : {}),
                      ...(preferred.color ? { color: preferred.color } : {}),
                    },
                  });
                }}
                disabled={product.stockQuantity <= 0}
              >
                Buy Now
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function TaxonomyTile({
  href,
  image,
  name,
  variant,
}: Readonly<{
  href: string;
  image?: { url: string; alt: string };
  name: string;
  variant: "category" | "brand";
}>): ReactNode {
  const cardClass = variant === "category" ? "category-card" : "brand-card";
  const imageClass =
    variant === "category" ? "category-card-image" : "brand-card-image";
  const overlayClass =
    variant === "category" ? "category-card-overlay" : "brand-card-overlay";
  const contentClass =
    variant === "category" ? "category-card-content" : "brand-card-content";
  const ctaClass =
    variant === "category" ? "category-card-cta" : "brand-card-cta";

  return (
    <a className={cardClass} href={href}>
      {image ? (
        <img
          className={imageClass}
          src={image.url}
          alt={image.alt}
          loading="lazy"
        />
      ) : (
        <span
          className={`${imageClass} taxonomy-tile-placeholder`}
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
      )}
      <span className={overlayClass} aria-hidden="true" />
      <div className={contentClass}>
        <span>{name}</span>
        <strong>
          {variant === "category" ? "Shop category" : "Featured brand"}
        </strong>
      </div>
      <span className={ctaClass}>View Products</span>
    </a>
  );
}
