import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Receipt,
  LayoutGrid,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Skeleton, Toast } from "@heroui/react";
import type { ReactNode, SyntheticEvent } from "react";
import { useState, useEffect } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import { listMyOrders } from "../orders/orders-api.js";
import { getWishlist } from "../wishlist/wishlist-api.js";
import { getStoredAccessToken, logoutCustomer } from "../auth/auth-api.js";
import {
  createUserAddress,
  deleteUserAddress,
  getDashboardProfile,
  getNotificationPreferences,
  listInvoices,
  listUserAddresses,
  updateDashboardProfile,
  updateNotificationPreferences,
} from "./dashboard-api.js";

export function CustomerDashboardPage(): ReactNode {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    }
  }, [token, navigate]);

  const [activePanel, setActivePanel] = useState<
    "overview" | "profile" | "addresses" | "invoices" | "orders" | "wishlist"
  >("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    line1: "",
    area: "",
    city: "",
    country: "Bangladesh",
  });

  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: getDashboardProfile,
  });
  const addressesQuery = useQuery({
    queryKey: ["dashboard", "addresses"],
    queryFn: listUserAddresses,
  });
  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: getNotificationPreferences,
  });
  const invoicesQuery = useQuery({
    queryKey: ["dashboard", "invoices"],
    queryFn: listInvoices,
  });
  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: listMyOrders,
  });
  const wishlistQuery = useQuery({
    queryKey: ["wishlist", "items"],
    queryFn: getWishlist,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateDashboardProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "profile"],
      });
      Toast.toast.success("Profile updated");
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: async () => {
      setAddressForm({
        label: "Home",
        line1: "",
        area: "",
        city: "",
        country: "Bangladesh",
      });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "addresses"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "profile"],
      });
      Toast.toast.success("Address added");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "addresses"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "profile"],
      });
      Toast.toast.success("Address deleted");
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      });
      Toast.toast.success("Notification preferences updated");
    },
  });

  const profile = profileQuery.data;

  if (!token) {
    return null;
  }

  return (
    <div className="dashboard-wrapper">
      <aside
        className={`dashboard-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
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
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        <div className="sidebar-brand">
          <span className="sidebar-brand-symbol">M</span>
          {!isSidebarCollapsed && <span>Dashboard</span>}
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
          <button
            onClick={() => {
              setActivePanel("overview");
            }}
            className={`sidebar-nav-btn ${activePanel === "overview" ? "active" : ""}`}
          >
            <LayoutGrid size={18} />
            {!isSidebarCollapsed && <span>Overview</span>}
          </button>
          <button
            onClick={() => {
              setActivePanel("profile");
            }}
            className={`sidebar-nav-btn ${activePanel === "profile" ? "active" : ""}`}
          >
            <User size={18} />
            {!isSidebarCollapsed && <span>Profile</span>}
          </button>
          <button
            onClick={() => {
              setActivePanel("addresses");
            }}
            className={`sidebar-nav-btn ${activePanel === "addresses" ? "active" : ""}`}
          >
            <MapPin size={18} />
            {!isSidebarCollapsed && <span>Addresses</span>}
          </button>
          <button
            onClick={() => {
              setActivePanel("invoices");
            }}
            className={`sidebar-nav-btn ${activePanel === "invoices" ? "active" : ""}`}
          >
            <Receipt size={18} />
            {!isSidebarCollapsed && <span>Invoices</span>}
          </button>
          <button
            onClick={() => {
              setActivePanel("orders");
            }}
            className={`sidebar-nav-btn ${activePanel === "orders" ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            {!isSidebarCollapsed && <span>Orders</span>}
          </button>
          <button
            onClick={() => {
              setActivePanel("wishlist");
            }}
            className={`sidebar-nav-btn ${activePanel === "wishlist" ? "active" : ""}`}
          >
            <Heart size={18} />
            {!isSidebarCollapsed && <span>Wishlist</span>}
          </button>
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
          {!isSidebarCollapsed && profile && (
            <div
              className="admin-sidebar-identity"
              style={{ padding: "0 0.5rem" }}
            >
              <small
                className="admin-sidebar-role-label"
                style={{ color: "var(--color-midas-gray)" }}
              >
                Customer
              </small>
              <p
                className="admin-sidebar-name"
                style={{ margin: 0, fontSize: "0.85rem" }}
              >
                Hi, <strong>{profile.user.name}</strong>
              </p>
            </div>
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

      <section className="dashboard-content-pane">
        {activePanel === "overview" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>Overview</h3>
              <p>
                Hello, {profile?.user.name ?? "Customer"}. Here is your account
                snapshot.
              </p>
            </div>

            <section
              className="dashboard-metrics-grid"
              style={{ marginTop: "1.5rem" }}
            >
              <MetricCard
                label="Orders"
                value={
                  profile?.summary.ordersCount ?? ordersQuery.data?.length ?? 0
                }
                icon={<ShoppingBag size={18} />}
              />
              <MetricCard
                label="Wishlist"
                value={
                  profile?.summary.wishlistItems ??
                  wishlistQuery.data?.length ??
                  0
                }
                icon={<Heart size={18} />}
              />
              <MetricCard
                label="Addresses"
                value={
                  profile?.summary.addressesCount ??
                  addressesQuery.data?.length ??
                  0
                }
                icon={<MapPin size={18} />}
              />
              <MetricCard
                label="Invoices"
                value={invoicesQuery.data?.length ?? 0}
                icon={<Receipt size={18} />}
              />
            </section>
          </div>
        )}

        {activePanel === "profile" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>Profile & Settings</h3>
              <p>
                Update your personal information and communication preferences.
              </p>
            </div>

            <div className="dashboard-grid-two" style={{ marginTop: "1.5rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Personal Information</h2>
                  <form
                    className="auth-form"
                    onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const payload = {
                        ...(profileForm.name ? { name: profileForm.name } : {}),
                        ...(profileForm.phone
                          ? { phone: profileForm.phone }
                          : {}),
                      };
                      if (Object.keys(payload).length === 0) {
                        return;
                      }
                      updateProfileMutation.mutate(payload);
                    }}
                  >
                    <label>
                      <span>Name</span>
                      <input
                        defaultValue={profile?.user.name}
                        onChange={(event) => {
                          setProfileForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <label>
                      <span>Phone</span>
                      <input
                        defaultValue={profile?.user.phone ?? ""}
                        onChange={(event) => {
                          setProfileForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <Button
                      type="submit"
                      tone="secondary"
                      disabled={updateProfileMutation.isPending}
                    >
                      Save profile
                    </Button>
                    {updateProfileMutation.error ? (
                      <p className="form-error">
                        {updateProfileMutation.error.message}
                      </p>
                    ) : null}
                  </form>
                </CardBody>
              </Card>

              <Card className="dashboard-card">
                <CardBody>
                  <h2>Notification Settings</h2>
                  {notificationsQuery.data ? (
                    <div className="dashboard-preferences">
                      {Object.entries(notificationsQuery.data).map(
                        ([key, value]) => (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(event) => {
                                updateNotificationsMutation.mutate({
                                  [key]: event.target.checked,
                                });
                              }}
                            />
                            <span>{toPreferenceLabel(key)}</span>
                          </label>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="form-muted">Loading preferences...</p>
                  )}
                  {updateNotificationsMutation.isPending ? (
                    <p className="form-muted">Saving preferences...</p>
                  ) : null}
                  {updateNotificationsMutation.error ? (
                    <p className="form-error">
                      {updateNotificationsMutation.error.message}
                    </p>
                  ) : null}
                  <p className="dashboard-helper-row">
                    <Bell size={16} /> Transaction notifications stay enabled by
                    default.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activePanel === "addresses" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>Saved Addresses</h3>
              <p>
                Manage your delivery and billing locations for faster checkout.
              </p>
            </div>

            <div className="dashboard-grid-two" style={{ marginTop: "1.5rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Add New Address</h2>
                  <form
                    className="auth-form"
                    onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      createAddressMutation.mutate(addressForm);
                    }}
                  >
                    <label>
                      <span>Label</span>
                      <input
                        required
                        value={addressForm.label}
                        onChange={(event) => {
                          setAddressForm((current) => ({
                            ...current,
                            label: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <label>
                      <span>Address line</span>
                      <input
                        required
                        value={addressForm.line1}
                        onChange={(event) => {
                          setAddressForm((current) => ({
                            ...current,
                            line1: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <label>
                      <span>Area</span>
                      <input
                        required
                        value={addressForm.area}
                        onChange={(event) => {
                          setAddressForm((current) => ({
                            ...current,
                            area: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <label>
                      <span>City</span>
                      <input
                        required
                        value={addressForm.city}
                        onChange={(event) => {
                          setAddressForm((current) => ({
                            ...current,
                            city: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <label>
                      <span>Country</span>
                      <input
                        required
                        value={addressForm.country}
                        onChange={(event) => {
                          setAddressForm((current) => ({
                            ...current,
                            country: event.target.value,
                          }));
                        }}
                      />
                    </label>
                    <Button
                      type="submit"
                      tone="secondary"
                      disabled={createAddressMutation.isPending}
                    >
                      Add address
                    </Button>
                  </form>
                </CardBody>
              </Card>

              <Card className="dashboard-card">
                <CardBody>
                  <h2>Address List</h2>
                  <ul className="dashboard-address-list">
                    {(addressesQuery.data ?? []).map((address) => (
                      <li key={address.id}>
                        <div style={{ display: "grid", gap: "0.25rem" }}>
                          <strong>{address.label}</strong>
                          <small style={{ color: "var(--color-midas-gray)" }}>
                            {address.line1}, {address.area}, {address.city},{" "}
                            {address.country}
                          </small>
                        </div>
                        <Button
                          tone="ghost"
                          onClick={() => {
                            deleteAddressMutation.mutate(address.id);
                          }}
                          disabled={deleteAddressMutation.isPending}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {addressesQuery.data && addressesQuery.data.length === 0 ? (
                    <p className="form-muted">No addresses saved yet.</p>
                  ) : null}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activePanel === "invoices" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>Invoices</h3>
              <p>View and download invoices for your completed purchases.</p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Invoice Records</h2>
                  <ul className="dashboard-invoice-list">
                    {(invoicesQuery.data ?? []).map((invoice) => (
                      <li key={invoice.id}>
                        <div>
                          <strong>{invoice.invoiceNumber}</strong>
                          <small>
                            {invoice.orderNumber} · {invoice.status} ·{" "}
                            {invoice.paymentStatus}
                          </small>
                        </div>
                        <span>
                          {invoice.currency}{" "}
                          {invoice.total.toLocaleString("en-BD")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {invoicesQuery.data && invoicesQuery.data.length === 0 ? (
                    <p className="form-muted">No invoices generated yet.</p>
                  ) : null}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activePanel === "orders" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>My Orders</h3>
              <p>
                Track history, payments, and dispatch statuses of your packages.
              </p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Recent Orders</h2>
                  {ordersQuery.isLoading ? (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ) : null}
                  <ul className="dashboard-invoice-list">
                    {(ordersQuery.data ?? []).map((order) => (
                      <li key={order.id}>
                        <div>
                          <strong>{order.orderNumber}</strong>
                          <small>
                            Status: {order.status} ·{" "}
                            {new Date(order.createdAt ?? "").toLocaleDateString(
                              "en-BD",
                            )}
                          </small>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong>
                            {order.totals.currency}{" "}
                            {order.totals.total.toLocaleString("en-BD")}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--color-midas-gray)",
                            }}
                          >
                            {order.paymentStatus}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {ordersQuery.data && ordersQuery.data.length === 0 ? (
                    <p className="form-muted">No orders placed yet.</p>
                  ) : null}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activePanel === "wishlist" && (
          <div className="dashboard-pane-content">
            <div className="section-heading">
              <h3>Wishlist</h3>
              <p>
                Your saved favorites. Add them to your cart directly from here.
              </p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Card className="dashboard-card">
                <CardBody>
                  <h2>Saved Items</h2>
                  {wishlistQuery.isLoading ? (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ) : null}
                  <ul className="dashboard-invoice-list">
                    {(wishlistQuery.data ?? []).map((item) => (
                      <li
                        key={item.productId}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>
                          <strong>Product ID: {item.productId}</strong>
                          <small
                            style={{
                              display: "block",
                              color: "var(--color-midas-gray)",
                            }}
                          >
                            Saved{" "}
                            {new Date(item.addedAt).toLocaleDateString("en-BD")}
                          </small>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Link
                            to="/products"
                            className="ui-button ui-button-secondary"
                            style={{
                              minHeight: "2rem",
                              padding: "0 0.75rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            Browse Products
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {wishlistQuery.data && wishlistQuery.data.length === 0 ? (
                    <p className="form-muted">Your wishlist is empty.</p>
                  ) : null}
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: Readonly<{ icon: ReactNode; label: string; value: number }>): ReactNode {
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

function toPreferenceLabel(value: string): string {
  return value
    .replaceAll(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}
