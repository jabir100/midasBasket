import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Skeleton, Toast } from "@heroui/react";

import { Badge } from "../../shared/ui/badge.js";
import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { toAbsoluteUrl } from "../../shared/seo/seo.js";
import { addCartItem } from "../cart/cart-api.js";
import { addWishlistItem } from "../wishlist/wishlist-api.js";
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
    <div className="taxonomy-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="taxonomy-card">
          <CardBody>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Skeleton className="h-4 w-1/4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export function CatalogPage(): ReactNode {
  const queryClient = useQueryClient();
  const search = useSearch({ from: "/products" });
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(search)) {
    if (value) {
      params.set(key, value);
    }
  }

  const productsQuery = useQuery({
    queryKey: ["catalog", "products", params.toString()],
    queryFn: () => listProducts(params),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addCartItem({ productId, quantity: 1 }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      Toast.toast.success("Added to cart");
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => addWishlistItem(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      Toast.toast.success("Added to wishlist");
    },
  });

  return (
    <main className="page-shell catalog-page">
      <CatalogHeader
        title="Products"
        description="Browse our selection of premium quality groceries and everyday essentials."
      />

      {productsQuery.isLoading ? (
        <ProductSkeletonGrid />
      ) : (
        <ProductGrid
          products={productsQuery.data?.products ?? []}
          isLoading={false}
          onAddToCart={(productId) => {
            addToCartMutation.mutate(productId);
          }}
          onAddToWishlist={(productId) => {
            addToWishlistMutation.mutate(productId);
          }}
          isMutating={
            addToCartMutation.isPending || addToWishlistMutation.isPending
          }
        />
      )}

      {productsQuery.error ? (
        <p className="form-error">Unable to load products from the API.</p>
      ) : null}
      {addToWishlistMutation.error ? (
        <p className="form-error">{addToWishlistMutation.error.message}</p>
      ) : null}
    </main>
  );
}

export function ProductDetailPage({
  slug,
}: Readonly<{ slug: string }>): ReactNode {
  const productQuery = useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => getProduct(slug),
  });
  const product = productQuery.data;
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
          <div className="product-media">
            {product.images[0] ? (
              <img src={product.images[0].url} alt={product.images[0].alt} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
          <div className="product-detail-copy">
            <Badge>{product.sku}</Badge>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>৳{product.price.toLocaleString("en-BD")}</strong>
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
        <div className="taxonomy-grid">
          {(categoriesQuery.data ?? []).map((category) => (
            <TaxonomyCard
              key={category._id}
              name={category.name}
              slug={category.slug}
              {...(category.description
                ? { description: category.description }
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
        <div className="taxonomy-grid">
          {(brandsQuery.data ?? []).map((brand) => (
            <TaxonomyCard
              key={brand._id}
              name={brand.name}
              slug={brand.slug}
              {...(brand.description ? { description: brand.description } : {})}
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
  isLoading,
  products,
  onAddToCart,
  onAddToWishlist,
  isMutating,
}: Readonly<{
  isLoading: boolean;
  products: CatalogProduct[];
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  isMutating: boolean;
}>): ReactNode {
  if (isLoading) {
    return <ProductSkeletonGrid />;
  }

  if (products.length === 0) {
    return (
      <p className="form-muted">No published products are available yet.</p>
    );
  }

  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <Card key={product._id} className="catalog-product-card">
          <div className="catalog-product-media">
            {product.images[0] ? (
              <img src={product.images[0].url} alt={product.images[0].alt} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
          <CardBody>
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              <h2>{product.name}</h2>
            </Link>
            <p>{product.shortDescription ?? product.description}</p>
            <strong>৳{product.price.toLocaleString("en-BD")}</strong>
            <div className="catalog-card-actions">
              <Button
                tone="secondary"
                onClick={() => {
                  onAddToWishlist(product._id);
                }}
                disabled={isMutating}
              >
                Wishlist
              </Button>
              <Button
                tone="primary"
                onClick={() => {
                  onAddToCart(product._id);
                }}
                disabled={isMutating}
              >
                Add to cart
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function TaxonomyCard({
  description,
  name,
  slug,
}: Readonly<{ description?: string; name: string; slug: string }>): ReactNode {
  return (
    <Card className="taxonomy-card">
      <CardBody>
        <span>{slug}</span>
        <h2>{name}</h2>
        <p>{description ?? "Catalog grouping ready for product discovery."}</p>
      </CardBody>
    </Card>
  );
}
