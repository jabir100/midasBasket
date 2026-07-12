import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Input, TextArea, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken, logoutCustomer } from "../auth/auth-api.js";
import {
  createAdminBrand,
  createAdminCategory,
  listAdminBrands,
  listAdminCategories,
  updateAdminBrand,
  updateAdminCategory,
} from "./admin-api.js";
import { AdminField, AdminSwitch } from "./admin-form-controls.js";
import { AdminShell } from "./admin-shell.js";
import {
  emptyTaxonomyForm,
  slugify,
  toTaxonomyPayload,
  type TaxonomyForm,
} from "./admin-types.js";

type TaxonomyKind = "category" | "brand";

const KIND_CONFIG: Record<
  TaxonomyKind,
  {
    activePanel: "categories" | "brands";
    backLabel: string;
    imageLabel: string;
    listRoute: string;
  }
> = {
  category: {
    activePanel: "categories",
    backLabel: "Back to categories",
    imageLabel: "Category image",
    listRoute: "/admin",
  },
  brand: {
    activePanel: "brands",
    backLabel: "Back to brands",
    imageLabel: "Brand logo",
    listRoute: "/admin",
  },
};

export function AdminTaxonomyFormPage({
  itemId,
  kind,
}: Readonly<{ itemId?: string; kind: TaxonomyKind }>): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();
  const isEditing = Boolean(itemId);
  const config = KIND_CONFIG[kind];

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

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
    enabled: isAdmin && kind === "category",
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
    enabled: isAdmin && kind === "brand",
  });

  const listQuery = kind === "category" ? categoriesQuery : brandsQuery;
  const editingItem = isEditing
    ? (listQuery.data?.find((item) => item._id === itemId) ?? null)
    : null;

  const [form, setForm] = useState<TaxonomyForm>(emptyTaxonomyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        slug: editingItem.slug,
        description: editingItem.description ?? "",
        isActive: editingItem.isActive ?? true,
        isFeatured: editingItem.isFeatured ?? false,
      });
      setImageAlt(editingItem.image?.alt ?? editingItem.logo?.alt ?? "");
    }
  }, [editingItem]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const createFn = kind === "category" ? createAdminCategory : createAdminBrand;
  const updateFn = kind === "category" ? updateAdminCategory : updateAdminBrand;
  const queryKey = kind === "category" ? ["admin", "categories"] : ["admin", "brands"];

  const createMutation = useMutation({
    mutationFn: () =>
      createFn(
        toTaxonomyPayload(form),
        imageFile || imageAlt ? { file: imageFile, alt: imageAlt } : undefined,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      Toast.toast.success(`${kind === "category" ? "Category" : "Brand"} created`);
      void navigate({ to: config.listRoute });
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || `Could not create ${kind}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateFn(
        itemId ?? "",
        toTaxonomyPayload(form),
        imageFile || imageAlt ? { file: imageFile, alt: imageAlt } : undefined,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      Toast.toast.success(`${kind === "category" ? "Category" : "Brand"} updated`);
      void navigate({ to: config.listRoute });
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || `Could not update ${kind}`);
    },
  });

  if (!token || userQuery.isLoading || userQuery.data?.role !== "admin") {
    return null;
  }

  if (isEditing && listQuery.isLoading) {
    return (
      <AdminShell
        activePanel={config.activePanel}
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
        <div className="dashboard-pane-content">Loading {kind}…</div>
      </AdminShell>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const currentImage: { url: string; alt: string } | null = editingItem
    ? (editingItem.image?.url
        ? { url: editingItem.image.url, alt: editingItem.image.alt }
        : editingItem.logo?.url
          ? { url: editingItem.logo.url, alt: editingItem.logo.alt }
          : null)
    : null;
  const effectivePreviewUrl = imagePreviewUrl ?? currentImage?.url ?? null;

  return (
    <AdminShell
      activePanel={config.activePanel}
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
              {config.backLabel}
            </Button>
            <h3 className="admin-section-title" style={{ marginTop: "0.5rem" }}>
              {isEditing ? `Edit ${kind}: ${form.name}` : `Create ${kind}`}
            </h3>
          </div>
        </div>

        <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Tags size={18} />
              </span>
              <div>
                <h2>{kind === "category" ? "Category details" : "Brand details"}</h2>
                <p className="form-muted">
                  Slug is generated from the name and can be edited before saving.
                </p>
              </div>
            </div>

            <form
              className="admin-modern-form"
              onSubmit={(event) => {
                event.preventDefault();

                if (isEditing) {
                  updateMutation.mutate();
                } else {
                  createMutation.mutate();
                }
              }}
            >
              <div className="admin-form-grid two">
                <AdminField label="Name*">
                  <Input
                    className="admin-heroui-input"
                    required
                    value={form.name}
                    onChange={(event) => {
                      setForm({
                        ...form,
                        name: event.target.value,
                        slug: slugify(event.target.value),
                      });
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

              <AdminField label="Description">
                <TextArea
                  className="admin-heroui-textarea"
                  value={form.description}
                  onChange={(event) => {
                    setForm({ ...form, description: event.target.value });
                  }}
                />
              </AdminField>

              <div className="admin-form-grid two">
                <AdminField label={`${config.imageLabel} file`}>
                  <input
                    className="admin-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setImageFile(event.target.files?.[0] ?? null);
                    }}
                  />
                </AdminField>
                <AdminField label={`${config.imageLabel} alt text`}>
                  <Input
                    className="admin-heroui-input"
                    value={imageAlt}
                    onChange={(event) => {
                      setImageAlt(event.target.value);
                    }}
                    placeholder="Meaningful text for accessibility"
                  />
                </AdminField>
              </div>

              {effectivePreviewUrl ? (
                <div className="admin-upload-preview">
                  <img
                    className="admin-upload-preview-image"
                    src={effectivePreviewUrl}
                    alt={
                      imageAlt ||
                      (currentImage?.alt ?? `${config.imageLabel} preview`)
                    }
                  />
                  <small className="form-muted">
                    {imageFile
                      ? `${config.imageLabel} preview`
                      : `Current ${config.imageLabel.toLowerCase()}`}
                  </small>
                </div>
              ) : null}

              <div className="admin-form-grid two">
                <AdminSwitch
                  className="inline"
                  isSelected={form.isActive}
                  onChange={(isSelected) => {
                    setForm({ ...form, isActive: isSelected });
                  }}
                >
                  Active
                </AdminSwitch>
                <AdminSwitch
                  className="inline"
                  isSelected={form.isFeatured}
                  onChange={(isSelected) => {
                    setForm({ ...form, isFeatured: isSelected });
                  }}
                >
                  Featured on homepage
                </AdminSwitch>
              </div>

              <div className="admin-form-actions">
                <Button type="submit" tone="primary" disabled={isSaving}>
                  {isSaving
                    ? "Saving..."
                    : isEditing
                      ? `Update ${kind}`
                      : `Create ${kind}`}
                </Button>
              </div>
              {(isEditing ? updateMutation.error : createMutation.error) ? (
                <p className="form-error">
                  {(isEditing ? updateMutation.error : createMutation.error)?.message}
                </p>
              ) : null}
            </form>
          </CardBody>
        </Card>
      </div>
    </AdminShell>
  );
}
