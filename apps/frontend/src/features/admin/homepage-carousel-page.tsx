import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Skeleton, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import {
  createCarouselSlide,
  deleteCarouselSlide,
  getAdminCarouselSlides,
  toggleCarouselSlideActive,
} from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";

export function AdminHomepageCarouselPage(): ReactNode {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [slideForm, setSlideForm] = useState({
    linkHref: "",
    title: "",
    description: "",
    imageAlt: "",
    sortOrder: 0,
  });

  const carouselQuery = useQuery({
    queryKey: ["admin", "carousel"],
    queryFn: getAdminCarouselSlides,
  });

  const createSlideMutation = useMutation({
    mutationFn: createCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      setSlideForm({
        linkHref: "",
        title: "",
        description: "",
        imageAlt: "",
        sortOrder: 0,
      });
      setFile(null);
      const fileInput = document.getElementById(
        "slide-file-input",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      Toast.toast.success("Carousel slide uploaded");
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: deleteCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      Toast.toast.success("Carousel slide deleted");
    },
  });

  const toggleSlideMutation = useMutation({
    mutationFn: ({
      slideId,
      isActive,
    }: {
      slideId: string;
      isActive: boolean;
    }) => toggleCarouselSlideActive(slideId, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      Toast.toast.success("Carousel visibility updated");
    },
  });

  const carouselSlides = carouselQuery.data ?? [];

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Carousel"
          description="Upload, reorder by sort value, activate, or remove banner slides shown at the top of the storefront."
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem", maxWidth: "640px" }}>
          <CardBody>
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!file) return;

                const formData = new FormData();
                formData.append("image", file);
                formData.append("linkHref", slideForm.linkHref);
                if (slideForm.title) formData.append("title", slideForm.title);
                if (slideForm.description)
                  formData.append("description", slideForm.description);
                if (slideForm.imageAlt)
                  formData.append("imageAlt", slideForm.imageAlt);
                formData.append("sortOrder", String(slideForm.sortOrder));

                createSlideMutation.mutate(formData);
              }}
            >
              <label>
                <span>Select image* (max 5 MB)</span>
                <input
                  id="slide-file-input"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null;
                    setFile(selectedFile);
                    if (selectedFile && !slideForm.imageAlt) {
                      setSlideForm({
                        ...slideForm,
                        imageAlt: selectedFile.name.split(".")[0] ?? "slide-image",
                      });
                    }
                  }}
                />
              </label>

              <label>
                <span>Image alt text*</span>
                <input
                  type="text"
                  required
                  value={slideForm.imageAlt}
                  onChange={(event) => {
                    setSlideForm({ ...slideForm, imageAlt: event.target.value });
                  }}
                />
              </label>

              <label>
                <span>Destination link* (e.g. /products/slug)</span>
                <input
                  type="text"
                  required
                  placeholder="/products"
                  value={slideForm.linkHref}
                  onChange={(event) => {
                    setSlideForm({ ...slideForm, linkHref: event.target.value });
                  }}
                />
              </label>

              <label>
                <span>Title (optional)</span>
                <input
                  type="text"
                  value={slideForm.title}
                  onChange={(event) => {
                    setSlideForm({ ...slideForm, title: event.target.value });
                  }}
                />
              </label>

              <label>
                <span>Description (optional)</span>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "4.5rem",
                    border: "1px solid var(--color-midas-border)",
                    borderRadius: "0.9rem",
                    padding: "0.5rem 0.9rem",
                    font: "inherit",
                  }}
                  value={slideForm.description}
                  onChange={(event) => {
                    setSlideForm({ ...slideForm, description: event.target.value });
                  }}
                />
              </label>

              <label>
                <span>Sort order</span>
                <input
                  type="number"
                  value={slideForm.sortOrder}
                  onChange={(event) => {
                    setSlideForm({
                      ...slideForm,
                      sortOrder: Number(event.target.value),
                    });
                  }}
                />
              </label>

              <Button
                type="submit"
                tone="primary"
                disabled={createSlideMutation.isPending || !file}
              >
                {createSlideMutation.isPending ? "Uploading…" : "Add slide"}
              </Button>
              {createSlideMutation.error ? (
                <p className="form-error">{createSlideMutation.error.message}</p>
              ) : null}
            </form>

            <h4 style={{ marginTop: "1.5rem" }}>
              Current slides ({carouselSlides.length})
            </h4>
            {carouselQuery.isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : null}
            {!carouselQuery.isLoading && carouselSlides.length > 0 ? (
              <ul className="admin-list" style={{ gap: "1rem" }}>
                {carouselSlides.map((slide) => (
                  <li
                    key={slide.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem",
                      border: "1px solid var(--color-midas-border)",
                      borderRadius: "0.9rem",
                      background: "#ffffff",
                    }}
                  >
                    <img
                      src={slide.image.url}
                      alt={slide.image.alt}
                      style={{
                        width: "70px",
                        height: "45px",
                        objectFit: "cover",
                        borderRadius: "0.4rem",
                        border: "1px solid var(--color-midas-border)",
                      }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {slide.title ?? "Untitled slide"}
                        </strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-midas-gray)" }}>
                          #{slide.sortOrder}
                        </span>
                      </div>
                      <small
                        style={{
                          display: "block",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          color: "var(--color-midas-gray)",
                        }}
                      >
                        {slide.linkHref}
                      </small>
                    </div>
                    <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                      <Button
                        iconOnly
                        tone={slide.isActive ? "secondary" : "ghost"}
                        title={slide.isActive ? "Deactivate" : "Activate"}
                        disabled={toggleSlideMutation.isPending}
                        onClick={() => {
                          toggleSlideMutation.mutate({
                            slideId: slide.id,
                            isActive: !slide.isActive,
                          });
                        }}
                        startContent={
                          slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />
                        }
                      >
                        Toggle visibility
                      </Button>
                      <Button
                        iconOnly
                        tone="ghost"
                        title="Delete slide"
                        disabled={deleteSlideMutation.isPending}
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this slide?")) {
                            deleteSlideMutation.mutate(slide.id);
                          }
                        }}
                        startContent={
                          <Trash2 size={16} style={{ color: "var(--color-midas-red)" }} />
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            {!carouselQuery.isLoading && carouselSlides.length === 0 ? (
              <p className="form-muted">No slides found. Upload one to get started.</p>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </AdminPageShell>
  );
}
