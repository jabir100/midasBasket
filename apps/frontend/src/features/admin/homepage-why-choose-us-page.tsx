import type { ReactNode } from "react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { RepeaterFields } from "./admin-form-controls.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";
import { useHomepageSettingsForm } from "./use-homepage-settings-form.js";

export function AdminHomepageWhyChooseUsPage(): ReactNode {
  const { homepageForm, setHomepageForm, updateHomepageMutation } =
    useHomepageSettingsForm();

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Why choose us"
          description="Policy/value cards shown above the footer on the storefront."
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem", maxWidth: "640px" }}>
          <CardBody>
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
    </AdminPageShell>
  );
}
