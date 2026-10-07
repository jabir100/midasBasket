import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  deleteAdminCategory,
  listAdminCategories,
  updateAdminCategory,
} from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";
import type { TaxonomyToggleField } from "./taxonomy-panel.js";
import { toast } from "../../shared/ui/toaster.js";

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
      toast.success("Category deleted");
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: ({
      id,
      field,
      value,
    }: {
      id: string;
      field: TaxonomyToggleField;
      value: boolean;
    }) => updateAdminCategory(id, { [field]: value }),
    onSuccess: async (_category, { field, value }) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      if (field === "isActive") {
        toast.success(value ? "Category is now active" : "Category hidden");
      } else {
        toast.success(
          value ? "Category featured on homepage" : "Category removed from homepage",
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update category");
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
        description="Add categories and choose which ones appear on the homepage."
        imageLabel="Category image"
        items={filteredCategories}
        isLoading={categoriesQuery.isLoading}
        search={categorySearch}
        onSearchChange={setCategorySearch}
        togglingId={
          toggleCategoryMutation.isPending
            ? toggleCategoryMutation.variables.id
            : null
        }
        onToggle={(item, field, value) => {
          toggleCategoryMutation.mutate({ id: item._id, field, value });
        }}
        onDelete={(category) => {
          deleteCategoryMutation.mutate(category._id);
        }}
      />
    </AdminPageShell>
  );
}
