import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  StickyNote,
  Trash2,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Skeleton, TextArea } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { confirmDialog } from "../../shared/ui/confirm-dialog.js";
import { toast } from "../../shared/ui/toaster.js";
import {
  WhatsAppIcon,
  toTelHref,
  toWhatsAppHref,
} from "../contact/social-platforms.js";
import {
  deleteAdminContactMessage,
  getAdminContactMessage,
  updateAdminContactMessage,
  type ContactMessageStatus,
} from "./admin-api.js";
import { AdminTableSelect } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { formatMessageDate } from "./messages-page.js";
import { ContactMessageStatusBadge } from "./status-badge.js";

const statusOptions = [
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "resolved", label: "Resolved" },
];

export function AdminMessageDetailsPage({
  messageId,
}: Readonly<{ messageId: string }>): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const messageQuery = useQuery({
    queryKey: ["admin", "contact-messages", "detail", messageId],
    queryFn: () => getAdminContactMessage(messageId),
  });

  const message = messageQuery.data;

  useEffect(() => {
    if (message) {
      setNote(message.adminNote);
      // Opening an unread message marks it read on the server; refresh lists and the nav badge.
      void queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages", "list"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages", "unread-count"],
      });
    }
  }, [message?.id]);

  const updateMutation = useMutation({
    mutationFn: (input: { status?: ContactMessageStatus; adminNote?: string }) =>
      updateAdminContactMessage(messageId, input),
    onSuccess: (updated, input) => {
      queryClient.setQueryData(
        ["admin", "contact-messages", "detail", messageId],
        updated,
      );
      void queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages", "list"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages", "unread-count"],
      });
      toast.success(input.status ? "Status updated" : "Note saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update message");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminContactMessage(messageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages"],
      });
      toast.success("Message deleted");
      void navigate({ to: "/admin/messages" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not delete message");
    },
  });

  const requestDelete = () => {
    void confirmDialog({
      title: "Delete this message?",
      description: "This message will be permanently deleted.",
      confirmLabel: "Delete message",
    }).then((confirmed) => {
      if (confirmed) {
        deleteMutation.mutate();
      }
    });
  };

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content order-details-page">
        <div className="section-heading">
          <div>
            <Link to="/admin/messages" className="admin-back-link-inline">
              <ChevronLeft size={14} /> Back to messages
            </Link>
            <h3 className="admin-section-title">
              {message?.subject ?? "Message"}
            </h3>
            <p className="admin-section-copy">
              {message
                ? `Received ${formatMessageDate(message.createdAt)}`
                : "Loading message…"}
            </p>
          </div>
          {message ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <ContactMessageStatusBadge status={message.status} />
              <Button
                tone="secondary"
                disabled={deleteMutation.isPending}
                onClick={requestDelete}
                startContent={
                  <Trash2 size={16} style={{ color: "var(--color-midas-red)" }} />
                }
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>

        {messageQuery.isLoading ? (
          <div className="admin-skeleton-stack">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : null}

        {messageQuery.isError ? (
          <p className="form-error">{messageQuery.error.message}</p>
        ) : null}

        {message ? (
          <div className="order-details-grid">
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <User size={18} />
                    </span>
                    <h2 className="order-details-section-title">Sender</h2>
                  </div>
                  <div className="order-details-row">
                    <span>Name</span>
                    <span>{message.name}</span>
                  </div>
                  <div className="order-details-row">
                    <span>Email</span>
                    <span>
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                    </span>
                  </div>
                  <div className="order-details-row">
                    <span>Phone</span>
                    <span>
                      {message.phone ? (
                        <a href={toTelHref(message.phone)}>{message.phone}</a>
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>
                  <div className="order-details-row">
                    <span>Account</span>
                    <span>{message.userId ? "Signed-in customer" : "Guest"}</span>
                  </div>

                  <div className="admin-message-reply-actions">
                    <a
                      className="ui-button ui-button-primary"
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                    >
                      <Reply size={16} />
                      <span>Reply by email</span>
                    </a>
                    {message.phone ? (
                      <>
                        <a
                          className="ui-button ui-button-secondary"
                          href={toTelHref(message.phone)}
                        >
                          <Phone size={16} />
                          <span>Call</span>
                        </a>
                        <a
                          className="ui-button ui-button-secondary"
                          href={toWhatsAppHref(message.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon size={16} />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    ) : null}
                  </div>
                </CardBody>
              </Card>

              <Card className="dashboard-card">
                <CardBody>
                  <h2 className="order-details-section-title">Tracking</h2>
                  <div className="admin-modern-form">
                    <div className="admin-field">
                      <span>Status</span>
                      <AdminTableSelect
                        label="Message status"
                        value={message.status}
                        isDisabled={updateMutation.isPending}
                        options={statusOptions}
                        onChange={(status) => {
                          if (status && status !== message.status) {
                            updateMutation.mutate({
                              status: status as ContactMessageStatus,
                            });
                          }
                        }}
                        renderValue={() => (
                          <ContactMessageStatusBadge status={message.status} />
                        )}
                      />
                    </div>
                    <div className="order-details-row">
                      <span>Received</span>
                      <span>{formatMessageDate(message.createdAt)}</span>
                    </div>
                    <div className="order-details-row">
                      <span>First opened</span>
                      <span>{formatMessageDate(message.readAt)}</span>
                    </div>
                    <div className="order-details-row">
                      <span>IP address</span>
                      <span>{message.ipAddress ?? "-"}</span>
                    </div>
                    {message.userAgent ? (
                      <p className="admin-message-user-agent">
                        <small className="admin-table-muted">
                          {message.userAgent}
                        </small>
                      </p>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </div>

            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <MessageSquare size={18} />
                    </span>
                    <h2 className="order-details-section-title">Message</h2>
                  </div>
                  <p className="admin-message-subject">
                    <Mail size={14} /> {message.subject}
                  </p>
                  <p className="admin-message-body">{message.message}</p>
                </CardBody>
              </Card>

              <Card className="dashboard-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <StickyNote size={18} />
                    </span>
                    <h2 className="order-details-section-title">
                      Internal note
                    </h2>
                  </div>
                  <form
                    className="admin-modern-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      updateMutation.mutate({ adminNote: note.trim() });
                    }}
                  >
                    <TextArea
                      aria-label="Internal note"
                      className="admin-heroui-textarea"
                      maxLength={2000}
                      placeholder="Only visible to admins, e.g. 'Called back, sent quote'"
                      value={note}
                      onChange={(event) => {
                        setNote(event.target.value);
                      }}
                    />
                    <Button
                      type="submit"
                      tone="secondary"
                      disabled={
                        updateMutation.isPending ||
                        note.trim() === message.adminNote
                      }
                    >
                      Save note
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
