import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Shield,
  Truck,
  Eye,
  EyeOff,
  Trash2,
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
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getCurrentUser, getStoredAccessToken, logoutCustomer } from "../auth/auth-api.js";
import { listCategories, listBrands } from "../catalog/catalog-api.js";
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
  type AdminProduct,
} from "./admin-api.js";

const statusOptions = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

type AdminPanel = "overview" | "users" | "orders" | "carousel" | "products";

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
      navigate({ to: "/login" });
    } else if (userQuery.data && userQuery.data.role !== "admin") {
      navigate({ to: "/" });
    }
  }, [token, userQuery.data, navigate]);

  const [activePanel, setActivePanel] = useState<AdminPanel>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [userFilter, setUserFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const summaryQuery = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminSummary,
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", userFilter],
    queryFn: () => listAdminUsers(userFilter ? { search: userFilter } : undefined),
    enabled: isAdmin,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", orderStatusFilter],
    queryFn: () => listAdminOrders(orderStatusFilter ? { status: orderStatusFilter } : undefined),
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
    queryFn: listCategories,
    enabled: isAdmin,
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listBrands,
    enabled: isAdmin,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "blocked" }) =>
      updateAdminUser(userId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "audit"] });
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
    },
  });

  const toggleProductPublishMutation = useMutation({
    mutationFn: ({ productId, isPublished }: { productId: string; isPublished: boolean }) =>
      updateAdminProduct(productId, { isPublished }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
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
      setSlideForm({ linkHref: "", title: "", description: "", imageAlt: "", sortOrder: 0 });
      setFile(null);
      const fileInput = document.getElementById("slide-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: deleteCarouselSlide,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
    },
  });

  const toggleSlideMutation = useMutation({
    mutationFn: ({ slideId, isActive }: { slideId: string; isActive: boolean }) =>
      toggleCarouselSlideActive(slideId, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "carousel"] });
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

  const adminName = userQuery.data?.name ?? "Admin";

  const navItems: { id: AdminPanel; label: string; icon: ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid size={18} /> },
    { id: "products", label: "Products", icon: <Package size={18} />, badge: (productsQuery.data ?? []).length },
    { id: "users", label: "Users", icon: <Users size={18} />, badge: (usersQuery.data ?? []).length },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} />, badge: (ordersQuery.data ?? []).length },
    { id: "carousel", label: "Carousel", icon: <Image size={18} />, badge: (carouselQuery.data ?? []).length },
  ];

  const filteredProducts = (productsQuery.data ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className={`dashboard-sidebar admin-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="sidebar-toggle-btn"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                  <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="admin-nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Identity & Logout at the bottom */}
        <div className="admin-sidebar-footer" style={{ borderTop: "1px solid var(--color-midas-border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {!isSidebarCollapsed && (
            <div className="admin-sidebar-identity" style={{ padding: "0 0.5rem" }}>
              <small className="admin-sidebar-role-label">Administration</small>
              <p className="admin-sidebar-name" style={{ margin: 0, fontSize: "0.85rem" }}>
                Hi, <strong>{adminName}</strong>
              </p>
            </div>
          )}
          
          {!isSidebarCollapsed && (
            <Link to="/" className="admin-sidebar-footer-link" style={{ fontSize: "0.8rem", color: "var(--color-midas-gray)" }}>
              ← Exit to store
            </Link>
          )}

          <button
            className="sidebar-nav-btn admin-logout-btn"
            title="Log out"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
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
                <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
                  Operational analytics, account management, order lifecycle, and homepage settings.
                </p>
              </div>
            </div>

            {summaryQuery.data ? (
              <section className="admin-summary-grid" style={{ marginTop: "1.5rem" }}>
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

            <Card className="dashboard-card admin-audit-card" style={{ marginTop: "2rem" }}>
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
            <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>Product management</h3>
                <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
                  Create, publish, edit, or delete items in the storefront catalog.
                </p>
              </div>
              <Button
                tone="primary"
                onClick={() => setShowAddProduct(!showAddProduct)}
                startContent={<Plus size={18} />}
              >
                {showAddProduct ? "View list" : "Add product"}
              </Button>
            </div>

            {showAddProduct ? (
              <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
                <CardBody>
                  <h2>Create New Product</h2>
                  <form
                    className="auth-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!productForm.categoryId || !productForm.brandId) {
                        alert("Please select category and brand.");
                        return;
                      }
                      createProductMutation.mutate(productForm);
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <label>
                        <span>Product Name*</span>
                        <input
                          required
                          value={productForm.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            setProductForm({ ...productForm, name, slug });
                          }}
                        />
                      </label>

                      <label>
                        <span>Slug* (automatic)</span>
                        <input
                          required
                          value={productForm.slug}
                          onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        />
                      </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                      <label>
                        <span>SKU*</span>
                        <input
                          required
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                        />
                      </label>

                      <label>
                        <span>Price (BDT)*</span>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        />
                      </label>

                      <label>
                        <span>Stock Quantity*</span>
                        <input
                          type="number"
                          required
                          value={productForm.stockQuantity}
                          onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                        />
                      </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <label>
                        <span>Category*</span>
                        <select
                          required
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          {(categoriesQuery.data ?? []).map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Brand*</span>
                        <select
                          required
                          value={productForm.brandId}
                          onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                        >
                          <option value="">Select Brand</option>
                          {(brandsQuery.data ?? []).map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label>
                      <span>Short Description</span>
                      <input
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Full Description* (min 20 chars)</span>
                      <textarea
                        required
                        style={{
                          width: "100%",
                          minHeight: "5rem",
                          border: "1px solid var(--color-midas-border)",
                          borderRadius: "0.9rem",
                          padding: "0.5rem 0.9rem",
                        }}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </label>

                    <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={productForm.isPublished}
                        onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                      />
                      <span>Publish immediately</span>
                    </label>

                    <Button type="submit" tone="primary" disabled={createProductMutation.isPending}>
                      {createProductMutation.isPending ? "Saving..." : "Create Product"}
                    </Button>
                    {createProductMutation.error && (
                      <p className="form-error">{createProductMutation.error.message}</p>
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
                      onChange={(e) => setProductSearch(e.target.value)}
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
                      <li key={product._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-midas-border)", paddingBottom: "0.75rem" }}>
                        <div>
                          <strong>{product.name}</strong>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-midas-gray)", display: "flex", gap: "0.75rem", marginTop: "0.2rem" }}>
                            <span>SKU: {product.sku}</span>
                            <span>Price: ৳{product.price}</span>
                            <span>Stock: {product.stockQuantity}</span>
                            <span style={{ color: product.isPublished ? "green" : "red", fontWeight: "bold" }}>
                              {product.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <Button
                            iconOnly
                            tone={product.isPublished ? "secondary" : "ghost"}
                            title={product.isPublished ? "Unpublish" : "Publish"}
                            disabled={toggleProductPublishMutation.isPending}
                            onClick={() =>
                              toggleProductPublishMutation.mutate({
                                productId: product._id,
                                isPublished: !product.isPublished,
                              })
                            }
                            startContent={product.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
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
                            startContent={<Trash2 size={16} style={{ color: "var(--color-midas-red)" }} />}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                    {filteredProducts.length === 0 && !productsQuery.isLoading && (
                      <p className="form-muted">No products match search criteria.</p>
                    )}
                  </ul>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* ── Users ─────────────────────────────────────────────────────── */}
        {activePanel === "users" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <div>
                <h3 style={{ margin: 0 }}>User management</h3>
                <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
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
                    onChange={(event) => setUserFilter(event.target.value)}
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
                            status: user.status === "active" ? "blocked" : "active",
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
                <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
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
                    onChange={(event) => setOrderStatusFilter(event.target.value)}
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
                          {order.customerName} · {order.status} · {order.currency}{" "}
                          {order.total.toLocaleString("en-BD")}
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
                <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
                  Upload, reorder, or remove banner slides shown on the storefront.
                </p>
              </div>
            </div>

            <div className="admin-carousel-grid" style={{ marginTop: "1.5rem" }}>
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
                      if (slideForm.title) formData.append("title", slideForm.title);
                      if (slideForm.description) formData.append("description", slideForm.description);
                      if (slideForm.imageAlt) formData.append("imageAlt", slideForm.imageAlt);
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
                              imageAlt: selectedFile.name.split(".")[0] ?? "slide-image",
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
                        onChange={(event) => setSlideForm({ ...slideForm, imageAlt: event.target.value })}
                      />
                    </label>

                    <label>
                      <span>Destination link* (e.g. /products/slug)</span>
                      <input
                        type="text"
                        required
                        placeholder="/products"
                        value={slideForm.linkHref}
                        onChange={(event) => setSlideForm({ ...slideForm, linkHref: event.target.value })}
                      />
                    </label>

                    <label>
                      <span>Title (optional)</span>
                      <input
                        type="text"
                        value={slideForm.title}
                        onChange={(event) => setSlideForm({ ...slideForm, title: event.target.value })}
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
                        onChange={(event) => setSlideForm({ ...slideForm, description: event.target.value })}
                      />
                    </label>

                    <label>
                      <span>Sort order</span>
                      <input
                        type="number"
                        value={slideForm.sortOrder}
                        onChange={(event) =>
                          setSlideForm({ ...slideForm, sortOrder: Number(event.target.value) })
                        }
                      />
                    </label>

                    <Button type="submit" tone="primary" disabled={createSlideMutation.isPending || !file}>
                      {createSlideMutation.isPending ? "Uploading…" : "Add slide"}
                    </Button>
                    {createSlideMutation.error ? (
                      <p className="form-error">{createSlideMutation.error.message}</p>
                    ) : null}
                    {createSlideMutation.isSuccess ? (
                      <p className="form-success">Slide uploaded successfully!</p>
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
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <strong
                                style={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {slide.title || "Untitled Slide"}
                              </strong>
                              <span style={{ fontSize: "0.75rem", color: "var(--color-midas-gray)" }}>
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
                          <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                            <Button
                              iconOnly
                              tone={slide.isActive ? "secondary" : "ghost"}
                              title={slide.isActive ? "Deactivate" : "Activate"}
                              disabled={toggleSlideMutation.isPending}
                              onClick={() =>
                                toggleSlideMutation.mutate({ slideId: slide.id, isActive: !slide.isActive })
                              }
                              startContent={slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                            >
                              Toggle visibility
                            </Button>
                            <Button
                              iconOnly
                              tone="ghost"
                              title="Delete slide"
                              disabled={deleteSlideMutation.isPending}
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this slide?")) {
                                  deleteSlideMutation.mutate(slide.id);
                                }
                              }}
                              startContent={
                                <Trash2 size={16} style={{ color: "var(--color-midas-red)" }} />
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="form-muted">No slides found. Upload one to get started.</p>
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
