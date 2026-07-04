import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "../../shared/ui/badge.js";
import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { addCartItem } from "../cart/cart-api.js";
import { addWishlistItem } from "../wishlist/wishlist-api.js";
import {
  getProduct,
  listBrands,
  listCategories,
  listProducts,
  type CatalogProduct,
} from "./catalog-api.js";

export function CatalogPage(): ReactNode {
  const queryClient = useQueryClient();
  const search = useSearch({ from: "/products" }) as Partial<
    Record<string, string>
  >;
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
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => addWishlistItem(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return (
    <main className="page-shell catalog-page">
      <CatalogHeader
        title="Products"
        description="Browse published products with search, category, brand, and price sorting backed by the catalog API."
      />
      <div className="catalog-toolbar">
        <span>
          <Search size={18} /> Search-ready API
        </span>
        <span>
          <SlidersHorizontal size={18} /> Filter and sort contracts
        </span>
      </div>
      <ProductGrid
        products={productsQuery.data?.products ?? []}
        isLoading={productsQuery.isLoading}
        onAddToCart={(productId) => addToCartMutation.mutate(productId)}
        onAddToWishlist={(productId) => addToWishlistMutation.mutate(productId)}
        isMutating={
          addToCartMutation.isPending || addToWishlistMutation.isPending
        }
      />
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

  return (
    <main className="page-shell product-detail-page">
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
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong>৳{product.price.toLocaleString("en-BD")}</strong>
          </div>
        </section>
      ) : null}
      {productQuery.isLoading ? <p>Loading product...</p> : null}
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
        description="Active category browsing surface connected to the public catalog category endpoint."
      />
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
        description="Active brand browsing surface connected to the public catalog brand endpoint."
      />
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
      <span className="eyebrow">Catalog</span>
      <h1>{title}</h1>
      <p>{description}</p>
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
    return <p>Loading products...</p>;
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
                onClick={() => onAddToWishlist(product._id)}
                disabled={isMutating}
              >
                Wishlist
              </Button>
              <Button
                tone="primary"
                onClick={() => onAddToCart(product._id)}
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
