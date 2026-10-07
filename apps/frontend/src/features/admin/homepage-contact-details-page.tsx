import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Input, Skeleton, TextArea } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { toast } from "../../shared/ui/toaster.js";
import { siteContactQueryKey, type ContactDetails } from "../contact/contact-api.js";
import { getAdminContactDetails, updateAdminContactDetails } from "./admin-api.js";
import { AdminField } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";

const contactDetailsQueryKey = ["admin", "contact-details"] as const;

const emptyContactDetails: ContactDetails = {
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  businessHours: "",
};

export function AdminHomepageContactDetailsPage(): ReactNode {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ContactDetails>(emptyContactDetails);

  const detailsQuery = useQuery({
    queryKey: contactDetailsQueryKey,
    queryFn: getAdminContactDetails,
  });

  useEffect(() => {
    if (detailsQuery.data) {
      setForm(detailsQuery.data);
    }
  }, [detailsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: updateAdminContactDetails,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactDetailsQueryKey });
      await queryClient.invalidateQueries({ queryKey: siteContactQueryKey });
      toast.success("Contact details saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not save contact details");
    },
  });

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Contact details"
          description="Phone, WhatsApp, email, and address shown on the contact page and in the site footer. Leave a field empty to hide it."
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem", maxWidth: "720px" }}>
          <CardBody>
            {detailsQuery.isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : (
              <form
                className="admin-modern-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveMutation.mutate({
                    phone: form.phone.trim(),
                    whatsapp: form.whatsapp.trim(),
                    email: form.email.trim(),
                    address: form.address.trim(),
                    businessHours: form.businessHours.trim(),
                  });
                }}
              >
                <div className="admin-form-grid two">
                  <AdminField label="Phone number">
                    <Input
                      className="admin-heroui-input"
                      type="tel"
                      maxLength={30}
                      placeholder="+880 1XXX-XXXXXX"
                      value={form.phone}
                      onChange={(event) => {
                        setForm({ ...form, phone: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField
                    label="WhatsApp number"
                    hint={
                      <span className="admin-field-hint">
                        Include country code
                      </span>
                    }
                  >
                    <Input
                      className="admin-heroui-input"
                      type="tel"
                      maxLength={30}
                      placeholder="+880 1XXX-XXXXXX"
                      value={form.whatsapp}
                      onChange={(event) => {
                        setForm({ ...form, whatsapp: event.target.value });
                      }}
                    />
                  </AdminField>
                </div>

                <div className="admin-form-grid two">
                  <AdminField label="Support email">
                    <Input
                      className="admin-heroui-input"
                      type="email"
                      maxLength={180}
                      placeholder="support@example.com"
                      value={form.email}
                      onChange={(event) => {
                        setForm({ ...form, email: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Business hours">
                    <Input
                      className="admin-heroui-input"
                      maxLength={160}
                      placeholder="Sat–Thu, 10am – 8pm"
                      value={form.businessHours}
                      onChange={(event) => {
                        setForm({ ...form, businessHours: event.target.value });
                      }}
                    />
                  </AdminField>
                </div>

                <AdminField label="Address">
                  <TextArea
                    className="admin-heroui-textarea"
                    maxLength={300}
                    placeholder="House, road, area, city"
                    value={form.address}
                    onChange={(event) => {
                      setForm({ ...form, address: event.target.value });
                    }}
                  />
                </AdminField>

                <Button
                  type="submit"
                  tone="primary"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : "Save contact details"}
                </Button>
                {saveMutation.error ? (
                  <p className="form-error">{saveMutation.error.message}</p>
                ) : null}
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </AdminPageShell>
  );
}
