import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { getStoredAccessToken } from "../auth/auth-api.js";
import { getWishlist, removeWishlistItem } from "./wishlist-api.js";

export function WishlistPage(): ReactNode {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(getStoredAccessToken());
  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return (
    <main className="page-shell wishlist-page">
      <section className="section-heading catalog-heading">
        <h3 style={{ margin: 0 }}>Wishlist</h3>
        <p style={{ color: "var(--color-midas-gray)", margin: "0.25rem 0 0" }}>
          Saved products persist for signed-in customers.
        </p>
      </section>

      {!isAuthenticated ? (
        <p className="form-muted">Log in to use your persistent wishlist.</p>
      ) : null}

      {wishlistQuery.isLoading ? (
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      ) : null}

      {wishlistQuery.error ? (
        <p className="form-error">Unable to load wishlist.</p>
      ) : null}

      {isAuthenticated && !wishlistQuery.isLoading ? (
        <div style={{ marginTop: "1rem" }}>
          <Card className="wishlist-card">
            <CardBody>
              {wishlistQuery.data && wishlistQuery.data.length > 0 ? (
                <ul className="wishlist-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {wishlistQuery.data.map((item) => (
                    <li key={item.productId} className="wishlist-row">
                      <div>
                        <strong>{item.productId}</strong>
                        <small>
                          Saved{" "}
                          {new Date(item.addedAt).toLocaleDateString("en-BD")}
                        </small>
                      </div>
                      <Button
                        iconOnly
                        tone="ghost"
                        aria-label="Remove from wishlist"
                        disabled={removeMutation.isPending}
                        onClick={() => { removeMutation.mutate(item.productId); }}
                        startContent={<Trash2 size={16} />}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="wishlist-empty-state">
                  <Heart size={24} />
                  <p>No saved products yet. Add items from product cards.</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      ) : null}
    </main>
  );
}

