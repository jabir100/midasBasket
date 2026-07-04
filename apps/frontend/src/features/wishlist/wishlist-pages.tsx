import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

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
        <span className="eyebrow">Phase 7</span>
        <h1>Wishlist</h1>
        <p>Saved products persist for signed-in customers.</p>
      </section>

      {!isAuthenticated ? (
        <p className="form-muted">Log in to use your persistent wishlist.</p>
      ) : null}

      {wishlistQuery.isLoading ? <p>Loading wishlist...</p> : null}
      {wishlistQuery.error ? (
        <p className="form-error">Unable to load wishlist.</p>
      ) : null}

      {isAuthenticated && !wishlistQuery.isLoading ? (
        <Card className="wishlist-card">
          <CardBody>
            {wishlistQuery.data && wishlistQuery.data.length > 0 ? (
              <ul className="wishlist-list">
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
                      onClick={() => removeMutation.mutate(item.productId)}
                    >
                      <Trash2 size={16} />
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
      ) : null}
    </main>
  );
}
