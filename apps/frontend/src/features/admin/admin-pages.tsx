import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Shield,
  Truck,
  Eye,
  EyeOff,
  Trash2,
  Tags,
  BadgeCheck,
  MessageSquareQuote,
  Home,
  LayoutGrid,
  Users,
  ShoppingCart,
  Image,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Input, Skeleton, TextArea, Toast } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
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
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  listAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  listAdminBrands,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
  getHomepageSettings,
  updateHomepageSettings,
  listAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  type AdminTaxonomy,
  type HomepageSettings,
} from "./admin-api.js";
import {
  AdminField,
  AdminSelect,
  AdminSwitch,
  RepeaterFields,
} from "./admin-form-controls.js";
import {
  defaultHomepageForm,
  emptyTaxonomyForm,
  slugify,
  toTaxonomyPayload,
  type AdminPanel,
  type TaxonomyForm,
} from "./admin-types.js";
import { TaxonomyPanel } from "./taxonomy-panel.js";

const statusOptions = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [userFilter, setUserFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [categoryForm, setCategoryForm] =
    useState<TaxonomyForm>(emptyTaxonomyForm);
  const [brandForm, setBrandForm] = useState<TaxonomyForm>(emptyTaxonomyForm);
  const [homepageForm, setHomepageForm] =
    useState<HomepageSettings>(defaultHomepageForm);
  const [testimonialForm, setTestimonialForm] = useState({
    customerName: "",
    quote: "",
    rating: 5,
    sortOrder: 0,
    isActive: true,
  });

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const summaryQuery = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminSummary,
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", userFilter],
    queryFn: () =>
      listAdminUsers(userFilter ? { search: userFilter } : undefined),
    enabled: isAdmin,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", orderStatusFilter],
    queryFn: () =>
      listAdminOrders(
        orderStatusFilter ? { status: orderStatusFilter } : undefined,
      ),
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
  const testimonialsQuery = useQuery({
    queryKey: ["admin", "homepage", "testimonials"],
    queryFn: listAdminTestimonials,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (homepageSettingsQuery.data) {
      setHomepageForm({
        ...defaultHomepageForm,
        ...homepageSettingsQuery.data,
        hero: {
          ...defaultHomepageForm.hero,
          ...homepageSettingsQuery.data.hero,
          title:
            homepageSettingsQuery.data.hero?.title ??
            "Modern shopping for everyday wins",
          primaryAction: {
            ...(defaultHomepageForm.hero?.primaryAction ?? {
              href: "/products",
              label: "Shop products",
            }),
            ...homepageSettingsQuery.data.hero?.primaryAction,
          },
          secondaryAction: {
            ...(defaultHomepageForm.hero?.secondaryAction ?? {
              href: "/categories",
              label: "Browse categories",
            }),
            ...homepageSettingsQuery.data.hero?.secondaryAction,
          },
        },
        promoBanner: {
          ...defaultHomepageForm.promoBanner,
          ...homepageSettingsQuery.data.promoBanner,
          title:
            homepageSettingsQuery.data.promoBanner?.title ??
            "Weekend essentials, sharper prices",
          action: {
            ...(defaultHomepageForm.promoBanner?.action ?? {
              href: "/products",
              label: "Explore offers",
            }),
            ...homepageSettingsQuery.data.promoBanner?.action,
          },
        },
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
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "audit"] });
      Toast.toast.success("Order status updated");
    },
  });

  // Product CRUD mutations
  const createProductMutation = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setShowAddProduct(false);
      setProductForm({
        name: "",
        slug: "",
        sku: "",
        price: 0,
        compareAtPrice: 0,
        stockQuantity: 0,
        description: "",
        shortDescription: "",
        categoryId: "",
        brandId: "",
        isPublished: true,
      });
      Toast.toast.success("Product created");
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

  const createCategoryMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      setCategoryForm(emptyTaxonomyForm);
      Toast.toast.success("Category created");
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

  const createBrandMutation = useMutation({
    mutationFn: createAdminBrand,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      setBrandForm(emptyTaxonomyForm);
      Toast.toast.success("Brand created");
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

  const createTestimonialMutation = useMutation({
    mutationFn: createAdminTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "homepage", "testimonials"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      setTestimonialForm({
        customerName: "",
        quote: "",
        rating: 5,
        sortOrder: 0,
        isActive: true,
      });
      Toast.toast.success("Testimonial added");
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({
      testimonialId,
      input,
    }: {
      testimonialId: string;
      input: { isActive?: boolean };
    }) => updateAdminTestimonial(testimonialId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "homepage", "testimonials"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Testimonial updated");
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: deleteAdminTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "homepage", "testimonials"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Testimonial deleted");
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

  // Product Add Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    sku: "",
    price: 0,
    compareAtPrice: 0,
    stockQuantity: 0,
    description: "",
    shortDescription: "",
    categoryId: "",
    brandId: "",
    isPublished: true,
  });

  if (!token || userQuery.isLoading || userQuery.data?.role !== "admin") {
    return null;
  }

  const adminName = userQuery.data.name;

  const navItems: {
    id: AdminPanel;
    label: string;
    icon: ReactNode;
    badge?: number;
  }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid size={18} /> },
    {
      id: "products",
      label: "Products",
      icon: <Package size={18} />,
      badge: (productsQuery.data ?? []).length,
    },
    {
      id: "categories",
      label: "Categories",
      icon: <Tags size={18} />,
      badge: (categoriesQuery.data ?? []).length,
    },
    {
      id: "brands",
      label: "Brands",
      icon: <BadgeCheck size={18} />,
      badge: (brandsQuery.data ?? []).length,
    },
    {
      id: "homepage",
      label: "Homepage",
      icon: <Home size={18} />,
      badge: (testimonialsQuery.data ?? []).length,
    },
    {
      id: "users",
      label: "Users",
      icon: <Users size={18} />,
      badge: (usersQuery.data ?? []).length,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={18} />,
      badge: (ordersQuery.data ?? []).length,
    },
    {
      id: "carousel",
      label: "Carousel",
      icon: <Image size={18} />,
      badge: (carouselQuery.data ?? []).length,
    },
  ];

  const filteredProducts = (productsQuery.data ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="dashboard-wrapper">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`dashboard-sidebar admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
      >
        <button
          onClick={() => {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }}
          className="sidebar-toggle-btn"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>

        {/* Brand */}
        <div className="sidebar-brand">
          <span className="sidebar-brand-symbol">M</span>
          {!isSidebarCollapsed && <span>Midas Portal</span>}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePanel(item.id);
                setShowAddProduct(false);
              }}
              className={`sidebar-nav-btn ${activePanel === item.id ? "active" : ""}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isSidebarCollapsed && (
                <>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="admin-nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Identity & Logout at the bottom */}
        <div
          className="admin-sidebar-footer"
          style={{
            borderTop: "1px solid var(--color-midas-border)",
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {!isSidebarCollapsed && (
            <div
              className="admin-sidebar-identity"
              style={{ padding: "0 0.5rem" }}
            >
              <small className="admin-sidebar-role-label">Administration</small>
              <p
                className="admin-sidebar-name"
                style={{ margin: 0, fontSize: "0.85rem" }}
              >
                Hi, <strong>{adminName}</strong>
              </p>
            </div>
          )}

          {!isSidebarCollapsed && (
            <Link
              to="/"
              className="admin-sidebar-footer-link"
              style={{ fontSize: "0.8rem", color: "var(--color-midas-gray)" }}
            >
              ← Exit to store
            </Link>
          )}

          <button
            className="sidebar-nav-btn admin-logout-btn"
            title="Log out"
            disabled={logoutMutation.isPending}
            onClick={() => {
              logoutMutation.mutate();
            }}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <section className="dashboard-content-pane">
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
                  Operational analytics, account management, order lifecycle,
                  and homepage settings.
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
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : null}
                <ul className="admin-list">
                  {(auditQuery.data ?? []).map((log) => (
                    <li key={log.id}>
                      <div>
                        <strong>{log.action}</strong>
                        <small>
                          {log.actorEmail} · {log.entityType}:{log.entityId}
                        </small>
                      </div>
                      <small>
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString("en-BD")
                          : "-"}
                      </small>
                    </li>
                  ))}
                </ul>
                {auditQuery.data && auditQuery.data.length === 0 && (
                  <p className="form-muted">No audit logs recorded yet.</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── Products ──────────────────────────────────────────────────── */}
        {activePanel === "products" && (
          <div className="dashboard-pane-content">
            <div
              className="section-heading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Product management</h3>
                <p
                  style={{
                    color: "var(--color-midas-gray)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Create, publish, edit, or delete items in the storefront
                  catalog.
                </p>
              </div>
              <Button
                tone="primary"
                onClick={() => {
                  setShowAddProduct(!showAddProduct);
                }}
                startContent={<Plus size={18} />}
              >
                {showAddProduct ? "View list" : "Add product"}
              </Button>
            </div>

            {showAddProduct ? (
              <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <Package size={18} />
                    </span>
                    <div>
                      <h2>Create product</h2>
                      <p className="form-muted">
                        Publish catalog items with clean taxonomy and
                        storefront-ready copy.
                      </p>
                    </div>
                  </div>
                  <form
                    className="admin-modern-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!productForm.categoryId || !productForm.brandId) {
                        Toast.toast.warning("Select category and brand");
                        return;
                      }
                      createProductMutation.mutate(productForm);
                    }}
                  >
                    <div className="admin-form-grid two">
                      <AdminField label="Product name*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={productForm.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setProductForm({
                              ...productForm,
                              name,
                              slug: slugify(name),
                            });
                          }}
                        />
                      </AdminField>

                      <AdminField label="Slug*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={productForm.slug}
                          onChange={(e) => {
                            setProductForm({
                              ...productForm,
                              slug: e.target.value,
                            });
                          }}
                        />
                      </AdminField>
                    </div>

                    <div className="admin-form-grid three">
                      <AdminField label="SKU*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={productForm.sku}
                          onChange={(e) => {
                            setProductForm({
                              ...productForm,
                              sku: e.target.value.toUpperCase(),
                            });
                          }}
                        />
                      </AdminField>

                      <AdminField label="Price (BDT)*">
                        <Input
                          className="admin-heroui-input"
                          type="number"
                          required
                          value={String(productForm.price)}
                          onChange={(e) => {
                            setProductForm({
                              ...productForm,
                              price: Number(e.target.value),
                            });
                          }}
                        />
                      </AdminField>

                      <AdminField label="Stock quantity*">
                        <Input
                          className="admin-heroui-input"
                          type="number"
                          required
                          value={String(productForm.stockQuantity)}
                          onChange={(e) => {
                            setProductForm({
                              ...productForm,
                              stockQuantity: Number(e.target.value),
                            });
                          }}
                        />
                      </AdminField>
                    </div>

                    <div className="admin-form-grid two">
                      <AdminSelect
                        label="Category*"
                        placeholder="Select category"
                        value={productForm.categoryId}
                        options={(categoriesQuery.data ?? []).map(
                          (category) => ({
                            id: category._id,
                            label: category.name,
                          }),
                        )}
                        onChange={(categoryId) => {
                          setProductForm({ ...productForm, categoryId });
                        }}
                      />

                      <AdminSelect
                        label="Brand*"
                        placeholder="Select brand"
                        value={productForm.brandId}
                        options={(brandsQuery.data ?? []).map((brand) => ({
                          id: brand._id,
                          label: brand.name,
                        }))}
                        onChange={(brandId) => {
                          setProductForm({ ...productForm, brandId });
                        }}
                      />
                    </div>

                    <AdminField label="Short description">
                      <Input
                        className="admin-heroui-input"
                        value={productForm.shortDescription}
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            shortDescription: e.target.value,
                          });
                        }}
                      />
                    </AdminField>

                    <AdminField label="Full description*">
                      <TextArea
                        className="admin-heroui-textarea"
                        required
                        value={productForm.description}
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          });
                        }}
                      />
                    </AdminField>

                    <label className="admin-checkbox-control">
                      <input
                        type="checkbox"
                        checked={productForm.isPublished}
                        onChange={(event) => {
                          setProductForm({
                            ...productForm,
                            isPublished: event.target.checked,
                          });
                        }}
                      />
                      <span>Publish immediately</span>
                    </label>

                    <div className="admin-form-actions">
                      <Button
                        type="submit"
                        tone="primary"
                        disabled={createProductMutation.isPending}
                      >
                        {createProductMutation.isPending
                          ? "Saving..."
                          : "Create Product"}
                      </Button>
                    </div>
                    {createProductMutation.error && (
                      <p className="form-error">
                        {createProductMutation.error.message}
                      </p>
                    )}
                  </form>
                </CardBody>
              </Card>
            ) : (
              <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
                <CardBody>
                  <div className="admin-card-head">
                    <h2>Catalog Items ({filteredProducts.length})</h2>
                    <input
                      placeholder="Search name or SKU..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                      }}
                    />
                  </div>

                  {productsQuery.isLoading ? (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ) : null}

                  <ul className="admin-list" style={{ gap: "1rem" }}>
                    {filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: "1px solid var(--color-midas-border)",
                          paddingBottom: "0.75rem",
                        }}
                      >
                        <div>
                          <strong>{product.name}</strong>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--color-midas-gray)",
                              display: "flex",
                              gap: "0.75rem",
                              marginTop: "0.2rem",
                            }}
                          >
                            <span>SKU: {product.sku}</span>
                            <span>Price: ৳{product.price}</span>
                            <span>Stock: {product.stockQuantity}</span>
                            <span
                              style={{
                                color: product.isPublished ? "green" : "red",
                                fontWeight: "bold",
                              }}
                            >
                              {product.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <Button
                            iconOnly
                            tone={product.isPublished ? "secondary" : "ghost"}
                            title={
                              product.isPublished ? "Unpublish" : "Publish"
                            }
                            disabled={toggleProductPublishMutation.isPending}
                            onClick={() => {
                              toggleProductPublishMutation.mutate({
                                productId: product._id,
                                isPublished: !product.isPublished,
                              });
                            }}
                            startContent={
                              product.isPublished ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )
                            }
                          >
                            Toggle Publish
                          </Button>

                          <Button
                            iconOnly
                            tone="ghost"
                            title="Delete"
                            disabled={deleteProductMutation.isPending}
                            onClick={() => {
                              if (confirm(`Delete ${product.name}?`)) {
                                deleteProductMutation.mutate(product._id);
                              }
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
                      </li>
                    ))}
                    {filteredProducts.length === 0 &&
                      !productsQuery.isLoading && (
                        <li className="admin-empty-row">
                          <p className="form-muted">
                            No products match search criteria.
                          </p>
                        </li>
                      )}
                  </ul>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* ── Categories ───────────────────────────────────────────────── */}
        {activePanel === "categories" && (
          <TaxonomyPanel
            title="Category management"
            description="Create storefront categories and control whether they appear in homepage highlights."
            form={categoryForm}
            items={categoriesQuery.data ?? []}
            isLoading={categoriesQuery.isLoading}
            isSaving={createCategoryMutation.isPending}
            onFormChange={setCategoryForm}
            onSubmit={() => {
              createCategoryMutation.mutate(toTaxonomyPayload(categoryForm));
            }}
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
              if (confirm(`Delete ${category.name}?`)) {
                deleteCategoryMutation.mutate(category._id);
              }
            }}
            error={createCategoryMutation.error?.message}
          />
        )}

        {/* ── Brands ───────────────────────────────────────────────────── */}
        {activePanel === "brands" && (
          <TaxonomyPanel
            title="Brand management"
            description="Manage active brands and decide which partners are featured on the homepage."
            form={brandForm}
            items={brandsQuery.data ?? []}
            isLoading={brandsQuery.isLoading}
            isSaving={createBrandMutation.isPending}
            onFormChange={setBrandForm}
            onSubmit={() => {
              createBrandMutation.mutate(toTaxonomyPayload(brandForm));
            }}
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
              if (confirm(`Delete ${brand.name}?`)) {
                deleteBrandMutation.mutate(brand._id);
              }
            }}
            error={createBrandMutation.error?.message}
          />
        )}

        {/* ── Homepage Config ──────────────────────────────────────────── */}
        {activePanel === "homepage" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <div>
                <h3 style={{ margin: 0 }}>Homepage configuration</h3>
                <p
                  style={{
                    color: "var(--color-midas-gray)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Manage hero content, policy/value sections, campaign banner,
                  metrics, and testimonials.
                </p>
              </div>
            </div>

            <div
              className="admin-homepage-grid"
              style={{ marginTop: "1.5rem" }}
            >
              <Card className="dashboard-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <Home size={18} />
                    </span>
                    <div>
                      <h2>Storefront sections</h2>
                      <p className="form-muted">
                        These values feed the public homepage payload and clear
                        the homepage cache when saved.
                      </p>
                    </div>
                  </div>
                  <form
                    className="admin-modern-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      updateHomepageMutation.mutate(homepageForm);
                    }}
                  >
                    <div className="admin-form-grid two">
                      <AdminField label="Hero eyebrow">
                        <Input
                          className="admin-heroui-input"
                          value={homepageForm.hero?.eyebrow ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              hero: {
                                ...homepageForm.hero,
                                title:
                                  homepageForm.hero?.title ??
                                  defaultHomepageForm.hero?.title ??
                                  "Homepage",
                                eyebrow: event.target.value,
                              },
                            });
                          }}
                        />
                      </AdminField>
                      <AdminField label="Hero title*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={homepageForm.hero?.title ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              hero: {
                                ...homepageForm.hero,
                                title: event.target.value,
                              },
                            });
                          }}
                        />
                      </AdminField>
                    </div>
                    <AdminField label="Hero description">
                      <TextArea
                        className="admin-heroui-textarea"
                        value={homepageForm.hero?.description ?? ""}
                        onChange={(event) => {
                          setHomepageForm({
                            ...homepageForm,
                            hero: {
                              ...homepageForm.hero,
                              title:
                                homepageForm.hero?.title ??
                                defaultHomepageForm.hero?.title ??
                                "Homepage",
                              description: event.target.value,
                            },
                          });
                        }}
                      />
                    </AdminField>
                    <div className="admin-form-grid two">
                      <AdminField label="Primary button label">
                        <Input
                          className="admin-heroui-input"
                          value={homepageForm.hero?.primaryAction?.label ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              hero: {
                                ...homepageForm.hero,
                                title:
                                  homepageForm.hero?.title ??
                                  defaultHomepageForm.hero?.title ??
                                  "Homepage",
                                primaryAction: {
                                  href:
                                    homepageForm.hero?.primaryAction?.href ??
                                    "/products",
                                  label: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </AdminField>
                      <AdminField label="Primary button link">
                        <Input
                          className="admin-heroui-input"
                          value={homepageForm.hero?.primaryAction?.href ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              hero: {
                                ...homepageForm.hero,
                                title:
                                  homepageForm.hero?.title ??
                                  defaultHomepageForm.hero?.title ??
                                  "Homepage",
                                primaryAction: {
                                  label:
                                    homepageForm.hero?.primaryAction?.label ??
                                    "Shop products",
                                  href: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </AdminField>
                    </div>
                    <div className="admin-form-grid two">
                      <AdminField label="Promo title*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={homepageForm.promoBanner?.title ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              promoBanner: {
                                ...homepageForm.promoBanner,
                                title: event.target.value,
                              },
                            });
                          }}
                        />
                      </AdminField>
                      <AdminField label="Promo link">
                        <Input
                          className="admin-heroui-input"
                          value={homepageForm.promoBanner?.action?.href ?? ""}
                          onChange={(event) => {
                            setHomepageForm({
                              ...homepageForm,
                              promoBanner: {
                                ...homepageForm.promoBanner,
                                title:
                                  homepageForm.promoBanner?.title ??
                                  defaultHomepageForm.promoBanner?.title ??
                                  "Promo",
                                action: {
                                  label:
                                    homepageForm.promoBanner?.action?.label ??
                                    "Explore offers",
                                  href: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </AdminField>
                    </div>
                    <AdminField label="Promo description">
                      <TextArea
                        className="admin-heroui-textarea"
                        value={homepageForm.promoBanner?.description ?? ""}
                        onChange={(event) => {
                          setHomepageForm({
                            ...homepageForm,
                            promoBanner: {
                              ...homepageForm.promoBanner,
                              title:
                                homepageForm.promoBanner?.title ??
                                defaultHomepageForm.promoBanner?.title ??
                                "Promo",
                              description: event.target.value,
                            },
                          });
                        }}
                      />
                    </AdminField>
                    <RepeaterFields
                      title="Metrics"
                      firstLabel="Value"
                      secondLabel="Label"
                      items={homepageForm.metrics ?? []}
                      onChange={(metrics) => {
                        setHomepageForm({ ...homepageForm, metrics });
                      }}
                    />
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
                      {updateHomepageMutation.isPending
                        ? "Saving..."
                        : "Save homepage config"}
                    </Button>
                    {updateHomepageMutation.error ? (
                      <p className="form-error">
                        {updateHomepageMutation.error.message}
                      </p>
                    ) : null}
                  </form>
                </CardBody>
              </Card>

              <Card className="dashboard-card">
                <CardBody>
                  <div className="admin-form-head">
                    <span className="dashboard-metric-icon">
                      <MessageSquareQuote size={18} />
                    </span>
                    <div>
                      <h2>Testimonials</h2>
                      <p className="form-muted">
                        Add customer quotes and control which ones appear
                        publicly.
                      </p>
                    </div>
                  </div>
                  <form
                    className="admin-modern-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createTestimonialMutation.mutate(testimonialForm);
                    }}
                  >
                    <div className="admin-form-grid two">
                      <AdminField label="Customer name*">
                        <Input
                          className="admin-heroui-input"
                          required
                          value={testimonialForm.customerName}
                          onChange={(event) => {
                            setTestimonialForm({
                              ...testimonialForm,
                              customerName: event.target.value,
                            });
                          }}
                        />
                      </AdminField>
                      <AdminField label="Rating*">
                        <Input
                          className="admin-heroui-input"
                          type="number"
                          min={1}
                          max={5}
                          required
                          value={String(testimonialForm.rating)}
                          onChange={(event) => {
                            setTestimonialForm({
                              ...testimonialForm,
                              rating: Number(event.target.value),
                            });
                          }}
                        />
                      </AdminField>
                    </div>
                    <AdminField label="Quote*">
                      <TextArea
                        className="admin-heroui-textarea"
                        required
                        value={testimonialForm.quote}
                        onChange={(event) => {
                          setTestimonialForm({
                            ...testimonialForm,
                            quote: event.target.value,
                          });
                        }}
                      />
                    </AdminField>
                    <div className="admin-form-grid two">
                      <AdminField label="Sort order">
                        <Input
                          className="admin-heroui-input"
                          type="number"
                          value={String(testimonialForm.sortOrder)}
                          onChange={(event) => {
                            setTestimonialForm({
                              ...testimonialForm,
                              sortOrder: Number(event.target.value),
                            });
                          }}
                        />
                      </AdminField>
                      <AdminSwitch
                        className="inline"
                        isSelected={testimonialForm.isActive}
                        onChange={(isSelected) => {
                          setTestimonialForm({
                            ...testimonialForm,
                            isActive: isSelected,
                          });
                        }}
                      >
                        Show on homepage
                      </AdminSwitch>
                    </div>
                    <Button
                      type="submit"
                      tone="primary"
                      disabled={createTestimonialMutation.isPending}
                    >
                      {createTestimonialMutation.isPending
                        ? "Adding..."
                        : "Add testimonial"}
                    </Button>
                    {createTestimonialMutation.error ? (
                      <p className="form-error">
                        {createTestimonialMutation.error.message}
                      </p>
                    ) : null}
                  </form>

                  <ul
                    className="admin-list admin-inline-list"
                    style={{ marginTop: "1rem" }}
                  >
                    {(testimonialsQuery.data ?? []).map((testimonial) => (
                      <li key={testimonial._id}>
                        <div>
                          <strong>{testimonial.customerName}</strong>
                          <small>
                            {testimonial.rating}/5 ·{" "}
                            {testimonial.isActive ? "Active" : "Hidden"}
                          </small>
                          <small>{testimonial.quote}</small>
                        </div>
                        <div className="admin-row-actions">
                          <Button
                            iconOnly
                            tone={testimonial.isActive ? "secondary" : "ghost"}
                            title={
                              testimonial.isActive
                                ? "Hide testimonial"
                                : "Show testimonial"
                            }
                            disabled={updateTestimonialMutation.isPending}
                            onClick={() => {
                              updateTestimonialMutation.mutate({
                                testimonialId: testimonial._id,
                                input: {
                                  isActive: !(testimonial.isActive ?? true),
                                },
                              });
                            }}
                            startContent={
                              testimonial.isActive ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )
                            }
                          >
                            Toggle visibility
                          </Button>
                          <Button
                            iconOnly
                            tone="ghost"
                            title="Delete testimonial"
                            disabled={deleteTestimonialMutation.isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete testimonial from ${testimonial.customerName}?`,
                                )
                              ) {
                                deleteTestimonialMutation.mutate(
                                  testimonial._id,
                                );
                              }
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
                      </li>
                    ))}
                    {testimonialsQuery.data &&
                    testimonialsQuery.data.length === 0 ? (
                      <li className="admin-empty-row">
                        <p className="form-muted">No testimonials yet.</p>
                      </li>
                    ) : null}
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* ── Users ─────────────────────────────────────────────────────── */}
        {activePanel === "users" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <div>
                <h3 style={{ margin: 0 }}>User management</h3>
                <p
                  style={{
                    color: "var(--color-midas-gray)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  View, search, block, or unblock registered customers.
                </p>
              </div>
            </div>

            <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
              <CardBody>
                <div className="admin-card-head">
                  <h2>All users</h2>
                  <input
                    placeholder="Search users…"
                    value={userFilter}
                    onChange={(event) => {
                      setUserFilter(event.target.value);
                    }}
                  />
                </div>

                {usersQuery.isLoading ? (
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : null}

                <ul className="admin-list">
                  {(usersQuery.data ?? []).map((user) => (
                    <li key={user.id}>
                      <div>
                        <strong>{user.name}</strong>
                        <small>
                          {user.email} · {user.role} · {user.status}
                        </small>
                      </div>
                      <Button
                        tone={user.status === "blocked" ? "secondary" : "ghost"}
                        disabled={updateUserMutation.isPending}
                        onClick={() => {
                          updateUserMutation.mutate({
                            userId: user.id,
                            status:
                              user.status === "active" ? "blocked" : "active",
                          });
                        }}
                      >
                        {user.status === "active" ? "Block" : "Unblock"}
                      </Button>
                    </li>
                  ))}
                </ul>
                {usersQuery.data && usersQuery.data.length === 0 && (
                  <p className="form-muted">No users found.</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── Orders ────────────────────────────────────────────────────── */}
        {activePanel === "orders" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <div>
                <h3 style={{ margin: 0 }}>Order management</h3>
                <p
                  style={{
                    color: "var(--color-midas-gray)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Update fulfilment statuses and monitor the order pipeline.
                </p>
              </div>
            </div>

            <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
              <CardBody>
                <div className="admin-card-head">
                  <h2>All orders</h2>
                  <select
                    aria-label="Filter orders by status"
                    value={orderStatusFilter}
                    onChange={(event) => {
                      setOrderStatusFilter(event.target.value);
                    }}
                  >
                    <option value="">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {ordersQuery.isLoading ? (
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : null}

                <ul className="admin-list">
                  {(ordersQuery.data ?? []).map((order) => (
                    <li key={order.id}>
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <small>
                          {order.customerName} · {order.status} ·{" "}
                          {order.currency} {order.total.toLocaleString("en-BD")}
                        </small>
                      </div>
                      <select
                        aria-label={`Update status for ${order.orderNumber}`}
                        value={order.status}
                        onChange={(event) => {
                          updateOrderMutation.mutate({
                            orderId: order.id,
                            status: event.target.value,
                          });
                        }}
                        disabled={updateOrderMutation.isPending}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
                {ordersQuery.data && ordersQuery.data.length === 0 && (
                  <p className="form-muted">No orders found.</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── Carousel ──────────────────────────────────────────────────── */}
        {activePanel === "carousel" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <div>
                <h3 style={{ margin: 0 }}>Homepage carousel</h3>
                <p
                  style={{
                    color: "var(--color-midas-gray)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Upload, reorder, or remove banner slides shown on the
                  storefront.
                </p>
              </div>
            </div>

            <div
              className="admin-carousel-grid"
              style={{ marginTop: "1.5rem" }}
            >
              {/* Add Slide Form */}
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Add carousel slide</h2>
                  <form
                    className="auth-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("image", file);
                      formData.append("linkHref", slideForm.linkHref);
                      if (slideForm.title)
                        formData.append("title", slideForm.title);
                      if (slideForm.description)
                        formData.append("description", slideForm.description);
                      if (slideForm.imageAlt)
                        formData.append("imageAlt", slideForm.imageAlt);
                      formData.append("sortOrder", String(slideForm.sortOrder));

                      createSlideMutation.mutate(formData);
                    }}
                  >
                    <label>
                      <span>Select Image* (max 5 MB)</span>
                      <input
                        id="slide-file-input"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0] ?? null;
                          setFile(selectedFile);
                          if (selectedFile && !slideForm.imageAlt) {
                            setSlideForm({
                              ...slideForm,
                              imageAlt:
                                selectedFile.name.split(".")[0] ??
                                "slide-image",
                            });
                          }
                        }}
                      />
                    </label>

                    <label>
                      <span>Image Alt Text*</span>
                      <input
                        type="text"
                        required
                        value={slideForm.imageAlt}
                        onChange={(event) => {
                          setSlideForm({
                            ...slideForm,
                            imageAlt: event.target.value,
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Destination link* (e.g. /products/slug)</span>
                      <input
                        type="text"
                        required
                        placeholder="/products"
                        value={slideForm.linkHref}
                        onChange={(event) => {
                          setSlideForm({
                            ...slideForm,
                            linkHref: event.target.value,
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Title (optional)</span>
                      <input
                        type="text"
                        value={slideForm.title}
                        onChange={(event) => {
                          setSlideForm({
                            ...slideForm,
                            title: event.target.value,
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Description (optional)</span>
                      <textarea
                        style={{
                          width: "100%",
                          minHeight: "4.5rem",
                          border: "1px solid var(--color-midas-border)",
                          borderRadius: "0.9rem",
                          padding: "0.5rem 0.9rem",
                          font: "inherit",
                        }}
                        value={slideForm.description}
                        onChange={(event) => {
                          setSlideForm({
                            ...slideForm,
                            description: event.target.value,
                          });
                        }}
                      />
                    </label>

                    <label>
                      <span>Sort order</span>
                      <input
                        type="number"
                        value={slideForm.sortOrder}
                        onChange={(event) => {
                          setSlideForm({
                            ...slideForm,
                            sortOrder: Number(event.target.value),
                          });
                        }}
                      />
                    </label>

                    <Button
                      type="submit"
                      tone="primary"
                      disabled={createSlideMutation.isPending || !file}
                    >
                      {createSlideMutation.isPending
                        ? "Uploading…"
                        : "Add slide"}
                    </Button>
                    {createSlideMutation.error ? (
                      <p className="form-error">
                        {createSlideMutation.error.message}
                      </p>
                    ) : null}
                  </form>
                </CardBody>
              </Card>

              {/* Current Slides */}
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Current slides ({(carouselQuery.data ?? []).length})</h2>
                  {carouselQuery.isLoading ? (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ) : null}
                  {carouselQuery.data && carouselQuery.data.length > 0 ? (
                    <ul className="admin-list" style={{ gap: "1rem" }}>
                      {carouselQuery.data.map((slide) => (
                        <li
                          key={slide.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "0.75rem",
                            border: "1px solid var(--color-midas-border)",
                            borderRadius: "0.9rem",
                            background: "#ffffff",
                          }}
                        >
                          <img
                            src={slide.image.url}
                            alt={slide.image.alt}
                            style={{
                              width: "70px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "0.4rem",
                              border: "1px solid var(--color-midas-border)",
                            }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <strong
                                style={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {slide.title ?? "Untitled Slide"}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--color-midas-gray)",
                                }}
                              >
                                #{slide.sortOrder}
                              </span>
                            </div>
                            <small
                              style={{
                                display: "block",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                color: "var(--color-midas-gray)",
                              }}
                            >
                              {slide.linkHref}
                            </small>
                          </div>
                          <div
                            style={{ display: "inline-flex", gap: "0.25rem" }}
                          >
                            <Button
                              iconOnly
                              tone={slide.isActive ? "secondary" : "ghost"}
                              title={slide.isActive ? "Deactivate" : "Activate"}
                              disabled={toggleSlideMutation.isPending}
                              onClick={() => {
                                toggleSlideMutation.mutate({
                                  slideId: slide.id,
                                  isActive: !slide.isActive,
                                });
                              }}
                              startContent={
                                slide.isActive ? (
                                  <Eye size={16} />
                                ) : (
                                  <EyeOff size={16} />
                                )
                              }
                            >
                              Toggle visibility
                            </Button>
                            <Button
                              iconOnly
                              tone="ghost"
                              title="Delete slide"
                              disabled={deleteSlideMutation.isPending}
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this slide?",
                                  )
                                ) {
                                  deleteSlideMutation.mutate(slide.id);
                                }
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
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="form-muted">
                      No slides found. Upload one to get started.
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
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
