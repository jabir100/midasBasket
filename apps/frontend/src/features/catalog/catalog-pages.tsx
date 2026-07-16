import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Chip, Skeleton, Toast } from "@heroui/react";

import { Badge } from "../../shared/ui/badge.js";
import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { toAbsoluteUrl } from "../../shared/seo/seo.js";
import { addCartItem } from "../cart/cart-api.js";
import {
  getProduct,
  listBrands,
  listCategories,
  listProducts,
  type CatalogProduct,
} from "./catalog-api.js";

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
  const search = useSearch({ from: "/products" });

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
      Toast.toast.success("Added to cart");
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
        description="Browse our selection of premium quality groceries and everyday essentials."
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

export function ProductDetailPage({
  slug,
}: Readonly<{ slug: string }>): ReactNode {
  const queryClient = useQueryClient();
  const productQuery = useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => getProduct(slug),
  });
  const product = productQuery.data;
  const hasVariants = (product?.variants.length ?? 0) > 0;

  const sizes = useMemo(
    () => [...new Set((product?.variants ?? []).map((v) => v.size))],
    [product?.variants],
  );
  const colors = useMemo(
    () => [...new Set((product?.variants ?? []).map((v) => v.color))],
    [product?.variants],
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const selectedVariant = useMemo(
    () =>
      (product?.variants ?? []).find(
        (v) => v.size === selectedSize && v.color === selectedColor,
      ) ?? null,
    [product?.variants, selectedSize, selectedColor],
  );

  const addToCartMutation = useMutation({
    mutationFn: () =>
      addCartItem({
        productId: product?._id ?? "",
        quantity: 1,
        ...(selectedSize ? { size: selectedSize } : {}),
        ...(selectedColor ? { color: selectedColor } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      Toast.toast.success("Added to cart");
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Could not add to cart");
    },
  });

  const isProductInStock = (product?.stockQuantity ?? 0) > 0;
  const canSubmitAddToCart = hasVariants
    ? Boolean(selectedVariant && selectedVariant.stockQuantity > 0)
    : isProductInStock;
  const compareAtPrice = product?.compareAtPrice ?? 0;
  const hasDiscount = Boolean(product && compareAtPrice > product.price);
  const savings = hasDiscount ? compareAtPrice - (product?.price ?? 0) : 0;

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        description: product.shortDescription ?? product.description,
        image: product.images.map((image) => image.url),
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: product.price.toFixed(2),
          availability: "https://schema.org/InStock",
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
        <section className="product-detail">
          <div className="product-detail-breadcrumb">
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>
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
            </div>
            {galleryImages.length > 1 ? (
              <div className="product-media-thumbs">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.url}
                    type="button"
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
          <div className="product-detail-copy">
            <Badge>{product.sku}</Badge>
            <h3>{product.name}</h3>
            <p>{product.shortDescription ?? product.description}</p>
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
            <p className="product-detail-stock">
              {isProductInStock ? "In stock" : "Out of stock"}
            </p>

            <p>{product.description}</p>

            {hasVariants ? (
              <div className="product-variant-picker">
                <div className="product-variant-group">
                  <span>Size</span>
                  <div className="product-variant-options">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`product-variant-option ${selectedSize === size ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedSize(size);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="product-variant-group">
                  <span>Color</span>
                  <div className="product-variant-options">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`product-variant-option ${selectedColor === color ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedColor(color);
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedSize && selectedColor && !selectedVariant ? (
                  <p className="form-error">
                    This combination is not available.
                  </p>
                ) : null}
                {selectedVariant?.stockQuantity === 0 ? (
                  <p className="form-error">Out of stock.</p>
                ) : null}
              </div>
            ) : null}

            <Button
              tone="primary"
              disabled={!canSubmitAddToCart || addToCartMutation.isPending}
              onClick={() => {
                addToCartMutation.mutate();
              }}
            >
              {!isProductInStock
                ? "Out of stock"
                : hasVariants && !selectedVariant
                  ? "Select options"
                  : "Add to cart"}
            </Button>
          </div>
        </section>
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
        description="Explore our wide range of categories for a complete grocery solution."
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
              {...(category.image
                ? { image: category.image }
                : {})}
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
        description="Choose premium groceries from our certified and trusted partner brands."
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
                disabled={isMutating}
              >
                Add to Cart
              </Button>
              <Button
                tone="secondary"
                className="storefront-action-button storefront-buy-now-button"
                onClick={(event) => {
                  event.stopPropagation();
                  void navigate({
                    to: "/products/$slug",
                    params: { slug: product.slug },
                  });
                }}
                disabled={isMutating}
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
        <img className={imageClass} src={image.url} alt={image.alt} loading="lazy" />
      ) : (
        <span className={`${imageClass} taxonomy-tile-placeholder`} aria-hidden="true">
          {name.charAt(0)}
        </span>
      )}
      <span className={overlayClass} aria-hidden="true" />
      <div className={contentClass}>
        <span>{name}</span>
        <strong>{variant === "category" ? "Shop category" : "Featured brand"}</strong>
      </div>
      <span className={ctaClass}>View Products</span>
    </a>
  );
}
