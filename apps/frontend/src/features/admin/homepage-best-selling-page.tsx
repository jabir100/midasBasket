import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { listAdminProducts } from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { HomepageSectionHeader } from "./homepage-section-header.js";
import { ProductPicker } from "./product-picker.js";
import { useHomepageSettingsForm } from "./use-homepage-settings-form.js";

export function AdminHomepageBestSellingPage(): ReactNode {
  const { homepageForm, setHomepageForm, updateHomepageMutation } =
    useHomepageSettingsForm();

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listAdminProducts,
  });

  return (
    <AdminPageShell>
      <div className="dashboard-pane-content">
        <HomepageSectionHeader
          title="Most selling"
          description={'Pick which products appear in the storefront\'s "Most selling" slider, and in what order.'}
        />

        <Card className="dashboard-card" style={{ marginTop: "1.5rem", maxWidth: "640px" }}>
          <CardBody>
            <ProductPicker
              allProducts={productsQuery.data ?? []}
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
      </div>
    </AdminPageShell>
  );
}
