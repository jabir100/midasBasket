import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "../ui/button.js";

const navItems = [
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/products", label: "Products" },
  { href: "/", label: "Offers" },
] as const;

export function AppShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <div className="app-root">
      <header className="site-header">
        <Link className="brand-mark" to="/" aria-label="Midas Basket home">
          <span className="brand-symbol">M</span>
          <span>Midas Basket</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.label} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Button iconOnly tone="ghost" aria-label="Search products">
            <Search size={20} />
          </Button>
          <Link
            to="/account"
            className="ui-button ui-button-ghost ui-button-icon"
            aria-label="Customer account"
          >
            <UserRound size={20} />
          </Link>
          <Button iconOnly tone="primary" aria-label="Shopping cart">
            <ShoppingBag size={20} />
          </Button>
          <Button
            iconOnly
            tone="ghost"
            aria-label="Open navigation"
            className="mobile-menu-button"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
