import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Shield, Truck, Package } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton, Toast } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import {
  getCurrentUser,
  getStoredAccessToken,
  logoutCustomer,
} from "../auth/auth-api.js";
import {
  getAdminSummary,
  listAdminOrders,
  listAdminUsers,
  listAuditLogs,
  updateAdminUser,
  updateOrderStatus,
  getAdminCarouselSlides,
  createCarouselSlide,
  deleteCarouselSlide,
  toggleCarouselSlideActive,
  listAdminProducts,
  updateAdminProduct,
  deleteAdminProduct,
  listAdminCategories,
  updateAdminCategory,
  deleteAdminCategory,
  listAdminBrands,
  updateAdminBrand,
  deleteAdminBrand,
  getHomepageSettings,
  updateHomepageSettings,
  type AdminTaxonomy,
  type HomepageSettings,
} from "./admin-api.js";
import { defaultHomepageForm, type AdminPanel } from "./admin-types.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";
import { OrdersPanel } from "./orders-panel.js";
import { ProductsPanel } from "./products-panel.js";
import { UsersPanel } from "./users-panel.js";
import { HomepageConfigPanel } from "./homepage-config-panel.js";
import { AdminShell, type AdminNavCounts } from "./admin-shell.js";

export function AdminDashboardPage(): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    } else if (userQuery.data && userQuery.data.role !== "admin") {
      void navigate({ to: "/" });
    }
  }, [token, userQuery.data, navigate]);

  const [activePanel, setActivePanel] = useState<AdminPanel>("overview");

  const [userFilter, setUserFilter] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [homepageForm, setHomepageForm] =
    useState<HomepageSettings>(defaultHomepageForm);

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const summaryQuery = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminSummary,
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", userFilter, userRoleFilter, userStatusFilter],
    queryFn: () =>
      listAdminUsers({
        ...(userFilter ? { search: userFilter } : {}),
        ...(userRoleFilter ? { role: userRoleFilter as "admin" | "customer" } : {}),
        ...(userStatusFilter
          ? { status: userStatusFilter as "active" | "blocked" }
          : {}),
      }),
    enabled: isAdmin,
  });
  const ordersQuery = useQuery({
    queryKey: [
      "admin",
      "orders",
      orderStatusFilter,
      orderPaymentStatusFilter,
      orderSearch,
    ],
    queryFn: () =>
      listAdminOrders({
        ...(orderStatusFilter ? { status: orderStatusFilter } : {}),
        ...(orderPaymentStatusFilter
          ? { paymentStatus: orderPaymentStatusFilter }
          : {}),
        ...(orderSearch ? { search: orderSearch } : {}),
      }),
    enabled: isAdmin,
  });
  const auditQuery = useQuery({
    queryKey: ["admin", "audit"],
    queryFn: () => listAuditLogs({ limit: 10 }),
    enabled: isAdmin,
  });
  const carouselQuery = useQuery({
    queryKey: ["admin", "carousel"],
    queryFn: getAdminCarouselSlides,
    enabled: isAdmin,
  });
  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listAdminProducts,
    enabled: isAdmin,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
    enabled: isAdmin,
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
    enabled: isAdmin,
  });
  const homepageSettingsQuery = useQuery({
    queryKey: ["admin", "homepage", "settings"],
    queryFn: getHomepageSettings,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (homepageSettingsQuery.data) {
      setHomepageForm({
        ...defaultHomepageForm,
        ...homepageSettingsQuery.data,
      });
    }
  }, [homepageSettingsQuery.data]);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "blocked";
    }) => updateAdminUser(userId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      Toast.toast.success("User status updated");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
      paymentStatus,
    }: {
      orderId: string;
      status: string;
      paymentStatus?: string;
    }) =>
      updateOrderStatus(orderId, {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "audit"] });
      Toast.toast.success("Order updated");
    },
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

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      input,
    }: {
      categoryId: string;
      input: Partial<AdminTaxonomy>;
    }) => updateAdminCategory(categoryId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Category updated");
    },
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

  const updateBrandMutation = useMutation({
    mutationFn: ({
      brandId,
      input,
    }: {
      brandId: string;
      input: Partial<AdminTaxonomy>;
    }) => updateAdminBrand(brandId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Brand updated");
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: deleteAdminBrand,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Brand deleted");
    },
  });

  const updateHomepageMutation = useMutation({
    mutationFn: updateHomepageSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "homepage", "settings"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Homepage settings saved");
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [slideForm, setSlideForm] = useState({
    linkHref: "",
    title: "",
    description: "",
    imageAlt: "",
    sortOrder: 0,
  });

  const createSlideMutation = useMutation({
    mutationFn: createCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      setSlideForm({
        linkHref: "",
        title: "",
        description: "",
        imageAlt: "",
        sortOrder: 0,
      });
      setFile(null);
      const fileInput = document.getElementById(
        "slide-file-input",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      Toast.toast.success("Carousel slide uploaded");
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: deleteCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      Toast.toast.success("Carousel slide deleted");
    },
  });

  const toggleSlideMutation = useMutation({
    mutationFn: ({
      slideId,
      isActive,
    }: {
      slideId: string;
      isActive: boolean;
    }) => toggleCarouselSlideActive(slideId, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
      Toast.toast.success("Carousel visibility updated");
    },
  });

  if (!token || userQuery.isLoading || userQuery.data?.role !== "admin") {
    return null;
  }

  const adminName = userQuery.data.name;

  const navCounts: AdminNavCounts = {
    products: (productsQuery.data ?? []).length,
    categories: (categoriesQuery.data ?? []).length,
    brands: (brandsQuery.data ?? []).length,
    homepage: (carouselQuery.data ?? []).length,
    users: (usersQuery.data ?? []).length,
    orders: (ordersQuery.data ?? []).length,
  };

  const filteredProducts = (productsQuery.data ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const filteredCategories = (categoriesQuery.data ?? []).filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredBrands = (brandsQuery.data ?? []).filter(
    (b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
      b.slug.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  return (
    <AdminShell
      activePanel={activePanel}
      adminName={adminName}
      isLoggingOut={logoutMutation.isPending}
      navCounts={navCounts}
      onLogout={() => {
        logoutMutation.mutate();
      }}
      onSelectPanel={(panel) => {
        setActivePanel(panel);
      }}
    >
      {/* ── Overview ──────────────────────────────────────────────────── */}
      {activePanel === "overview" && (
        <div className="dashboard-pane-content">
          <div className="section-heading">
            <div>
              <h3 style={{ margin: 0 }}>Admin dashboard</h3>
              <p
                style={{
                  color: "var(--color-midas-gray)",
                  margin: "0.25rem 0 0",
                }}
              >
                Operational analytics, account management, order lifecycle, and
                homepage settings.
              </p>
            </div>
          </div>

          {summaryQuery.data ? (
            <section
              className="admin-summary-grid"
              style={{ marginTop: "1.5rem" }}
            >
              <SummaryCard
                icon={<BarChart3 size={18} />}
                label="Revenue (lifetime)"
                value={`${summaryQuery.data.revenue.currency} ${summaryQuery.data.revenue.lifetime.toLocaleString("en-BD")}`}
              />
              <SummaryCard
                icon={<Truck size={18} />}
                label="Orders (7d)"
                value={summaryQuery.data.orders.recentOrders.toString()}
              />
              <SummaryCard
                icon={<Package size={18} />}
                label="Total orders"
                value={summaryQuery.data.orders.totalOrders.toString()}
              />
              <SummaryCard
                icon={<Shield size={18} />}
                label="Blocked users"
                value={summaryQuery.data.users.blockedUsers.toString()}
              />
            </section>
          ) : null}

          <Card
            className="dashboard-card admin-audit-card"
            style={{ marginTop: "2rem" }}
          >
            <CardBody>
              <h2>Recent audit logs</h2>
              {auditQuery.isLoading ? (
                <div className="admin-skeleton-stack">
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ) : null}

              {!auditQuery.isLoading && (auditQuery.data ?? []).length > 0 ? (
                <div className="admin-table-shell">
                  <table
                    className="admin-table admin-table-compact"
                    role="table"
                    aria-label="Audit logs table"
                  >
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Entity</th>
                        <th>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(auditQuery.data ?? []).map((log) => (
                        <tr key={log.id}>
                          <td>
                            <strong>{log.action}</strong>
                          </td>
                          <td>{log.actorEmail}</td>
                          <td>
                            <small className="admin-table-muted">
                              {log.entityType}:{log.entityId}
                            </small>
                          </td>
                          <td>
                            <small className="admin-table-muted">
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleString("en-BD")
                                : "-"}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {!auditQuery.isLoading && auditQuery.data?.length === 0 ? (
                <div className="admin-empty-state">
                  <BarChart3 size={28} />
                  <p style={{ margin: 0 }}>No audit logs recorded yet.</p>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      )}

      {/* ── Products ──────────────────────────────────────────────────── */}
      {activePanel === "products" && (
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
      )}

      {/* ── Categories ───────────────────────────────────────────────── */}
      {activePanel === "categories" && (
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
          onToggle={(category) => {
            updateCategoryMutation.mutate({
              categoryId: category._id,
              input: { isActive: !(category.isActive ?? true) },
            });
          }}
          onFeature={(category) => {
            updateCategoryMutation.mutate({
              categoryId: category._id,
              input: { isFeatured: !(category.isFeatured ?? false) },
            });
          }}
          onDelete={(category) => {
            deleteCategoryMutation.mutate(category._id);
          }}
        />
      )}

      {/* ── Brands ───────────────────────────────────────────────────── */}
      {activePanel === "brands" && (
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
          onToggle={(brand) => {
            updateBrandMutation.mutate({
              brandId: brand._id,
              input: { isActive: !(brand.isActive ?? true) },
            });
          }}
          onFeature={(brand) => {
            updateBrandMutation.mutate({
              brandId: brand._id,
              input: { isFeatured: !(brand.isFeatured ?? false) },
            });
          }}
          onDelete={(brand) => {
            deleteBrandMutation.mutate(brand._id);
          }}
        />
      )}

      {/* ── Homepage Config ──────────────────────────────────────────── */}
      {activePanel === "homepage" && (
        <HomepageConfigPanel
          carouselSlides={carouselQuery.data ?? []}
          isCarouselLoading={carouselQuery.isLoading}
          products={productsQuery.data ?? []}
          homepageForm={homepageForm}
          setHomepageForm={setHomepageForm}
          file={file}
          setFile={setFile}
          slideForm={slideForm}
          setSlideForm={setSlideForm}
          createSlideMutation={createSlideMutation}
          toggleSlideMutation={toggleSlideMutation}
          deleteSlideMutation={deleteSlideMutation}
          updateHomepageMutation={updateHomepageMutation}
        />
      )}

      {/* ── Users ─────────────────────────────────────────────────────── */}
      {activePanel === "users" && (
        <UsersPanel
          users={usersQuery.data ?? []}
          isLoading={usersQuery.isLoading}
          isUpdatingStatus={updateUserMutation.isPending}
          search={userFilter}
          roleFilter={userRoleFilter}
          statusFilter={userStatusFilter}
          onSearchChange={setUserFilter}
          onRoleFilterChange={setUserRoleFilter}
          onStatusFilterChange={setUserStatusFilter}
          onToggleStatus={(user) => {
            updateUserMutation.mutate({
              userId: user.id,
              status: user.status === "active" ? "blocked" : "active",
            });
          }}
        />
      )}

      {/* ── Orders ────────────────────────────────────────────────────── */}
      {activePanel === "orders" && (
        <OrdersPanel
          isLoading={ordersQuery.isLoading}
          isUpdatingStatus={updateOrderMutation.isPending}
          orders={ordersQuery.data ?? []}
          search={orderSearch}
          statusFilter={orderStatusFilter}
          paymentStatusFilter={orderPaymentStatusFilter}
          onSearchChange={setOrderSearch}
          onStatusFilterChange={setOrderStatusFilter}
          onPaymentStatusFilterChange={setOrderPaymentStatusFilter}
          onStatusChange={(orderId, status, paymentStatus) => {
            updateOrderMutation.mutate({ orderId, status, paymentStatus });
          }}
          onPaymentStatusChange={(orderId, status, paymentStatus) => {
            updateOrderMutation.mutate({ orderId, status, paymentStatus });
          }}
        />
      )}

    </AdminShell>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: Readonly<{ icon: ReactNode; label: string; value: string }>): ReactNode {
  return (
    <Card className="dashboard-card dashboard-metric-card">
      <CardBody>
        <span className="dashboard-metric-icon">{icon}</span>
        <small>{label}</small>
        <strong>{value}</strong>
      </CardBody>
    </Card>
  );
}
