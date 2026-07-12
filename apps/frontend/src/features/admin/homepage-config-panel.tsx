import { Eye, EyeOff, Home, Image, Sparkles, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import type { AdminCarouselSlide, AdminProduct, HomepageSettings } from "./admin-api.js";
import { RepeaterFields } from "./admin-form-controls.js";
import { ProductPicker } from "./product-picker.js";

export function HomepageConfigPanel({
  carouselSlides,
  createSlideMutation,
  deleteSlideMutation,
  file,
  homepageForm,
  isCarouselLoading,
  products,
  setFile,
  setHomepageForm,
  setSlideForm,
  slideForm,
  toggleSlideMutation,
  updateHomepageMutation,
}: Readonly<{
  carouselSlides: AdminCarouselSlide[];
  createSlideMutation: { isPending: boolean; error: Error | null; mutate: (data: FormData) => void };
  deleteSlideMutation: { isPending: boolean; mutate: (slideId: string) => void };
  file: File | null;
  homepageForm: HomepageSettings;
  isCarouselLoading: boolean;
  products: AdminProduct[];
  setFile: (file: File | null) => void;
  setHomepageForm: (form: HomepageSettings) => void;
  setSlideForm: (form: {
    imageAlt: string;
    linkHref: string;
    title: string;
    description: string;
    sortOrder: number;
  }) => void;
  slideForm: {
    imageAlt: string;
    linkHref: string;
    title: string;
    description: string;
    sortOrder: number;
  };
  toggleSlideMutation: {
    isPending: boolean;
    mutate: (input: { slideId: string; isActive: boolean }) => void;
  };
  updateHomepageMutation: {
    isPending: boolean;
    error: Error | null;
    mutate: (input: HomepageSettings) => void;
  };
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <div>
          <h3 className="admin-section-title">Homepage configuration</h3>
          <p className="admin-section-copy">
            Manage the storefront carousel, curated product sliders, and the
            why-choose-us section.
          </p>
        </div>
      </div>

      <div className="admin-homepage-grid" style={{ marginTop: "1.5rem" }}>
        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Image size={18} />
              </span>
              <div>
                <h2>Carousel</h2>
                <p className="form-muted">
                  Upload, reorder by sort value, activate, or remove banner
                  slides shown at the top of the storefront.
                </p>
              </div>
            </div>

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
            {isCarouselLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : null}
            {!isCarouselLoading && carouselSlides.length > 0 ? (
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
            {!isCarouselLoading && carouselSlides.length === 0 ? (
              <p className="form-muted">No slides found. Upload one to get started.</p>
            ) : null}
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Sparkles size={18} />
              </span>
              <div>
                <h2>Popular products</h2>
                <p className="form-muted">
                  Pick which products appear in the storefront's "Popular
                  products" slider, and in what order.
                </p>
              </div>
            </div>
            <ProductPicker
              allProducts={products}
              selectedIds={homepageForm.popularProductIds ?? []}
              onChange={(ids) => {
                setHomepageForm({ ...homepageForm, popularProductIds: ids });
              }}
            />
            <Button
              tone="primary"
              style={{ marginTop: "1rem" }}
              disabled={updateHomepageMutation.isPending}
              onClick={() => {
                updateHomepageMutation.mutate(homepageForm);
              }}
            >
              {updateHomepageMutation.isPending ? "Saving..." : "Save homepage config"}
            </Button>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Sparkles size={18} />
              </span>
              <div>
                <h2>Most selling</h2>
                <p className="form-muted">
                  Pick which products appear in the storefront's "Most
                  selling" slider, and in what order.
                </p>
              </div>
            </div>
            <ProductPicker
              allProducts={products}
              selectedIds={homepageForm.bestSellingProductIds ?? []}
              onChange={(ids) => {
                setHomepageForm({ ...homepageForm, bestSellingProductIds: ids });
              }}
            />
            <Button
              tone="primary"
              style={{ marginTop: "1rem" }}
              disabled={updateHomepageMutation.isPending}
              onClick={() => {
                updateHomepageMutation.mutate(homepageForm);
              }}
            >
              {updateHomepageMutation.isPending ? "Saving..." : "Save homepage config"}
            </Button>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Home size={18} />
              </span>
              <div>
                <h2>Why choose us</h2>
                <p className="form-muted">
                  Policy/value cards shown above the footer on the storefront.
                </p>
              </div>
            </div>
            <form
              className="admin-modern-form"
              onSubmit={(event) => {
                event.preventDefault();
                updateHomepageMutation.mutate(homepageForm);
              }}
            >
              <RepeaterFields
                title="Why choose us / policies"
                firstLabel="Title"
                secondLabel="Description"
                items={homepageForm.whyChooseUs ?? []}
                onChange={(whyChooseUs) => {
                  setHomepageForm({ ...homepageForm, whyChooseUs });
                }}
              />
              <Button
                type="submit"
                tone="primary"
                disabled={updateHomepageMutation.isPending}
              >
                {updateHomepageMutation.isPending ? "Saving..." : "Save homepage config"}
              </Button>
              {updateHomepageMutation.error ? (
                <p className="form-error">{updateHomepageMutation.error.message}</p>
              ) : null}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
