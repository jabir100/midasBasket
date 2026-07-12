import { ArrowDown, ArrowUp, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "../../shared/ui/button.js";
import type { AdminProduct } from "./admin-api.js";
import { AdminSearchInput } from "./admin-form-controls.js";

export function ProductPicker({
  allProducts,
  onChange,
  selectedIds,
}: Readonly<{
  allProducts: AdminProduct[];
  onChange: (ids: string[]) => void;
  selectedIds: string[];
}>): ReactNode {
  const [search, setSearch] = useState("");

  const selectedProducts = selectedIds
    .map((id) => allProducts.find((product) => product._id === id))
    .filter((product): product is AdminProduct => Boolean(product));

  const searchResults =
    search.trim().length === 0
      ? []
      : allProducts
          .filter(
            (product) =>
              !selectedIds.includes(product._id) &&
              (product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.sku.toLowerCase().includes(search.toLowerCase())),
          )
          .slice(0, 8);

  function addProduct(productId: string): void {
    onChange([...selectedIds, productId]);
    setSearch("");
  }

  function removeProduct(productId: string): void {
    onChange(selectedIds.filter((id) => id !== productId));
  }

  function moveProduct(index: number, direction: -1 | 1): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedIds.length) return;

    const next = [...selectedIds];
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(targetIndex, 0, moved);
    onChange(next);
  }

  return (
    <div className="admin-product-picker">
      <div className="admin-product-picker-search">
        <AdminSearchInput
          icon={<Search size={16} />}
          placeholder="Search products by name or SKU to add"
          value={search}
          onChange={setSearch}
        />
        {searchResults.length > 0 ? (
          <ul className="admin-product-picker-results">
            {searchResults.map((product) => (
              <li key={product._id}>
                <button
                  type="button"
                  onClick={() => {
                    addProduct(product._id);
                  }}
                >
                  {product.images[0]?.url ? (
                    <img src={product.images[0].url} alt="" />
                  ) : null}
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.sku}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {selectedProducts.length > 0 ? (
        <ol className="admin-product-picker-list">
          {selectedProducts.map((product, index) => (
            <li key={product._id}>
              {product.images[0]?.url ? (
                <img src={product.images[0].url} alt="" />
              ) : null}
              <span className="admin-product-picker-name">
                <strong>{product.name}</strong>
                <small>{product.sku}</small>
              </span>
              <div className="admin-row-actions">
                <Button
                  iconOnly
                  tone="ghost"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => {
                    moveProduct(index, -1);
                  }}
                  startContent={<ArrowUp size={14} />}
                >
                  Move up
                </Button>
                <Button
                  iconOnly
                  tone="ghost"
                  title="Move down"
                  disabled={index === selectedProducts.length - 1}
                  onClick={() => {
                    moveProduct(index, 1);
                  }}
                  startContent={<ArrowDown size={14} />}
                >
                  Move down
                </Button>
                <Button
                  iconOnly
                  tone="ghost"
                  title="Remove"
                  onClick={() => {
                    removeProduct(product._id);
                  }}
                  startContent={
                    <X size={14} style={{ color: "var(--color-midas-red)" }} />
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="form-muted">No products selected yet.</p>
      )}
    </div>
  );
}
