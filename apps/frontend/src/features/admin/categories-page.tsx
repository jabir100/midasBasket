import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import { deleteAdminCategory, listAdminCategories } from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";

export function AdminCategoriesPage(): ReactNode {
  const queryClient = useQueryClient();
  const [categorySearch, setCategorySearch] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Category deleted");
    },
  });

  const filteredCategories = (categoriesQuery.data ?? []).filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  return (
    <AdminPageShell>
      <TaxonomyPanel
        kind="category"
        newRoute="/admin/categories/new"
        title="Category management"
        description="Create storefront categories and control whether they appear in homepage highlights."
        imageLabel="Category image"
        items={filteredCategories}
        isLoading={categoriesQuery.isLoading}
        search={categorySearch}
        onSearchChange={setCategorySearch}
        onDelete={(category) => {
          deleteCategoryMutation.mutate(category._id);
        }}
      />
    </AdminPageShell>
  );
}
