import { useQuery } from "@tanstack/react-query";
import { Heart, MapPin, Receipt, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { listMyOrders } from "../orders/orders-api.js";
import { getWishlist } from "../wishlist/wishlist-api.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";
import {
  getDashboardProfile,
  listInvoices,
  listUserAddresses,
} from "./dashboard-api.js";

export function DashboardOverviewPage(): ReactNode {
  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: getDashboardProfile,
  });
  const addressesQuery = useQuery({
    queryKey: ["dashboard", "addresses"],
    queryFn: listUserAddresses,
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

  const profile = profileQuery.data;

  return (
    <DashboardPageShell>
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
            value={profile?.summary.ordersCount ?? ordersQuery.data?.length ?? 0}
            icon={<ShoppingBag size={18} />}
          />
          <MetricCard
            label="Wishlist"
            value={
              profile?.summary.wishlistItems ?? wishlistQuery.data?.length ?? 0
            }
            icon={<Heart size={18} />}
          />
          <MetricCard
            label="Addresses"
            value={
              profile?.summary.addressesCount ?? addressesQuery.data?.length ?? 0
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
    </DashboardPageShell>
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
