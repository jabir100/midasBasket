import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  LogOut,
  Package,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import type { AdminPanel } from "./admin-types.js";

export type AdminNavCounts = Partial<Record<AdminPanel, number>>;

export function AdminShell({
  activePanel,
  adminName,
  children,
  isLoggingOut,
  navCounts,
  onLogout,
  onSelectPanel,
}: Readonly<{
  activePanel: AdminPanel | null;
  adminName: string;
  children: ReactNode;
  isLoggingOut: boolean;
  navCounts: AdminNavCounts;
  onLogout: () => void;
  onSelectPanel: (panel: AdminPanel) => void;
}>): ReactNode {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems: { id: AdminPanel; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid size={18} /> },
    { id: "products", label: "Products", icon: <Package size={18} /> },
    { id: "categories", label: "Categories", icon: <Tags size={18} /> },
    { id: "brands", label: "Brands", icon: <BadgeCheck size={18} /> },
    { id: "homepage", label: "Homepage", icon: <Home size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  ];

  return (
    <div className="dashboard-wrapper">
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

        <div className="sidebar-brand">
          <span className="sidebar-brand-symbol">M</span>
          {!isSidebarCollapsed && <span>Midas Portal</span>}
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {navItems.map((item) => {
            const badge = navCounts[item.id];
            return (
              <Link
                key={item.id}
                to="/admin"
                onClick={() => {
                  onSelectPanel(item.id);
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
                    {badge !== undefined && badge > 0 && (
                      <span className="admin-nav-badge">{badge}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
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
