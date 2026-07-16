import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Search, Tags, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Modal, Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import type { AdminTaxonomy } from "./admin-api.js";
import { AdminSearchInput } from "./admin-form-controls.js";

export function TaxonomyPanel({
  description,
  imageLabel,
  isLoading,
  items,
  kind,
  newRoute,
  onDelete,
  onSearchChange,
  search,
  title,
}: Readonly<{
  description: string;
  imageLabel: string;
  isLoading: boolean;
  items: AdminTaxonomy[];
  kind: "category" | "brand";
  newRoute: string;
  onDelete: (item: AdminTaxonomy) => void;
  onSearchChange: (value: string) => void;
  search: string;
  title: string;
}>): ReactNode {
  const [viewingItem, setViewingItem] = useState<AdminTaxonomy | null>(null);

  const imageColumnLabel = imageLabel.toLowerCase().includes("logo")
    ? "Logo"
    : "Image";

  function resolveItemImage(
    item: AdminTaxonomy,
  ): { url: string; alt: string } | null {
    if (item.image?.url) {
      return { url: item.image.url, alt: item.image.alt };
    }

    if (item.logo?.url) {
      return { url: item.logo.url, alt: item.logo.alt };
    }

    return null;
  }

  function EditLink({
    children,
    itemId,
  }: Readonly<{ children: ReactNode; itemId: string }>): ReactNode {
    return kind === "category" ? (
      <Link to="/admin/categories/$categoryId" params={{ categoryId: itemId }}>
        {children}
      </Link>
    ) : (
      <Link to="/admin/brands/$brandId" params={{ brandId: itemId }}>
        {children}
      </Link>
    );
  }

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
          <h3 className="admin-section-title">{title}</h3>
          <p className="admin-section-copy">{description}</p>
        </div>
        <Link to={newRoute}>
          <Button tone="primary" startContent={<Plus size={16} />}>
            {`Add ${title.split(" ")[0] ?? title}`}
          </Button>
        </Link>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <div className="admin-toolbar">
            <div className="admin-toolbar-search">
              <AdminSearchInput
                icon={<Search size={16} />}
                placeholder="Search by name or slug"
                value={search}
                onChange={onSearchChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && items.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label={`${title} table`}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>{imageColumnLabel}</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const entryImage = resolveItemImage(item);

                    return (
                      <tr key={item._id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.slug}</td>
                        <td>
                          {entryImage ? (
                            <img
                              className="admin-taxonomy-thumb"
                              src={entryImage.url}
                              alt={entryImage.alt}
                            />
                          ) : (
                            <span className="admin-table-muted">No image</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`admin-pill ${(item.isActive ?? true) ? "active" : "inactive"}`}
                          >
                            {(item.isActive ?? true) ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-pill ${item.isFeatured ? "featured" : "plain"}`}
                          >
                            {item.isFeatured ? "Featured" : "Standard"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <Button
                              iconOnly
                              tone="ghost"
                              title="View details"
                              onClick={() => {
                                setViewingItem(item);
                              }}
                              startContent={<Eye size={16} />}
                            >
                              View
                            </Button>
                            <EditLink itemId={item._id}>
                              <Button
                                iconOnly
                                tone="ghost"
                                title="Edit"
                                startContent={<Pencil size={16} />}
                              >
                                Edit
                              </Button>
                            </EditLink>
                            <Button
                              iconOnly
                              tone="ghost"
                              title="Delete"
                              onClick={() => {
                                if (confirm(`Delete ${item.name}?`)) {
                                  onDelete(item);
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="admin-empty-state">
              <Tags size={28} />
              <p style={{ margin: 0 }}>No entries match search criteria.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Modal.Root
        isOpen={Boolean(viewingItem)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingItem(null);
          }
        }}
      >
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              {viewingItem ? (
                <>
                  <Modal.Header>
                    <Modal.Heading>{viewingItem.name}</Modal.Heading>
                    <Modal.CloseTrigger />
                  </Modal.Header>
                  <Modal.Body>
                    <div className="admin-product-view-grid">
                      {(() => {
                        const entryImage = resolveItemImage(viewingItem);
                        return entryImage ? (
                          <div className="admin-product-view-images">
                            <img src={entryImage.url} alt={entryImage.alt} />
                          </div>
                        ) : (
                          <p className="form-muted">
                            No {imageLabel.toLowerCase()} uploaded.
                          </p>
                        );
                      })()}

                      <div className="order-details-row">
                        <span>Slug</span>
                        <span>{viewingItem.slug}</span>
                      </div>
                      <div className="order-details-row">
                        <span>Status</span>
                        <span>
                          {(viewingItem.isActive ?? true) ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div className="order-details-row">
                        <span>Featured</span>
                        <span>
                          {viewingItem.isFeatured ? "Featured" : "Standard"}
                        </span>
                      </div>

                      {viewingItem.description ? (
                        <p className="form-muted">{viewingItem.description}</p>
                      ) : null}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <EditLink itemId={viewingItem._id}>
                      <Button tone="primary">{`Edit ${kind}`}</Button>
                    </EditLink>
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
