import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, GripVertical, Package, Plus, Trash2, X } from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Input, TextArea, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken, logoutCustomer } from "../auth/auth-api.js";
import {
  createAdminProduct,
  getAdminProduct,
  listAdminBrands,
  listAdminCategories,
  updateAdminProduct,
  type AdminProduct,
  type AdminProductVariant,
} from "./admin-api.js";
import { AdminField, AdminSelect } from "./admin-form-controls.js";
import { AdminShell } from "./admin-shell.js";
import { emptyProductForm, slugify, type ProductForm } from "./admin-types.js";

type ExistingImage = {
  url: string;
  alt: string;
  publicId?: string;
  color?: string;
};

export function AdminProductFormPage({
  productId,
}: Readonly<{ productId?: string }>): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();
  const isEditing = Boolean(productId);

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    } else if (userQuery.data && userQuery.data.role !== "admin") {
      void navigate({ to: "/" });
    }
  }, [token, userQuery.data, navigate]);

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const productQuery = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => getAdminProduct(productId ?? ""),
    enabled: isAdmin && isEditing,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
    enabled: isAdmin,
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
    enabled: isAdmin,
  });

  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageColors, setNewImageColors] = useState<(string | null)[]>([]);

  const variantColors = [...new Set(form.variants.map((v) => v.color).filter(Boolean))];
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (productQuery.data) {
      const product = productQuery.data;
      setForm({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? 0,
        stockQuantity: product.stockQuantity,
        description: product.description,
        shortDescription: product.shortDescription ?? "",
        categoryId: product.categoryId,
        brandId: product.brandId,
        isPublished: product.isPublished,
        variants: product.variants,
      });
      setExistingImages(product.images);
    }
  }, [productQuery.data]);

  useEffect(() => {
    const urls = newImageFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);

    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [newImageFiles]);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createAdminProduct(toPayload(form), {
        files: newImageFiles,
        newImageColors,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      Toast.toast.success("Product created");
      void navigate({ to: "/admin" });
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Could not create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAdminProduct(productId ?? "", toPayload(form), {
        files: newImageFiles,
        removeImagePublicIds: removedPublicIds,
        imageOrder: existingImages
          .map((image) => image.publicId)
          .filter((publicId): publicId is string => Boolean(publicId)),
        imageColors: Object.fromEntries(
          existingImages
            .map((image) => [image.publicId, image.color ?? ""] as const)
            .filter(
              (entry): entry is [string, string] => entry[0] !== undefined,
            ),
        ),
        newImageColors,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin", "product", productId],
      });
      Toast.toast.success("Product updated");
      void navigate({ to: "/admin" });
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Could not update product");
    },
  });

  if (!token || userQuery.isLoading || userQuery.data?.role !== "admin") {
    return null;
  }

  if (isEditing && productQuery.isLoading) {
    return (
      <AdminShell
        activePanel="products"
        adminName={userQuery.data.name}
        isLoggingOut={logoutMutation.isPending}
        navCounts={{}}
        onLogout={() => {
          logoutMutation.mutate();
        }}
        onSelectPanel={() => {
          void navigate({ to: "/admin" });
        }}
      >
        <div className="dashboard-pane-content">Loading product…</div>
      </AdminShell>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function toPayload(source: ProductForm): Partial<AdminProduct> {
    return {
      name: source.name,
      slug: source.slug,
      sku: source.sku,
      price: source.price,
      ...(source.compareAtPrice ? { compareAtPrice: source.compareAtPrice } : {}),
      stockQuantity: source.stockQuantity,
      description: source.description,
      ...(source.shortDescription
        ? { shortDescription: source.shortDescription }
        : {}),
      categoryId: source.categoryId,
      brandId: source.brandId,
      isPublished: source.isPublished,
      variants: source.variants,
    };
  }

  function addVariantRow(): void {
    setForm({
      ...form,
      variants: [...form.variants, { size: "", color: "", stockQuantity: 0 }],
    });
  }

  function updateVariantRow(
    index: number,
    patch: Partial<AdminProductVariant>,
  ): void {
    const nextVariants = [...form.variants];
    const current = nextVariants[index];
    if (!current) return;
    nextVariants[index] = { ...current, ...patch };
    setForm({ ...form, variants: nextVariants });
  }

  function removeVariantRow(index: number): void {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  }

  function removeExistingImage(publicId: string | undefined): void {
    if (!publicId) return;
    setExistingImages(existingImages.filter((img) => img.publicId !== publicId));
    setRemovedPublicIds([...removedPublicIds, publicId]);
  }

  function removeNewImage(index: number): void {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImageColors(newImageColors.filter((_, i) => i !== index));
  }

  function reorderExistingImages(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const next = [...existingImages];
    const [moved] = next.splice(fromIndex, 1);
    if (!moved) return;
    next.splice(toIndex, 0, moved);
    setExistingImages(next);
  }

  function setExistingImageColor(publicId: string | undefined, color: string): void {
    if (!publicId) return;
    setExistingImages(
      existingImages.map((image): ExistingImage => {
        if (image.publicId !== publicId) return image;
        const base: ExistingImage = {
          url: image.url,
          alt: image.alt,
          ...(image.publicId ? { publicId: image.publicId } : {}),
        };
        return color ? { ...base, color } : base;
      }),
    );
  }

  function setNewImageColor(index: number, color: string): void {
    const next = [...newImageColors];
    next[index] = color || null;
    setNewImageColors(next);
  }

  return (
    <AdminShell
      activePanel="products"
      adminName={userQuery.data.name}
      isLoggingOut={logoutMutation.isPending}
      navCounts={{}}
      onLogout={() => {
        logoutMutation.mutate();
      }}
      onSelectPanel={() => {
        void navigate({ to: "/admin" });
      }}
    >
      <div className="dashboard-pane-content order-details-page">
        <div className="section-heading">
          <div>
            <Button
              tone="ghost"
              onClick={() => {
                void navigate({ to: "/admin" });
              }}
              startContent={<ChevronLeft size={14} />}
            >
              Back to products
            </Button>
            <h3 className="admin-section-title" style={{ marginTop: "0.5rem" }}>
              {isEditing ? `Edit product: ${form.name}` : "Create product"}
            </h3>
          </div>
        </div>

        <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Package size={18} />
              </span>
              <div>
                <h2>Catalog details</h2>
                <p className="form-muted">
                  Storefront-ready copy, taxonomy, images, and per-size/color
                  stock.
                </p>
              </div>
            </div>

            <form
              className="admin-modern-form"
              onSubmit={(event) => {
                event.preventDefault();

                if (!form.categoryId || !form.brandId) {
                  Toast.toast.warning("Select category and brand");
                  return;
                }

                if (isEditing) {
                  updateMutation.mutate();
                } else {
                  createMutation.mutate();
                }
              }}
            >
              <div className="admin-form-grid two">
                <AdminField label="Product name*">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm({ ...form, name, slug: slugify(name) });
                    }}
                  />
                </AdminField>
                <AdminField label="Slug*">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={form.slug}
                    onChange={(event) => {
                      setForm({ ...form, slug: event.target.value });
                    }}
                  />
                </AdminField>
              </div>

              <div className="admin-form-grid three">
                <AdminField label="SKU*">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={form.sku}
                    onChange={(event) => {
                      setForm({ ...form, sku: event.target.value.toUpperCase() });
                    }}
                  />
                </AdminField>
                <AdminField label="Price (BDT)*">
                  <Input
                    className="admin-heroui-input"
                    type="number"
                    required
                    value={String(form.price)}
                    onChange={(event) => {
                      setForm({ ...form, price: Number(event.target.value) });
                    }}
                  />
                </AdminField>
                <AdminField label="Fallback stock (no variants)">
                  <Input
                    className="admin-heroui-input"
                    type="number"
                    disabled={form.variants.length > 0}
                    value={String(form.stockQuantity)}
                    onChange={(event) => {
                      setForm({
                        ...form,
                        stockQuantity: Number(event.target.value),
                      });
                    }}
                  />
                </AdminField>
              </div>

              <div className="admin-form-grid two">
                <AdminSelect
                  label="Category*"
                  placeholder="Select category"
                  value={form.categoryId}
                  options={(categoriesQuery.data ?? []).map((category) => ({
                    id: category._id,
                    label: category.name,
                  }))}
                  onChange={(categoryId) => {
                    setForm({ ...form, categoryId });
                  }}
                />
                <AdminSelect
                  label="Brand*"
                  placeholder="Select brand"
                  value={form.brandId}
                  options={(brandsQuery.data ?? []).map((brand) => ({
                    id: brand._id,
                    label: brand.name,
                  }))}
                  onChange={(brandId) => {
                    setForm({ ...form, brandId });
                  }}
                />
              </div>

              <AdminField label="Short description">
                <Input
                  className="admin-heroui-input"
                  value={form.shortDescription}
                  onChange={(event) => {
                    setForm({ ...form, shortDescription: event.target.value });
                  }}
                />
              </AdminField>

              <AdminField label="Full description*">
                <TextArea
                  className="admin-heroui-textarea"
                  required
                  value={form.description}
                  onChange={(event) => {
                    setForm({ ...form, description: event.target.value });
                  }}
                />
              </AdminField>

              <fieldset className="admin-repeater">
                <div className="admin-repeater-head">
                  <legend>Size / color variants</legend>
                  <Button
                    tone="ghost"
                    type="button"
                    onClick={addVariantRow}
                    startContent={<Plus size={16} />}
                  >
                    Add variant
                  </Button>
                </div>
                <p className="form-muted" style={{ marginTop: 0 }}>
                  Leave empty to use the fallback stock field above for
                  products with no size/color options.
                </p>
                {form.variants.map((variant, index) => (
                  <div
                    className="admin-repeater-row admin-variant-row"
                    key={`variant-${index.toString()}`}
                  >
                    <Input
                      aria-label="Variant size"
                      className="admin-heroui-input"
                      placeholder="Size (e.g. M, 42)"
                      value={variant.size}
                      onChange={(event) => {
                        updateVariantRow(index, { size: event.target.value });
                      }}
                    />
                    <Input
                      aria-label="Variant color"
                      className="admin-heroui-input"
                      placeholder="Color"
                      value={variant.color}
                      onChange={(event) => {
                        updateVariantRow(index, { color: event.target.value });
                      }}
                    />
                    <Input
                      aria-label="Variant stock"
                      className="admin-heroui-input"
                      type="number"
                      placeholder="Stock"
                      value={String(variant.stockQuantity)}
                      onChange={(event) => {
                        updateVariantRow(index, {
                          stockQuantity: Number(event.target.value),
                        });
                      }}
                    />
                    <Input
                      aria-label="Variant SKU"
                      className="admin-heroui-input"
                      placeholder="SKU (optional)"
                      value={variant.sku ?? ""}
                      onChange={(event) => {
                        updateVariantRow(index, { sku: event.target.value });
                      }}
                    />
                    <Button
                      iconOnly
                      tone="ghost"
                      title="Remove variant"
                      onClick={() => {
                        removeVariantRow(index);
                      }}
                      startContent={<Trash2 size={16} />}
                    >
                      Remove variant
                    </Button>
                  </div>
                ))}
              </fieldset>

              <AdminField label="Product images">
                <input
                  className="admin-file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setNewImageFiles([...newImageFiles, ...files]);
                    setNewImageColors([
                      ...newImageColors,
                      ...files.map(() => null),
                    ]);
                    event.target.value = "";
                  }}
                />
              </AdminField>

              {existingImages.length > 0 ? (
                <p className="form-muted" style={{ marginTop: 0 }}>
                  Drag images to reorder. The first image is the storefront
                  cover photo.
                  {variantColors.length > 0
                    ? " Tag an image with a color so shoppers see the matching photo when they pick that color."
                    : ""}
                </p>
              ) : null}

              {existingImages.length > 0 || newImagePreviews.length > 0 ? (
                <div className="admin-image-preview-grid">
                  {existingImages.map((image, index) => (
                    <div
                      className={`admin-image-preview-item admin-image-preview-draggable${
                        draggedImageIndex === index ? " is-dragging" : ""
                      }`}
                      key={image.publicId ?? image.url}
                      draggable
                      onDragStart={() => {
                        setDraggedImageIndex(index);
                      }}
                      onDragEnd={() => {
                        setDraggedImageIndex(null);
                      }}
                      onDragOver={(event: DragEvent<HTMLDivElement>) => {
                        event.preventDefault();
                      }}
                      onDrop={(event: DragEvent<HTMLDivElement>) => {
                        event.preventDefault();
                        if (draggedImageIndex === null) return;
                        reorderExistingImages(draggedImageIndex, index);
                        setDraggedImageIndex(null);
                      }}
                    >
                      <span
                        className="admin-image-preview-drag-handle"
                        title="Drag to reorder"
                      >
                        <GripVertical size={14} />
                      </span>
                      <img src={image.url} alt={image.alt} />
                      <button
                        type="button"
                        className="admin-image-preview-remove"
                        title="Remove image"
                        onClick={() => {
                          removeExistingImage(image.publicId);
                        }}
                      >
                        <X size={14} />
                      </button>
                      {variantColors.length > 0 ? (
                        <select
                          className="admin-image-color-select"
                          aria-label="Image color"
                          value={image.color ?? ""}
                          onChange={(event) => {
                            setExistingImageColor(
                              image.publicId,
                              event.target.value,
                            );
                          }}
                        >
                          <option value="">All colors</option>
                          {variantColors.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))}
                  {newImagePreviews.map((url, index) => (
                    <div className="admin-image-preview-item" key={url}>
                      <img src={url} alt="New upload preview" />
                      <button
                        type="button"
                        className="admin-image-preview-remove"
                        title="Remove image"
                        onClick={() => {
                          removeNewImage(index);
                        }}
                      >
                        <X size={14} />
                      </button>
                      {variantColors.length > 0 ? (
                        <select
                          className="admin-image-color-select"
                          aria-label="Image color"
                          value={newImageColors[index] ?? ""}
                          onChange={(event) => {
                            setNewImageColor(index, event.target.value);
                          }}
                        >
                          <option value="">All colors</option>
                          {variantColors.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <label className="admin-checkbox-control">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => {
                    setForm({ ...form, isPublished: event.target.checked });
                  }}
                />
                <span>Publish immediately</span>
              </label>

              <div className="admin-form-actions">
                <Button type="submit" tone="primary" disabled={isSaving}>
                  {isSaving
                    ? "Saving..."
                    : isEditing
                      ? "Update product"
                      : "Create product"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </AdminShell>
  );
}
