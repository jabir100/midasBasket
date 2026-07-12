import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Modal, Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import type { AdminProduct, AdminTaxonomy } from "./admin-api.js";
import { AdminSearchInput } from "./admin-form-controls.js";

export function ProductsPanel({
  brands,
  categories,
  isDeleting,
  isLoading,
  isTogglingPublish,
  onDelete,
  onSearchChange,
  onTogglePublish,
  products,
  search,
}: Readonly<{
  brands: AdminTaxonomy[];
  categories: AdminTaxonomy[];
  isDeleting: boolean;
  isLoading: boolean;
  isTogglingPublish: boolean;
  onDelete: (product: AdminProduct) => void;
  onSearchChange: (value: string) => void;
  onTogglePublish: (product: AdminProduct) => void;
  products: AdminProduct[];
  search: string;
}>): ReactNode {
  const [viewingProduct, setViewingProduct] = useState<AdminProduct | null>(
    null,
  );

  const categoryName = (categoryId: string) =>
    categories.find((c) => c._id === categoryId)?.name ?? "—";
  const brandName = (brandId: string) =>
    brands.find((b) => b._id === brandId)?.name ?? "—";

  return (
    <div className="dashboard-pane-content">
      <div
        className="section-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 className="admin-section-title">Product management</h3>
          <p className="admin-section-copy">
            Create, publish, edit, or delete items in the storefront catalog.
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button tone="primary" startContent={<Plus size={18} />}>
            Add product
          </Button>
        </Link>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <div className="admin-toolbar">
            <div className="admin-toolbar-search">
              <AdminSearchInput
                icon={<Search size={16} />}
                placeholder="Search by name or SKU"
                value={search}
                onChange={onSearchChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && products.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="Products table"
              >
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {product.images[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              className="admin-taxonomy-thumb"
                            />
                          ) : null}
                          <div>
                            <strong>{product.name}</strong>
                            <small className="admin-table-muted" style={{ display: "block" }}>
                              SKU: {product.sku}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{categoryName(product.categoryId)}</td>
                      <td>{brandName(product.brandId)}</td>
                      <td>৳{product.price.toLocaleString("en-BD")}</td>
                      <td>
                        {product.stockQuantity}
                        {product.variants.length > 0 ? (
                          <small className="admin-table-muted" style={{ display: "block" }}>
                            {product.variants.length} variant
                            {product.variants.length === 1 ? "" : "s"}
                          </small>
                        ) : null}
                      </td>
                      <td>
                        <span
                          className={`admin-pill ${product.isPublished ? "active" : "inactive"}`}
                        >
                          {product.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Button
                            iconOnly
                            tone="ghost"
                            title="View details"
                            onClick={() => {
                              setViewingProduct(product);
                            }}
                            startContent={<Eye size={16} />}
                          >
                            View
                          </Button>
                          <Link
                            to="/admin/products/$productId"
                            params={{ productId: product._id }}
                          >
                            <Button
                              iconOnly
                              tone="ghost"
                              title="Edit"
                              startContent={<Pencil size={16} />}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            iconOnly
                            tone={product.isPublished ? "secondary" : "ghost"}
                            title={product.isPublished ? "Unpublish" : "Publish"}
                            disabled={isTogglingPublish}
                            onClick={() => {
                              onTogglePublish(product);
                            }}
                            startContent={
                              product.isPublished ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )
                            }
                          >
                            Toggle publish
                          </Button>
                          <Button
                            iconOnly
                            tone="ghost"
                            title="Delete"
                            disabled={isDeleting}
                            onClick={() => {
                              if (confirm(`Delete ${product.name}?`)) {
                                onDelete(product);
                              }
                            }}
                            startContent={
                              <Trash2
                                size={16}
                                style={{ color: "var(--color-midas-red)" }}
                              />
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && products.length === 0 ? (
            <div className="admin-empty-state">
              <Package size={28} />
              <p style={{ margin: 0 }}>No products match search criteria.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Modal.Root
        isOpen={Boolean(viewingProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingProduct(null);
          }
        }}
      >
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              {viewingProduct ? (
                <>
                  <Modal.Header>
                    <Modal.Heading>{viewingProduct.name}</Modal.Heading>
                    <Modal.CloseTrigger />
                  </Modal.Header>
                  <Modal.Body>
                    <div className="admin-product-view-grid">
                      {viewingProduct.images.length > 0 ? (
                        <div className="admin-product-view-images">
                          {viewingProduct.images.map((image) => (
                            <img
                              key={image.publicId ?? image.url}
                              src={image.url}
                              alt={image.alt}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="form-muted">No images uploaded.</p>
                      )}

                      <div className="order-details-row">
                        <span>SKU</span>
                        <span>{viewingProduct.sku}</span>
                      </div>
                      <div className="order-details-row">
                        <span>Category</span>
                        <span>{categoryName(viewingProduct.categoryId)}</span>
                      </div>
                      <div className="order-details-row">
                        <span>Brand</span>
                        <span>{brandName(viewingProduct.brandId)}</span>
                      </div>
                      <div className="order-details-row">
                        <span>Price</span>
                        <span>৳{viewingProduct.price.toLocaleString("en-BD")}</span>
                      </div>
                      <div className="order-details-row">
                        <span>Total stock</span>
                        <span>{viewingProduct.stockQuantity}</span>
                      </div>

                      {viewingProduct.shortDescription ? (
                        <p>{viewingProduct.shortDescription}</p>
                      ) : null}
                      <p className="form-muted">{viewingProduct.description}</p>

                      {viewingProduct.variants.length > 0 ? (
                        <>
                          <h4 style={{ marginBottom: "0.5rem" }}>Variants</h4>
                          <div className="admin-table-shell">
                            <table className="admin-table admin-table-compact">
                              <thead>
                                <tr>
                                  <th>Size</th>
                                  <th>Color</th>
                                  <th>Stock</th>
                                  <th>SKU</th>
                                </tr>
                              </thead>
                              <tbody>
                                {viewingProduct.variants.map((variant) => (
                                  <tr key={`${variant.size}-${variant.color}`}>
                                    <td>{variant.size}</td>
                                    <td>{variant.color}</td>
                                    <td>{variant.stockQuantity}</td>
                                    <td>{variant.sku ?? "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Link
                      to="/admin/products/$productId"
                      params={{ productId: viewingProduct._id }}
                    >
                      <Button tone="primary">Edit product</Button>
                    </Link>
                  </Modal.Footer>
                </>
              ) : null}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </div>
  );
}
