import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@heroui/react";

import { getCurrentUser, getStoredAccessToken, logoutCustomer } from "../../features/auth/auth-api.js";
import { listProducts, type CatalogProduct } from "../../features/catalog/catalog-api.js";
import { getCart } from "../../features/cart/cart-api.js";
import { MobileDrawer } from "../ui/mobile-drawer.js";
import { SiteFooter } from "./site-footer.js";

export function AppShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = getStoredAccessToken();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const cartItemCount = cart?.summary.itemCount ?? 0;
  const cartBadgeLabel = cartItemCount > 99 ? "99+" : String(cartItemCount);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  // Debounced search logic for live results popup
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      void (async () => {
        setIsSearchLoading(true);
        try {
          const params = new URLSearchParams();
          params.set("search", searchQuery);
          params.set("limit", "5");
          const res = await listProducts(params);
          setSearchResults(res.products);
        } catch (err) {
          console.error("Live search failed:", err);
        } finally {
          setIsSearchLoading(false);
        }
      })();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Click outside to close live search popup and account menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isDashboardOrAdmin = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboardOrAdmin) {
    return (
      <div className="app-root dashboard-layout-root">
        {children}
      </div>
    );
  }

  const handleSearchSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPopup(false);
    void navigate({
      to: "/products",
      search: (prev) => ({
        ...prev,
        search: searchQuery.trim() || undefined,
      }),
    });
  };

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand-mark" to="/" aria-label="Midas Basket home">
            <img
              className="brand-logo"
              src="/logo_v2.png"
              alt="Midas Basket"
            />
          </Link>

          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <div className="nav-search-wrapper" ref={popupRef}>
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowPopup(true);
                }}
                onFocus={() => {
                  setShowPopup(true);
                }}
                placeholder="Search products..."
                aria-label="Search products"
                className="nav-search-input"
                autoComplete="off"
              />
              <button
                type="submit"
                className="nav-search-btn"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {showPopup && searchQuery.trim() && (
                <div className="nav-search-popup">
                  {isSearchLoading ? (
                    <div
                      style={{
                        padding: "1rem",
                        display: "grid",
                        gap: "0.5rem",
                      }}
                    >
                      <Skeleton className="h-6 w-full rounded" />
                      <Skeleton className="h-6 w-3/4 rounded" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="nav-search-results-list">
                      {searchResults.map((product) => (
                        <li
                          key={product._id}
                          className="nav-search-result-item"
                        >
                          <Link
                            to="/products/$slug"
                            params={{ slug: product.slug }}
                            onClick={() => {
                              setShowPopup(false);
                              setSearchQuery("");
                            }}
                            className="nav-search-result-link"
                          >
                            <div className="nav-search-result-media">
                              {product.images[0] ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.images[0].alt}
                                />
                              ) : (
                                <div className="media-placeholder">M</div>
                              )}
                            </div>
                            <div className="nav-search-result-info">
                              <span className="nav-search-result-name">
                                {product.name}
                              </span>
                              <span className="nav-search-result-price">
                                ৳{product.price.toLocaleString("en-BD")}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="nav-search-no-results">
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="header-actions">
            <Link
              to="/track"
              className="ui-button ui-button-ghost ui-button-icon"
              aria-label="Track order"
            >
              <Truck size={20} />
            </Link>

            <div className="user-menu-wrapper" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    className="ui-button ui-button-ghost ui-button-icon"
                    aria-label="Account menu"
                    aria-expanded={isUserMenuOpen}
                    onClick={() => {
                      setIsUserMenuOpen((open) => !open);
                    }}
                  >
                    <UserRound size={20} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="user-menu-dropdown">
                      <Link
                        to={user.role === "admin" ? "/admin" : "/dashboard"}
                        className="user-menu-item"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        className="user-menu-item"
                        disabled={logoutMutation.isPending}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logoutMutation.mutate();
                        }}
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="ui-button ui-button-ghost ui-button-icon"
                  aria-label="Log in"
                >
                  <UserRound size={20} />
                </Link>
              )}
            </div>

            <Link
              to="/cart"
              className="ui-button ui-button-primary ui-button-icon cart-nav-link"
              aria-label={
                cartItemCount > 0
                  ? `Shopping cart, ${cartBadgeLabel} item${cartItemCount === 1 ? "" : "s"}`
                  : "Shopping cart"
              }
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 ? (
                <span className="cart-count-badge">{cartBadgeLabel}</span>
              ) : null}
            </Link>

            <button
              type="button"
              className="ui-button ui-button-ghost ui-button-icon nav-menu-trigger"
              aria-label="Open menu"
              onClick={() => {
                setIsMobileMenuOpen(true);
              }}
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => {
          setIsMobileMenuOpen(false);
        }}
        side="right"
        title="Menu"
      >
        <form
          onSubmit={(e) => {
            handleSearchSubmit(e);
            setIsMobileMenuOpen(false);
          }}
          className="mobile-drawer-nav-search"
        >
          <div className="nav-search-wrapper">
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search products..."
              aria-label="Search products"
              className="nav-search-input"
              autoComplete="off"
            />
            <button type="submit" className="nav-search-btn" aria-label="Search">
              <Search size={18} />
            </button>
          </div>
        </form>

        <nav className="mobile-drawer-nav-list">
          <Link
            to="/track"
            className="mobile-drawer-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            <Truck size={18} />
            Track order
          </Link>

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="mobile-drawer-nav-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <hr className="mobile-drawer-nav-divider" />
              <button
                type="button"
                className="mobile-drawer-nav-link"
                disabled={logoutMutation.isPending}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logoutMutation.mutate();
                }}
              >
                <LogOut size={18} />
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-drawer-nav-link"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              <UserRound size={18} />
              Log in
            </Link>
          )}

          <Link
            to="/cart"
            className="mobile-drawer-nav-link"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            <ShoppingBag size={18} />
            Cart
            {cartItemCount > 0 ? (
              <span className="cart-count-pill">{cartBadgeLabel}</span>
            ) : null}
          </Link>
        </nav>
      </MobileDrawer>

      {children}
      <SiteFooter />
    </div>
  );
}

