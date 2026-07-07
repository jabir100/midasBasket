import { Input, Skeleton, TextArea } from "@heroui/react";
import { BadgeCheck, Eye, EyeOff, Tags, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import type { AdminTaxonomy } from "./admin-api.js";
import { AdminField, AdminSwitch } from "./admin-form-controls.js";
import { slugify, type TaxonomyForm } from "./admin-types.js";

export function TaxonomyPanel({
  description,
  error,
  form,
  isLoading,
  isSaving,
  items,
  onDelete,
  onFeature,
  onFormChange,
  onSubmit,
  onToggle,
  title,
}: Readonly<{
  description: string;
  error?: string | undefined;
  form: TaxonomyForm;
  isLoading: boolean;
  isSaving: boolean;
  items: AdminTaxonomy[];
  onDelete: (item: AdminTaxonomy) => void;
  onFeature: (item: AdminTaxonomy) => void;
  onFormChange: (form: TaxonomyForm) => void;
  onSubmit: () => void;
  onToggle: (item: AdminTaxonomy) => void;
  title: string;
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <div>
          <h3 className="admin-section-title">{title}</h3>
          <p className="admin-section-copy">{description}</p>
        </div>
      </div>

      <div className="admin-taxonomy-grid admin-panel-grid-offset">
        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-form-head">
              <span className="dashboard-metric-icon">
                <Tags size={18} />
              </span>
              <div>
                <h2>Create entry</h2>
                <p className="form-muted">
                  Slug is generated from the name and can be edited before
                  saving.
                </p>
              </div>
            </div>
            <form
              className="admin-modern-form"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <AdminField label="Name*">
                <Input
                  className="admin-heroui-input"
                  required
                  value={form.name}
                  onChange={(event) => {
                    onFormChange({
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
                    onFormChange({ ...form, slug: event.target.value });
                  }}
                />
              </AdminField>
              <AdminField label="Description">
                <TextArea
                  className="admin-heroui-textarea"
                  value={form.description}
                  onChange={(event) => {
                    onFormChange({ ...form, description: event.target.value });
                  }}
                />
              </AdminField>
              <div className="admin-form-grid two">
                <AdminSwitch
                  className="inline"
                  isSelected={form.isActive}
                  onChange={(isSelected) => {
                    onFormChange({ ...form, isActive: isSelected });
                  }}
                >
                  Active
                </AdminSwitch>
                <AdminSwitch
                  className="inline"
                  isSelected={form.isFeatured}
                  onChange={(isSelected) => {
                    onFormChange({ ...form, isFeatured: isSelected });
                  }}
                >
                  Featured on homepage
                </AdminSwitch>
              </div>
              <Button type="submit" tone="primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Create entry"}
              </Button>
              {error ? <p className="form-error">{error}</p> : null}
            </form>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <h2>Current entries ({items.length})</h2>
            {isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : null}
            <ul className="admin-list admin-inline-list">
              {items.map((item) => (
                <li key={item._id}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.slug} ·{" "}
                      {(item.isActive ?? true) ? "Active" : "Hidden"} ·{" "}
                      {item.isFeatured ? "Featured" : "Standard"}
                    </small>
                    {item.description ? (
                      <small>{item.description}</small>
                    ) : null}
                  </div>
                  <div className="admin-row-actions">
                    <Button
                      iconOnly
                      tone={(item.isActive ?? true) ? "secondary" : "ghost"}
                      title={(item.isActive ?? true) ? "Hide" : "Activate"}
                      onClick={() => {
                        onToggle(item);
                      }}
                      startContent={
                        (item.isActive ?? true) ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )
                      }
                    >
                      Toggle active
                    </Button>
                    <Button
                      iconOnly
                      tone={item.isFeatured ? "secondary" : "ghost"}
                      title={
                        item.isFeatured
                          ? "Remove from homepage"
                          : "Feature on homepage"
                      }
                      onClick={() => {
                        onFeature(item);
                      }}
                      startContent={<BadgeCheck size={16} />}
                    >
                      Toggle featured
                    </Button>
                    <Button
                      iconOnly
                      tone="ghost"
                      title="Delete"
                      onClick={() => {
                        onDelete(item);
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
                </li>
              ))}
              {items.length === 0 && !isLoading ? (
                <li className="admin-empty-row">
                  <p className="form-muted">No entries yet.</p>
                </li>
              ) : null}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
