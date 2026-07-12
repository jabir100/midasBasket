import type { AdminOrderDetail } from "./admin-api.js";

export function printInvoice(order: AdminOrderDetail): void {
  const printWindow = window.open("", "_blank", "width=820,height=1000");

  if (!printWindow) {
    return;
  }

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.title)}</td>
          <td class="num">${String(item.quantity)}</td>
          <td class="num">${order.currency} ${item.unitPrice.toLocaleString("en-BD")}</td>
          <td class="num">${order.currency} ${item.lineTotal.toLocaleString("en-BD")}</td>
        </tr>`,
    )
    .join("");

  printWindow.document.documentElement.innerHTML = `
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${escapeHtml(order.orderNumber)}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: "Segoe UI", Arial, sans-serif; color: #101010; padding: 2.5rem; }
          h1 { font-size: 1.4rem; margin: 0 0 0.25rem; }
          .muted { color: #667085; }
          .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
          .brand { font-size: 1.3rem; font-weight: 800; color: #8b1018; }
          .section { margin-bottom: 1.5rem; }
          .section h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; color: #667085; margin: 0 0 0.4rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
          th, td { padding: 0.5rem 0.6rem; border-bottom: 1px solid #eceff3; text-align: left; font-size: 0.9rem; }
          th { background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #667085; }
          td.num, th.num { text-align: right; }
          .totals { width: 280px; margin-left: auto; margin-top: 1rem; }
          .totals div { display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.9rem; }
          .totals .grand { font-weight: 800; font-size: 1.05rem; border-top: 1px solid #101010; margin-top: 0.4rem; padding-top: 0.5rem; }
          @media print { body { padding: 1rem; } }
        </style>
      </head>
      <body>
        <div class="head">
          <div>
            <div class="brand">Midas Basket</div>
            <p class="muted">Invoice for order ${escapeHtml(order.orderNumber)}</p>
          </div>
          <div style="text-align:right">
            <p class="muted">Issued</p>
            <strong>${order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</strong>
          </div>
        </div>

        <div class="section">
          <h2>Customer</h2>
          <p>${escapeHtml(order.customerName)}<br />${escapeHtml(order.customerEmail)}<br />${escapeHtml(order.customerPhone)}</p>
        </div>

        <div class="section">
          <h2>Shipping address</h2>
          <p>
            ${escapeHtml(order.shippingAddress.line1)}<br />
            ${order.shippingAddress.line2 ? `${escapeHtml(order.shippingAddress.line2)}<br />` : ""}
            ${escapeHtml(order.shippingAddress.area)}, ${escapeHtml(order.shippingAddress.city)}<br />
            ${order.shippingAddress.postalCode ? `${escapeHtml(order.shippingAddress.postalCode)}<br />` : ""}
            ${escapeHtml(order.shippingAddress.country)}
          </p>
        </div>

        <div class="section">
          <h2>Items</h2>
          <table>
            <thead>
              <tr><th>Item</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Line total</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal</span><span>${order.currency} ${order.subTotal.toLocaleString("en-BD")}</span></div>
            <div><span>Discount</span><span>-${order.currency} ${order.discountTotal.toLocaleString("en-BD")}</span></div>
            <div><span>Delivery</span><span>${order.currency} ${order.shippingFee.toLocaleString("en-BD")}</span></div>
            <div class="grand"><span>Total</span><span>${order.currency} ${order.total.toLocaleString("en-BD")}</span></div>
          </div>
        </div>

        <p class="muted">Payment method: ${escapeHtml(order.paymentMethod)} &middot; Payment status: ${escapeHtml(order.paymentStatus)}</p>
      </body>
  `;

  printWindow.focus();
  printWindow.print();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
