import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import type { WishlistItem } from "../wishlist/wishlist-api.js";

export function WishlistPanel({
  isLoading,
  items,
}: Readonly<{
  isLoading: boolean;
  items: WishlistItem[];
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <h3>Wishlist</h3>
        <p>Your saved favorites. Add them to your cart directly from here.</p>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <h2>Saved Items</h2>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && items.length > 0 ? (
            <ul className="dashboard-invoice-list">
              {items.map((item) => (
                <li key={item.productId}>
                  <div>
                    <strong>Product ID: {item.productId}</strong>
                    <small>
                      Saved {new Date(item.addedAt).toLocaleDateString("en-BD")}
                    </small>
                  </div>
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
                </li>
              ))}
            </ul>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="admin-empty-state">
              <Heart size={28} />
              <p style={{ margin: 0 }}>Your wishlist is empty.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
