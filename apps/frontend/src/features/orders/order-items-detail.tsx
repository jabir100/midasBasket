import type { ReactNode } from "react";

import type { OrderSummary } from "./orders-api.js";

export function OrderItemsDetail({
  currency,
  items,
}: Readonly<{
  currency: string;
  items: OrderSummary["items"];
}>): ReactNode {
  return (
    <ul className="order-items-detail">
      {items.map((item) => (
        <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}>
          <div className="order-item-thumb">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} />
            ) : (
              <div className="order-item-thumb-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="order-item-copy">
            <strong>{item.title}</strong>
            {item.size && item.color ? (
              <small className="admin-table-muted">
                {item.size} / {item.color}
              </small>
            ) : null}
          </div>
          <div className="order-item-qty">
            <small className="admin-table-muted">Qty</small>
            <span>{item.quantity}</span>
          </div>
          <div className="order-item-price">
            <small className="admin-table-muted">Unit price</small>
            <span>
              {currency} {item.unitPrice.toLocaleString("en-BD")}
            </span>
          </div>
          <div className="order-item-total">
            <small className="admin-table-muted">Line total</small>
            <strong>
              {currency} {item.lineTotal.toLocaleString("en-BD")}
            </strong>
          </div>
        </li>
      ))}
    </ul>
  );
}
