import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import {
  deleteAdminProduct,
  listAdminBrands,
  listAdminCategories,
  listAdminProducts,
  updateAdminProduct,
} from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { ProductsPanel } from "./products-panel.js";

export function AdminProductsPage(): ReactNode {
  const queryClient = useQueryClient();
  const [productSearch, setProductSearch] = useState("");

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listAdminProducts,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
  });

  const toggleProductPublishMutation = useMutation({
    mutationFn: ({
      productId,
      isPublished,
    }: {
      productId: string;
      isPublished: boolean;
    }) => updateAdminProduct(productId, { isPublished }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      Toast.toast.success("Product visibility updated");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      Toast.toast.success("Product deleted");
    },
  });

  const filteredProducts = (productsQuery.data ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <AdminPageShell>
      <ProductsPanel
        products={filteredProducts}
        categories={categoriesQuery.data ?? []}
        brands={brandsQuery.data ?? []}
        isLoading={productsQuery.isLoading}
        isTogglingPublish={toggleProductPublishMutation.isPending}
        isDeleting={deleteProductMutation.isPending}
        search={productSearch}
        onSearchChange={setProductSearch}
        onTogglePublish={(product) => {
          toggleProductPublishMutation.mutate({
            productId: product._id,
            isPublished: !product.isPublished,
          });
        }}
        onDelete={(product) => {
          deleteProductMutation.mutate(product._id);
        }}
      />
    </AdminPageShell>
  );
}
