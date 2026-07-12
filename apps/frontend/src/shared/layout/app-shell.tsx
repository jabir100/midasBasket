import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound, LogOut } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../ui/button.js";
import { getCurrentUser, getStoredAccessToken, logoutCustomer } from "../../features/auth/auth-api.js";
import { listProducts, type CatalogProduct } from "../../features/catalog/catalog-api.js";

const publicNavItems = [
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/products", label: "Products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/track", label: "Track Order" },
] as const;

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
  const popupRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

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

    const timer = setTimeout(async () => {
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
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close live search popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    navigate({
      to: "/products",
      search: (prev: any) => ({
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
            <span className="brand-symbol">M</span>
            <span>Midas Basket</span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {publicNavItems.map((item) => (
              <Link key={item.label} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          
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
                onFocus={() => setShowPopup(true)}
                placeholder="Search products..."
                aria-label="Search products"
                className="nav-search-input"
                autoComplete="off"
              />
              <button type="submit" className="nav-search-btn" aria-label="Search">
                <Search size={18} />
              </button>

              {showPopup && searchQuery.trim() && (
                <div className="nav-search-popup">
                  {isSearchLoading ? (
                    <div style={{ padding: "1rem", display: "grid", gap: "0.5rem" }}>
                      <Skeleton className="h-6 w-full rounded" />
                      <Skeleton className="h-6 w-3/4 rounded" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="nav-search-results-list">
                      {searchResults.map((product) => (
                        <li key={product._id} className="nav-search-result-item">
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
                                <img src={product.images[0].url} alt={product.images[0].alt} />
                              ) : (
                                <div className="media-placeholder">M</div>
                              )}
                            </div>
                            <div className="nav-search-result-info">
                              <span className="nav-search-result-name">{product.name}</span>
                              <span className="nav-search-result-price">৳{product.price.toLocaleString("en-BD")}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="nav-search-no-results">No products found.</div>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="header-actions">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="ui-button ui-button-ghost ui-button-icon"
                  aria-label={user.role === "admin" ? "Admin dashboard" : "Customer dashboard"}
                >
                  <UserRound size={20} />
                </Link>
                <Button
                  iconOnly
                  tone="ghost"
                  aria-label="Log out"
                  disabled={logoutMutation.isPending}
                  onClick={() => { logoutMutation.mutate(); }}
                  startContent={<LogOut size={20} />}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Link to="/login" className="ui-button ui-button-secondary">
                Log in
              </Link>
            )}
            <Link
              to="/cart"
              className="ui-button ui-button-primary ui-button-icon"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
            </Link>
            <Button
              iconOnly
              tone="ghost"
              aria-label="Open navigation"
              className="mobile-menu-button"
              startContent={<Menu size={20} />}
            >
              Menu
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

