import { Link, useLocation } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Receipt,
  ShoppingBag,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const navItems: { to: string; label: string; icon: ReactNode }[] = [
  { to: "/dashboard", label: "Overview", icon: <LayoutGrid size={18} /> },
  { to: "/dashboard/profile", label: "Profile", icon: <User size={18} /> },
  { to: "/dashboard/addresses", label: "Addresses", icon: <MapPin size={18} /> },
  { to: "/dashboard/invoices", label: "Invoices", icon: <Receipt size={18} /> },
  { to: "/dashboard/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: <Heart size={18} /> },
];

export function DashboardShell({
  children,
  customerName,
  isLoggingOut,
  onLogout,
}: Readonly<{
  children: ReactNode;
  customerName?: string | undefined;
  isLoggingOut: boolean;
  onLogout: () => void;
}>): ReactNode {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();

  function isActive(itemPath: string): boolean {
    if (itemPath === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
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
          <img
            className="sidebar-brand-symbol"
            src="/favicon.png"
            alt="Midas Basket"
          />
          {!isSidebarCollapsed && <span>Dashboard</span>}
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-nav-btn ${isActive(item.to) ? "active" : ""}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

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
          {!isSidebarCollapsed && customerName && (
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
                Hi, <strong>{customerName}</strong>
              </p>
            </div>
          )}
          <button
            className="sidebar-nav-btn admin-logout-btn"
            title="Log out"
            disabled={isLoggingOut}
            onClick={onLogout}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <section className="dashboard-content-pane">{children}</section>
    </div>
  );
}
