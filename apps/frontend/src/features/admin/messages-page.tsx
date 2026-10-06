import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Eye, Inbox, Search, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { confirmDialog } from "../../shared/ui/confirm-dialog.js";
import { toast } from "../../shared/ui/toaster.js";
import {
  deleteAdminContactMessage,
  listAdminContactMessages,
  type AdminContactMessageSummary,
  type ContactMessageStatus,
} from "./admin-api.js";
import { AdminSearchInput, AdminTableSelect } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { ContactMessageStatusBadge } from "./status-badge.js";

const PAGE_SIZE = 20;

const statusOptions = [
  { id: "", label: "All messages" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "resolved", label: "Resolved" },
];

export function formatMessageDate(value?: string | null): string {
  return value
    ? new Date(value).toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "-";
}

export function AdminMessagesPage(): ReactNode {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const messagesQuery = useQuery({
    queryKey: ["admin", "contact-messages", "list", search, status, page],
    queryFn: () =>
      listAdminContactMessages({
        page,
        limit: PAGE_SIZE,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status ? { status: status as ContactMessageStatus } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminContactMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "contact-messages"],
      });
      toast.success("Message deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not delete message");
    },
  });

  const messages = messagesQuery.data?.messages ?? [];
  const meta = messagesQuery.data?.meta;
  const totalPages = Math.max(meta?.pages ?? 1, 1);

  const requestDelete = (message: AdminContactMessageSummary) => {
    void confirmDialog({
      title: "Delete this message?",
      description: `The message from ${message.name} ("${message.subject}") will be permanently deleted.`,
      confirmLabel: "Delete message",
    }).then((confirmed) => {
      if (confirmed) {
        deleteMutation.mutate(message.id);
      }
    });
  };

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <div className="section-heading">
          <div>
            <h3 className="admin-section-title">Customer messages</h3>
            <p className="admin-section-copy">
              Submissions from the storefront contact form.
              {meta && meta.unread > 0
                ? ` ${meta.unread.toString()} unread.`
                : ""}
            </p>
          </div>
        </div>

        <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <CardBody>
            <div className="admin-toolbar">
              <div className="admin-toolbar-search">
                <AdminSearchInput
                  icon={<Search size={16} />}
                  placeholder="Search by name, email, phone, or subject"
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="admin-toolbar-filter">
                <AdminTableSelect
                  label="Message status"
                  placeholder="All messages"
                  value={status}
                  options={statusOptions}
                  onChange={(value) => {
                    setStatus(value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {messagesQuery.isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ) : null}

            {messagesQuery.isError ? (
              <p className="form-error">{messagesQuery.error.message}</p>
            ) : null}

            {!messagesQuery.isLoading && messages.length > 0 ? (
              <div className="admin-table-shell">
                <table
                  className="admin-table admin-table-compact"
                  aria-label="Contact messages"
                >
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Subject</th>
                      <th>Received</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr
                        key={message.id}
                        className={message.status === "new" ? "is-unread" : undefined}
                      >
                        <td>
                          <div className="admin-order-customer">
                            <strong>{message.name}</strong>
                            <small>{message.email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="admin-message-subject-cell">
                            <Link
                              to="/admin/messages/$messageId"
                              params={{ messageId: message.id }}
                              className="admin-order-id-link"
                            >
                              {message.subject}
                            </Link>
                            <small className="admin-table-muted">
                              {message.preview}
                            </small>
                          </div>
                        </td>
                        <td>
                          <small>{formatMessageDate(message.createdAt)}</small>
                        </td>
                        <td>
                          <ContactMessageStatusBadge status={message.status} />
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <Link
                              to="/admin/messages/$messageId"
                              params={{ messageId: message.id }}
                            >
                              <Button
                                iconOnly
                                tone="ghost"
                                title="View message"
                                startContent={<Eye size={16} />}
                              >
                                View
                              </Button>
                            </Link>
                            <Button
                              iconOnly
                              tone="ghost"
                              title="Delete message"
                              disabled={deleteMutation.isPending}
                              onClick={() => {
                                requestDelete(message);
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

            {!messagesQuery.isLoading &&
            !messagesQuery.isError &&
            messages.length === 0 ? (
              <div className="admin-empty-state">
                <Inbox size={28} />
                <p style={{ margin: 0 }}>
                  {search || status
                    ? "No messages match the current filters."
                    : "No messages yet. Submissions from the contact page will appear here."}
                </p>
              </div>
            ) : null}

            {meta && meta.total > PAGE_SIZE ? (
              <div className="admin-pagination">
                <small className="admin-table-muted">
                  Page {page} of {totalPages} · {meta.total} messages
                </small>
                <div className="admin-row-actions">
                  <Button
                    tone="ghost"
                    disabled={page <= 1}
                    startContent={<ChevronLeft size={16} />}
                    onClick={() => {
                      setPage((current) => Math.max(current - 1, 1));
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    tone="ghost"
                    disabled={page >= totalPages}
                    endContent={<ChevronRight size={16} />}
                    onClick={() => {
                      setPage((current) => Math.min(current + 1, totalPages));
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </AdminPageShell>
  );
}
