import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  deleteAdminBrand,
  listAdminBrands,
  updateAdminBrand,
} from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";
import type { TaxonomyToggleField } from "./taxonomy-panel.js";
import { toast } from "../../shared/ui/toaster.js";

export function AdminBrandsPage(): ReactNode {
  const queryClient = useQueryClient();
  const [brandSearch, setBrandSearch] = useState("");

  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
  });

  const deleteBrandMutation = useMutation({
    mutationFn: deleteAdminBrand,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      toast.success("Brand deleted");
    },
  });

  const toggleBrandMutation = useMutation({
    mutationFn: ({
      id,
      field,
      value,
    }: {
      id: string;
      field: TaxonomyToggleField;
      value: boolean;
    }) => updateAdminBrand(id, { [field]: value }),
    onSuccess: async (_brand, { field, value }) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      if (field === "isActive") {
        toast.success(value ? "Brand is now active" : "Brand hidden");
      } else {
        toast.success(
          value ? "Brand featured on homepage" : "Brand removed from homepage",
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update brand");
    },
  });

  const filteredBrands = (brandsQuery.data ?? []).filter(
    (b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
      b.slug.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  return (
    <AdminPageShell>
      <TaxonomyPanel
        kind="brand"
        newRoute="/admin/brands/new"
        title="Brand management"
        description="Add brands and choose which ones appear on the homepage."
        imageLabel="Brand logo"
        items={filteredBrands}
        isLoading={brandsQuery.isLoading}
        search={brandSearch}
        onSearchChange={setBrandSearch}
        togglingId={
          toggleBrandMutation.isPending
            ? toggleBrandMutation.variables.id
            : null
        }
        onToggle={(item, field, value) => {
          toggleBrandMutation.mutate({ id: item._id, field, value });
        }}
        onDelete={(brand) => {
          deleteBrandMutation.mutate(brand._id);
        }}
      />
    </AdminPageShell>
  );
}
