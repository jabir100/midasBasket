import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BellRing, FileText, Home, ShoppingBag, UserRound } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import { listMyOrders } from "../orders/orders-api.js";
import { getWishlist } from "../wishlist/wishlist-api.js";
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
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
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
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });

  const profile = profileQuery.data;

  return (
    <main className="page-shell customer-dashboard-page">
      <section className="section-heading catalog-heading">
        <span className="eyebrow">Phase 9</span>
        <h1>Customer dashboard</h1>
        <p>
          Manage profile, addresses, notifications, invoices, and review your account activity in one place.
        </p>
      </section>

      <section className="dashboard-metrics-grid">
        <MetricCard
          label="Orders"
          value={profile?.summary.ordersCount ?? ordersQuery.data?.length ?? 0}
          icon={<ShoppingBag size={18} />}
        />
        <MetricCard
          label="Wishlist"
          value={profile?.summary.wishlistItems ?? wishlistQuery.data?.length ?? 0}
          icon={<Home size={18} />}
        />
        <MetricCard
          label="Addresses"
          value={profile?.summary.addressesCount ?? addressesQuery.data?.length ?? 0}
          icon={<UserRound size={18} />}
        />
        <MetricCard
          label="Invoices"
          value={invoicesQuery.data?.length ?? 0}
          icon={<FileText size={18} />}
        />
      </section>

      <section className="dashboard-grid-two">
        <Card className="dashboard-card">
          <CardBody>
            <h2>Profile</h2>
            <form
              className="auth-form"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const payload = {
                  ...(profileForm.name ? { name: profileForm.name } : {}),
                  ...(profileForm.phone ? { phone: profileForm.phone } : {}),
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
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  defaultValue={profile?.user.phone ?? ""}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </label>
              <Button type="submit" tone="secondary" disabled={updateProfileMutation.isPending}>
                Save profile
              </Button>
              {updateProfileMutation.error ? (
                <p className="form-error">{updateProfileMutation.error.message}</p>
              ) : null}
            </form>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <h2>Notification preferences</h2>
            {notificationsQuery.data ? (
              <div className="dashboard-preferences">
                {Object.entries(notificationsQuery.data).map(([key, value]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(event) =>
                        updateNotificationsMutation.mutate({ [key]: event.target.checked })
                      }
                    />
                    <span>{toPreferenceLabel(key)}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="form-muted">Loading preferences...</p>
            )}
            {updateNotificationsMutation.isPending ? (
              <p className="form-muted">Saving preferences...</p>
            ) : null}
            {updateNotificationsMutation.error ? (
              <p className="form-error">{updateNotificationsMutation.error.message}</p>
            ) : null}
            <p className="dashboard-helper-row">
              <BellRing size={16} /> Transaction notifications stay enabled by default.
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="dashboard-grid-two">
        <Card className="dashboard-card">
          <CardBody>
            <h2>Saved addresses</h2>
            <form
              className="auth-form"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                createAddressMutation.mutate(addressForm);
              }}
            >
              <label>
                <span>Label</span>
                <input
                  required
                  value={addressForm.label}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, label: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Address line</span>
                <input
                  required
                  value={addressForm.line1}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, line1: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Area</span>
                <input
                  required
                  value={addressForm.area}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, area: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>City</span>
                <input
                  required
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, city: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Country</span>
                <input
                  required
                  value={addressForm.country}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, country: event.target.value }))
                  }
                />
              </label>
              <Button type="submit" tone="secondary" disabled={createAddressMutation.isPending}>
                Add address
              </Button>
            </form>
            <ul className="dashboard-address-list">
              {(addressesQuery.data ?? []).map((address) => (
                <li key={address.id}>
                  <div>
                    <strong>{address.label}</strong>
                    <small>
                      {address.line1}, {address.area}, {address.city}, {address.country}
                    </small>
                  </div>
                  <Button
                    tone="ghost"
                    onClick={() => deleteAddressMutation.mutate(address.id)}
                    disabled={deleteAddressMutation.isPending}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <h2>Invoices</h2>
            <ul className="dashboard-invoice-list">
              {(invoicesQuery.data ?? []).map((invoice) => (
                <li key={invoice.id}>
                  <div>
                    <strong>{invoice.invoiceNumber}</strong>
                    <small>
                      {invoice.orderNumber} · {invoice.status} · {invoice.paymentStatus}
                    </small>
                  </div>
                  <span>
                    {invoice.currency} {invoice.total.toLocaleString("en-BD")}
                  </span>
                </li>
              ))}
            </ul>
            {invoicesQuery.data && invoicesQuery.data.length === 0 ? (
              <p className="form-muted">No invoices generated yet.</p>
            ) : null}
            <p className="form-link">
              Need order details? <Link to="/orders">Open order tracking</Link>
            </p>
          </CardBody>
        </Card>
      </section>
    </main>
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
