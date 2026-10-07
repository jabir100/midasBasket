import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Input, Modal, Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { confirmDialog } from "../../shared/ui/confirm-dialog.js";
import { toast } from "../../shared/ui/toaster.js";
import {
  siteContactQueryKey,
  socialPlatforms,
  type SocialPlatform,
} from "../contact/contact-api.js";
import {
  SocialIcon,
  socialLinkName,
  socialPlatformMeta,
} from "../contact/social-platforms.js";
import {
  createAdminSocialLink,
  deleteAdminSocialLink,
  listAdminSocialLinks,
  updateAdminSocialLink,
  type AdminSocialLink,
} from "./admin-api.js";
import { AdminField, AdminSelect, AdminSwitch } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";

const SOCIAL_LINK_FORM_ID = "social-link-form";
const socialLinksQueryKey = ["admin", "social-links"] as const;

type SocialLinkForm = {
  platform: SocialPlatform;
  url: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
};

const emptySocialLinkForm: SocialLinkForm = {
  platform: "facebook",
  url: "",
  label: "",
  sortOrder: 0,
  isActive: true,
};

/* null = closed, "new" = adding, otherwise the link being edited. */
type EditorState = null | "new" | AdminSocialLink;

export function AdminHomepageSocialLinksPage(): ReactNode {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<EditorState>(null);

  const linksQuery = useQuery({
    queryKey: socialLinksQueryKey,
    queryFn: listAdminSocialLinks,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: socialLinksQueryKey });
    await queryClient.invalidateQueries({ queryKey: siteContactQueryKey });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteAdminSocialLink,
    onSuccess: async () => {
      await invalidate();
      toast.success("Social link removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not remove social link");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ linkId, isActive }: { linkId: string; isActive: boolean }) =>
      updateAdminSocialLink(linkId, { isActive }),
    onSuccess: async (_link, { isActive }) => {
      await invalidate();
      toast.success(isActive ? "Link is now visible" : "Link hidden");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update visibility");
    },
  });

  const links = linksQuery.data ?? [];
  const nextSortOrder =
    links.reduce((highest, link) => Math.max(highest, link.sortOrder), -1) + 1;

  const requestDelete = (link: AdminSocialLink) => {
    void confirmDialog({
      title: "Remove this social link?",
      description: `${socialLinkName(link)} will no longer appear in the footer or on the contact page.`,
      confirmLabel: "Remove link",
    }).then((confirmed) => {
      if (confirmed) {
        deleteMutation.mutate(link.id);
      }
    });
  };

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Social media"
          description="Profile links shown as icons in the site footer and on the contact page. Lower sort order appears first."
          action={
            <Button
              tone="primary"
              startContent={<Plus size={16} />}
              onClick={() => {
                setEditor("new");
              }}
            >
              Add link
            </Button>
          }
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <CardBody>
            {linksQuery.isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : null}

            {linksQuery.isError ? (
              <p className="form-error">{linksQuery.error.message}</p>
            ) : null}

            {!linksQuery.isLoading && links.length > 0 ? (
              <div className="admin-table-shell">
                <table
                  className="admin-table admin-table-compact"
                  aria-label="Social media links"
                >
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Link</th>
                      <th>Order</th>
                      <th>Visibility</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => {
                      const isToggling =
                        toggleMutation.isPending &&
                        toggleMutation.variables.linkId === link.id;

                      return (
                        <tr
                          key={link.id}
                          className={link.isActive ? undefined : "is-muted"}
                        >
                          <td>
                            <div className="admin-social-cell">
                              <span className="dashboard-metric-icon">
                                <SocialIcon platform={link.platform} size={16} />
                              </span>
                              <strong>{socialLinkName(link)}</strong>
                            </div>
                          </td>
                          <td>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-carousel-link"
                            >
                              {link.url} <ExternalLink size={12} />
                            </a>
                          </td>
                          <td>
                            <span className="admin-pill plain">
                              #{link.sortOrder}
                            </span>
                          </td>
                          <td>
                            <AdminSwitch
                              isSelected={link.isActive}
                              isDisabled={isToggling}
                              onChange={(isActive) => {
                                toggleMutation.mutate({
                                  linkId: link.id,
                                  isActive,
                                });
                              }}
                            >
                              {link.isActive ? "Visible" : "Hidden"}
                            </AdminSwitch>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <Button
                                iconOnly
                                tone="ghost"
                                title="Edit link"
                                onClick={() => {
                                  setEditor(link);
                                }}
                                startContent={<Pencil size={16} />}
                              >
                                Edit
                              </Button>
                              <Button
                                iconOnly
                                tone="ghost"
                                title="Remove link"
                                disabled={deleteMutation.isPending}
                                onClick={() => {
                                  requestDelete(link);
                                }}
                                startContent={
                                  <Trash2
                                    size={16}
                                    style={{ color: "var(--color-midas-red)" }}
                                  />
                                }
                              >
                                Remove
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

            {!linksQuery.isLoading && !linksQuery.isError && links.length === 0 ? (
              <div className="admin-empty-state">
                <Share2 size={28} />
                <p style={{ margin: 0 }}>
                  No social links yet. Add your Facebook page, Instagram, or
                  other profiles.
                </p>
                <Button
                  tone="primary"
                  startContent={<Plus size={16} />}
                  onClick={() => {
                    setEditor("new");
                  }}
                >
                  Add first link
                </Button>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>

      <SocialLinkModal
        editor={editor}
        defaultSortOrder={nextSortOrder}
        onClose={() => {
          setEditor(null);
        }}
        onSaved={invalidate}
      />
    </AdminPageShell>
  );
}

function SocialLinkModal({
  defaultSortOrder,
  editor,
  onClose,
  onSaved,
}: Readonly<{
  defaultSortOrder: number;
  editor: EditorState;
  onClose: () => void;
  onSaved: () => Promise<void>;
}>): ReactNode {
  const [form, setForm] = useState<SocialLinkForm>(emptySocialLinkForm);
  const isOpen = editor !== null;
  const editingLink = editor === "new" ? null : editor;

  useEffect(() => {
    if (editor === "new") {
      setForm({ ...emptySocialLinkForm, sortOrder: defaultSortOrder });
    } else if (editor) {
      setForm({
        platform: editor.platform,
        url: editor.url,
        label: editor.label,
        sortOrder: editor.sortOrder,
        isActive: editor.isActive,
      });
    }
  }, [editor]);

  const saveMutation = useMutation({
    mutationFn: (input: SocialLinkForm) => {
      const payload = { ...input, url: input.url.trim(), label: input.label.trim() };
      return editingLink
        ? updateAdminSocialLink(editingLink.id, payload)
        : createAdminSocialLink(payload);
    },
    onSuccess: async () => {
      await onSaved();
      toast.success(editingLink ? "Social link updated" : "Social link added");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not save social link");
    },
  });

  const isSaving = saveMutation.isPending;
  const platformMeta = socialPlatformMeta[form.platform];

  return (
    <Modal.Root
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog className="admin-carousel-modal">
            <Modal.Header className="admin-carousel-modal-head">
              <span className="dashboard-metric-icon">
                <SocialIcon platform={form.platform} />
              </span>
              <div>
                <Modal.Heading>
                  {editingLink ? "Edit social link" : "Add social link"}
                </Modal.Heading>
                <p className="form-muted">
                  Paste the full address of your profile page.
                </p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body>
              <form
                id={SOCIAL_LINK_FORM_ID}
                className="admin-modern-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveMutation.mutate(form);
                }}
              >
                <AdminSelect
                  label="Platform*"
                  placeholder="Choose a platform"
                  value={form.platform}
                  options={socialPlatforms.map((platform) => ({
                    id: platform,
                    label: socialPlatformMeta[platform].label,
                  }))}
                  onChange={(platform) => {
                    if (platform) {
                      setForm({ ...form, platform: platform as SocialPlatform });
                    }
                  }}
                />

                <AdminField
                  label="Profile URL*"
                  hint={
                    <span className="admin-field-hint">
                      Must start with https://
                    </span>
                  }
                >
                  <Input
                    className="admin-heroui-input"
                    type="url"
                    required
                    maxLength={500}
                    placeholder={platformMeta.placeholder}
                    value={form.url}
                    onChange={(event) => {
                      setForm({ ...form, url: event.target.value });
                    }}
                  />
                </AdminField>

                <div className="admin-form-grid two">
                  <AdminField
                    label="Label"
                    hint={
                      <span className="admin-field-hint">
                        Defaults to {platformMeta.label}
                      </span>
                    }
                  >
                    <Input
                      className="admin-heroui-input"
                      maxLength={60}
                      placeholder={platformMeta.label}
                      value={form.label}
                      onChange={(event) => {
                        setForm({ ...form, label: event.target.value });
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

                <AdminSwitch
                  isSelected={form.isActive}
                  onChange={(isActive) => {
                    setForm({ ...form, isActive });
                  }}
                >
                  Show on storefront
                </AdminSwitch>
              </form>
            </Modal.Body>

            <Modal.Footer className="admin-carousel-modal-actions">
              <Button tone="secondary" disabled={isSaving} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={SOCIAL_LINK_FORM_ID}
                tone="primary"
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : editingLink ? "Save changes" : "Add link"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
