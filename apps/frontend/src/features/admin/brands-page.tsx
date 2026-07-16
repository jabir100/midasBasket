import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import { deleteAdminBrand, listAdminBrands } from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";

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
      Toast.toast.success("Brand deleted");
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
        description="Manage active brands and decide which partners are featured on the homepage."
        imageLabel="Brand logo"
        items={filteredBrands}
        isLoading={brandsQuery.isLoading}
        search={brandSearch}
        onSearchChange={setBrandSearch}
        onDelete={(brand) => {
          deleteBrandMutation.mutate(brand._id);
        }}
      />
    </AdminPageShell>
  );
}
