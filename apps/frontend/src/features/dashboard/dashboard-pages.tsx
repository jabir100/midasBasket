import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Receipt,
  LayoutGrid,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
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
import { ProfilePanel } from "./profile-panel.js";
import { AddressesPanel, type AddressForm } from "./addresses-panel.js";
import { InvoicesPanel } from "./invoices-panel.js";
import { MyOrdersPanel } from "./my-orders-panel.js";
import { WishlistPanel } from "./wishlist-panel.js";

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
  const [addressForm, setAddressForm] = useState<AddressForm>({
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
          <ProfilePanel
            profile={profile}
            onProfileFieldChange={(field, value) => {
              setProfileForm((current) => ({ ...current, [field]: value }));
            }}
            onProfileSubmit={() => {
              const payload = {
                ...(profileForm.name ? { name: profileForm.name } : {}),
                ...(profileForm.phone ? { phone: profileForm.phone } : {}),
              };
              if (Object.keys(payload).length === 0) {
                return;
              }
              updateProfileMutation.mutate(payload);
            }}
            isSavingProfile={updateProfileMutation.isPending}
            profileError={updateProfileMutation.error?.message ?? null}
            notifications={notificationsQuery.data}
            onNotificationChange={(key, value) => {
              updateNotificationsMutation.mutate({ [key]: value });
            }}
            isSavingNotifications={updateNotificationsMutation.isPending}
            notificationsError={updateNotificationsMutation.error?.message ?? null}
          />
        )}

        {activePanel === "addresses" && (
          <AddressesPanel
            addressForm={addressForm}
            onAddressFieldChange={(field, value) => {
              setAddressForm((current) => ({ ...current, [field]: value }));
            }}
            onCreateAddress={() => {
              createAddressMutation.mutate(addressForm);
            }}
            addresses={addressesQuery.data ?? []}
            isLoading={addressesQuery.isLoading}
            isCreating={createAddressMutation.isPending}
            isDeleting={deleteAddressMutation.isPending}
            onDeleteAddress={(addressId) => {
              deleteAddressMutation.mutate(addressId);
            }}
          />
        )}

        {activePanel === "invoices" && (
          <InvoicesPanel
            invoices={invoicesQuery.data ?? []}
            isLoading={invoicesQuery.isLoading}
          />
        )}

        {activePanel === "orders" && (
          <MyOrdersPanel
            orders={ordersQuery.data ?? []}
            isLoading={ordersQuery.isLoading}
          />
        )}

        {activePanel === "wishlist" && (
          <WishlistPanel
            items={wishlistQuery.data ?? []}
            isLoading={wishlistQuery.isLoading}
          />
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

