import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Eye,
  ImagePlus,
  Images,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Input, Modal, Skeleton, TextArea } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { confirmDialog } from "../../shared/ui/confirm-dialog.js";
import {
  createCarouselSlide,
  deleteCarouselSlide,
  getAdminCarouselSlides,
  toggleCarouselSlideActive,
} from "./admin-api.js";
import type { AdminCarouselSlide } from "./admin-api.js";
import { AdminField, AdminSwitch } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";
import { toast } from "../../shared/ui/toaster.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DESCRIPTION_MAX_LENGTH = 300;
const SLIDE_FORM_ID = "carousel-slide-form";

type SlideForm = {
  imageAlt: string;
  linkHref: string;
  title: string;
  description: string;
  sortOrder: number;
};

const emptySlideForm: SlideForm = {
  imageAlt: "",
  linkHref: "",
  title: "",
  description: "",
  sortOrder: 0,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024).toString()} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function slideTitle(slide: AdminCarouselSlide): string {
  return slide.title?.trim() ? slide.title : "Untitled slide";
}

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image is ${formatFileSize(file.size)}. The maximum is 5 MB.`;
  }
  return null;
}

export function AdminHomepageCarouselPage(): ReactNode {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingSlide, setViewingSlide] = useState<AdminCarouselSlide | null>(
    null,
  );

  const carouselQuery = useQuery({
    queryKey: ["admin", "carousel"],
    queryFn: getAdminCarouselSlides,
  });

  const deleteSlideMutation = useMutation({
    mutationFn: deleteCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      toast.success("Carousel slide deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not delete slide");
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
    onSuccess: async (_slide, { isActive }) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      toast.success(isActive ? "Slide is now visible" : "Slide hidden");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update visibility");
    },
  });

  const carouselSlides = carouselQuery.data ?? [];
  const activeCount = carouselSlides.filter((slide) => slide.isActive).length;
  const nextSortOrder =
    carouselSlides.reduce(
      (highest, slide) => Math.max(highest, slide.sortOrder),
      -1,
    ) + 1;

  const requestDelete = (slide: AdminCarouselSlide) => {
    void confirmDialog({
      title: "Delete this slide?",
      description: `"${slideTitle(slide)}" will be removed from the storefront carousel and its image deleted. This can't be undone.`,
      confirmLabel: "Delete slide",
    }).then((confirmed) => {
      if (confirmed) {
        setViewingSlide(null);
        deleteSlideMutation.mutate(slide.id);
      }
    });
  };

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Carousel"
          description="Banner slides shown at the top of the storefront. Lower sort order appears first."
          action={
            <Button
              tone="primary"
              startContent={<Plus size={16} />}
              onClick={() => {
                setIsAddOpen(true);
              }}
            >
              Add slide
            </Button>
          }
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <CardBody>
            {!carouselQuery.isLoading && carouselSlides.length > 0 ? (
              <p className="admin-carousel-summary">
                {carouselSlides.length} slide
                {carouselSlides.length === 1 ? "" : "s"} · {activeCount} visible
                on storefront
              </p>
            ) : null}

            {carouselQuery.isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : null}

            {carouselQuery.isError ? (
              <p className="form-error">
                {carouselQuery.error.message}
              </p>
            ) : null}

            {!carouselQuery.isLoading && carouselSlides.length > 0 ? (
              <div className="admin-table-shell">
                <table
                  className="admin-table admin-table-compact"
                  aria-label="Carousel slides"
                >
                  <thead>
                    <tr>
                      <th>Slide</th>
                      <th>Link</th>
                      <th>Order</th>
                      <th>Visibility</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carouselSlides.map((slide) => {
                      const isToggling =
                        toggleSlideMutation.isPending &&
                        toggleSlideMutation.variables.slideId === slide.id;

                      return (
                        <tr
                          key={slide.id}
                          className={slide.isActive ? undefined : "is-muted"}
                        >
                          <td>
                            <div className="admin-carousel-slide-cell">
                              <button
                                type="button"
                                className="admin-carousel-thumb"
                                title="Preview slide"
                                onClick={() => {
                                  setViewingSlide(slide);
                                }}
                              >
                                <img src={slide.image.url} alt={slide.image.alt} />
                              </button>
                              <div className="admin-carousel-slide-text">
                                <strong>{slideTitle(slide)}</strong>
                                <span className="admin-table-muted">
                                  {slide.description?.trim() ? slide.description : slide.image.alt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <code className="admin-carousel-link">
                              {slide.linkHref}
                            </code>
                          </td>
                          <td>
                            <span className="admin-pill plain">
                              #{slide.sortOrder}
                            </span>
                          </td>
                          <td>
                            <AdminSwitch
                              isSelected={slide.isActive}
                              isDisabled={isToggling}
                              onChange={(isActive) => {
                                toggleSlideMutation.mutate({
                                  slideId: slide.id,
                                  isActive,
                                });
                              }}
                            >
                              {slide.isActive ? "Visible" : "Hidden"}
                            </AdminSwitch>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <Button
                                iconOnly
                                tone="ghost"
                                title="Preview slide"
                                onClick={() => {
                                  setViewingSlide(slide);
                                }}
                                startContent={<Eye size={16} />}
                              >
                                Preview
                              </Button>
                              <Button
                                iconOnly
                                tone="ghost"
                                title="Delete slide"
                                disabled={deleteSlideMutation.isPending}
                                onClick={() => {
                                  requestDelete(slide);
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

            {!carouselQuery.isLoading &&
            !carouselQuery.isError &&
            carouselSlides.length === 0 ? (
              <div className="admin-empty-state">
                <Images size={28} />
                <p style={{ margin: 0 }}>
                  No slides yet. Add one to show a banner on the storefront.
                </p>
                <Button
                  tone="primary"
                  startContent={<Plus size={16} />}
                  onClick={() => {
                    setIsAddOpen(true);
                  }}
                >
                  Add first slide
                </Button>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>

      <AddSlideModal
        isOpen={isAddOpen}
        defaultSortOrder={nextSortOrder}
        onClose={() => {
          setIsAddOpen(false);
        }}
      />

      <SlidePreviewModal
        slide={viewingSlide}
        onClose={() => {
          setViewingSlide(null);
        }}
        onDelete={requestDelete}
      />
    </AdminPageShell>
  );
}

function AddSlideModal({
  defaultSortOrder,
  isOpen,
  onClose,
}: Readonly<{
  defaultSortOrder: number;
  isOpen: boolean;
  onClose: () => void;
}>): ReactNode {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SlideForm>(emptySlideForm);
  const [file, setFile] = useState<File | null>(null);

  // Start from a clean form every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setForm({ ...emptySlideForm, sortOrder: defaultSortOrder });
      setFile(null);
    }
  }, [isOpen]);

  const createSlideMutation = useMutation({
    mutationFn: createCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      toast.success("Carousel slide added");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not add slide");
    },
  });

  const isSaving = createSlideMutation.isPending;

  return (
    <Modal.Root
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog className="admin-carousel-modal">
            <Modal.Header className="admin-carousel-modal-head">
              <span className="dashboard-metric-icon">
                <ImagePlus size={18} />
              </span>
              <div>
                <Modal.Heading>Add carousel slide</Modal.Heading>
                <p className="form-muted">
                  Wide images (16:9, at least 1920×1080) look best.
                </p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              <form
                id={SLIDE_FORM_ID}
                className="admin-modern-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!file) {
                    toast.error("Choose an image for the slide");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("image", file);
                  formData.append("imageAlt", form.imageAlt.trim());
                  formData.append("linkHref", form.linkHref.trim());
                  if (form.title.trim())
                    formData.append("title", form.title.trim());
                  if (form.description.trim())
                    formData.append("description", form.description.trim());
                  formData.append("sortOrder", String(form.sortOrder));

                  createSlideMutation.mutate(formData);
                }}
              >
                <ImageDropzone
                  file={file}
                  onChange={(nextFile) => {
                    setFile(nextFile);
                    if (nextFile && !form.imageAlt) {
                      setForm((current) => ({
                        ...current,
                        imageAlt: nextFile.name
                          .replace(/\.[^.]+$/, "")
                          .replace(/[-_]+/g, " "),
                      }));
                    }
                  }}
                />

                <div className="admin-form-grid two">
                  <AdminField label="Title">
                    <Input
                      className="admin-heroui-input"
                      maxLength={140}
                      placeholder="e.g. Winter sale — up to 40% off"
                      value={form.title}
                      onChange={(event) => {
                        setForm({ ...form, title: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Destination link*">
                    <Input
                      className="admin-heroui-input"
                      required
                      maxLength={500}
                      placeholder="/products?category=winter"
                      value={form.linkHref}
                      onChange={(event) => {
                        setForm({ ...form, linkHref: event.target.value });
                      }}
                    />
                  </AdminField>
                </div>

                <AdminField
                  label="Description"
                  hint={
                    <span className="admin-field-hint">
                      {form.description.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  }
                >
                  <TextArea
                    className="admin-heroui-textarea"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Short supporting line shown under the title"
                    value={form.description}
                    onChange={(event) => {
                      setForm({ ...form, description: event.target.value });
                    }}
                  />
                </AdminField>

                <div className="admin-form-grid two">
                  <AdminField
                    label="Image alt text*"
                    hint={
                      <span className="admin-field-hint">
                        Describes the image for screen readers
                      </span>
                    }
                  >
                    <Input
                      className="admin-heroui-input"
                      required
                      maxLength={140}
                      value={form.imageAlt}
                      onChange={(event) => {
                        setForm({ ...form, imageAlt: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField
                    label="Sort order"
                    hint={
                      <span className="admin-field-hint">Lower shows first</span>
                    }
                  >
                    <Input
                      className="admin-heroui-input"
                      type="number"
                      step={1}
                      value={String(form.sortOrder)}
                      onChange={(event) => {
                        setForm({
                          ...form,
                          sortOrder: Math.trunc(Number(event.target.value) || 0),
                        });
                      }}
                    />
                  </AdminField>
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer className="admin-carousel-modal-actions">
              <Button tone="secondary" disabled={isSaving} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={SLIDE_FORM_ID}
                tone="primary"
                disabled={isSaving || !file}
              >
                {isSaving ? "Uploading…" : "Add slide"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}

function ImageDropzone({
  file,
  onChange,
}: Readonly<{
  file: File | null;
  onChange: (file: File | null) => void;
}>): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const acceptFile = (candidate: File | undefined) => {
    if (!candidate) return;
    const validationError = validateImageFile(candidate);
    setError(validationError);
    if (!validationError) onChange(candidate);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="admin-field">
      <span className="admin-field-label-row">
        <span>Slide image*</span>
        <span className="admin-field-hint">JPG, PNG or WebP · max 5 MB</span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          acceptFile(event.target.files?.[0]);
          // Reset so picking the same file again still fires onChange.
          event.target.value = "";
        }}
      />

      {file && previewUrl ? (
        <div className="admin-carousel-preview">
          <div className="admin-carousel-preview-frame">
            <img src={previewUrl} alt="Selected slide preview" />
          </div>
          <div className="admin-carousel-preview-meta">
            <div>
              <strong>{file.name}</strong>
              <span className="admin-table-muted">
                {formatFileSize(file.size)}
              </span>
            </div>
            <div className="admin-row-actions">
              <Button
                tone="ghost"
                startContent={<RefreshCw size={14} />}
                onClick={openPicker}
              >
                Replace
              </Button>
              <Button
                tone="ghost"
                startContent={<X size={14} />}
                onClick={() => {
                  setError(null);
                  onChange(null);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`admin-carousel-dropzone${isDragging ? " is-dragging" : ""}`}
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => {
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files[0]);
          }}
        >
          <span className="admin-carousel-dropzone-icon">
            <ImagePlus size={22} />
          </span>
          <strong>Click to upload or drag an image here</strong>
          <span className="admin-table-muted">
            Recommended 1920×1080 (16:9)
          </span>
        </button>
      )}

      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

function SlidePreviewModal({
  onClose,
  onDelete,
  slide,
}: Readonly<{
  onClose: () => void;
  onDelete: (slide: AdminCarouselSlide) => void;
  slide: AdminCarouselSlide | null;
}>): ReactNode {
  return (
    <Modal.Root
      isOpen={Boolean(slide)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog className="admin-carousel-modal">
            {slide ? (
              <>
                <Modal.Header className="admin-carousel-modal-head">
                  <div>
                    <Modal.Heading>{slideTitle(slide)}</Modal.Heading>
                    <span
                      className={`admin-pill ${slide.isActive ? "active" : "inactive"}`}
                    >
                      {slide.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body>
                  <div className="admin-carousel-preview-frame">
                    <img src={slide.image.url} alt={slide.image.alt} />
                  </div>
                  {slide.description ? (
                    <p className="form-muted">{slide.description}</p>
                  ) : null}
                  <div className="order-details-row">
                    <span>Link</span>
                    <a
                      href={slide.linkHref}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-carousel-link"
                    >
                      {slide.linkHref} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="order-details-row">
                    <span>Alt text</span>
                    <span>{slide.image.alt}</span>
                  </div>
                  <div className="order-details-row">
                    <span>Sort order</span>
                    <span>#{slide.sortOrder}</span>
                  </div>
                </Modal.Body>
                <Modal.Footer className="admin-carousel-modal-actions">
                  <Button
                    tone="secondary"
                    startContent={
                      <Trash2
                        size={16}
                        style={{ color: "var(--color-midas-red)" }}
                      />
                    }
                    onClick={() => {
                      onDelete(slide);
                    }}
                  >
                    Delete slide
                  </Button>
                  <Button tone="primary" onClick={onClose}>
                    Done
                  </Button>
                </Modal.Footer>
              </>
            ) : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
