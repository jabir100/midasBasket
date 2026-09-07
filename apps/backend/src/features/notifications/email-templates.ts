import { env } from "../../core/config/env.js";

const BRAND_NAME = env.EMAIL_FROM_NAME;
const CLIENT_BASE_URL = (env.CLIENT_ORIGINS[0] ?? "").replace(/\/$/, "");

const currencySymbols: Record<string, string> = {
  BDT: "৳",
};

export type EmailTemplate = {
  subject: string;
  html: string;
};

export type NotifiableOrderItem = {
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  size?: string | null;
  color?: string | null;
};

export type NotifiableOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  currency: string;
  items: NotifiableOrderItem[];
};

// Email-safe rendering of the site's brand tokens (see app.css `@theme`:
// --color-midas-red #8b1018, --color-midas-black #101010,
// --color-midas-gray #667085, --color-midas-border #eceff3), plus a
// hand-picked dark-mode set since most opens happen on phones and many of
// those are in system dark mode. Classes carry the dark-mode overrides
// because a `prefers-color-scheme` media rule with `!important` beats a
// plain inline style, while the inline styles remain the light-mode
// fallback for clients that strip <style> blocks.
const emailStyleSheet = `
  body, .email-bg { background-color: #fdf3f3; }
  .email-card { background-color: #ffffff; border-color: #eceff3; }
  .email-header { background-color: #ffffff; border-color: rgba(139, 16, 24, 0.14); }
  .email-brand { color: #8b1018; }
  .email-heading, .email-text, .email-text strong { color: #101010; }
  .email-muted { color: #667085; }
  .email-divider { border-color: #eceff3; }
  .email-footer { background-color: #fff1f2; border-color: #eceff3; }
  .email-footer-text { color: #667085; }
  .email-button-bg { background-color: #8b1018; }
  .email-button-text { color: #ffffff; }

  @media (prefers-color-scheme: dark) {
    body, .email-bg { background-color: #0b0b0c !important; }
    .email-card { background-color: #1b1b1d !important; border-color: #313136 !important; }
    .email-header { background-color: #141415 !important; border-color: rgba(255, 91, 99, 0.24) !important; }
    .email-brand { color: #ff6b6f !important; }
    .email-heading, .email-text, .email-text strong { color: #f2f2f2 !important; }
    .email-muted { color: #a3a9b3 !important; }
    .email-divider { border-color: #313136 !important; }
    .email-footer { background-color: #151516 !important; border-color: #313136 !important; }
    .email-footer-text { color: #9aa0ab !important; }
    .email-button-bg { background-color: #a51820 !important; }
    .email-button-text { color: #ffffff !important; }
  }
`;

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <style>${emailStyleSheet}</style>
  </head>
  <body class="email-bg" style="margin:0;padding:0;background-color:#fdf3f3;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;border-radius:14px;overflow:hidden;">
            <tr>
              <td class="email-header" style="background-color:#ffffff;padding:20px 28px;border-bottom:1px solid rgba(139,16,24,0.14);">
                <span class="email-brand" style="color:#8b1018;font-size:20px;font-weight:700;letter-spacing:0.01em;">${BRAND_NAME}</span>
              </td>
            </tr>
            <tr>
              <td class="email-card" style="background-color:#ffffff;padding:28px;border-left:1px solid #eceff3;border-right:1px solid #eceff3;">
                <h1 class="email-heading" style="font-size:18px;margin:0 0 16px;color:#101010;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td class="email-footer" style="padding:16px 28px;background-color:#fff1f2;border:1px solid #eceff3;border-top:none;border-radius:0 0 14px 14px;">
                <p class="email-footer-text" style="margin:0;font-size:12px;color:#667085;">This is an automated message from ${BRAND_NAME}. Please do not reply to this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function text(html: string): string {
  return `<p class="email-text" style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#101010;">${html}</p>`;
}

function strongLine(html: string): string {
  return `<p class="email-text" style="margin:16px 0 4px;font-size:14px;color:#101010;"><strong>${html}</strong></p>`;
}

function muted(html: string): string {
  return `<p class="email-muted" style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#667085;">${html}</p>`;
}

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td class="email-button-bg" style="border-radius:8px;background-color:#8b1018;">
        <a href="${url}" class="email-button-text" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function formatMoney(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString("en-BD")}`;
}

function itemsTable(items: NotifiableOrderItem[], currency: string): string {
  const rows = items
    .map(
      (item) => `<tr>
        <td class="email-text email-divider" style="padding:8px 0;border-bottom:1px solid #eceff3;font-size:14px;color:#101010;">
          ${item.title}${item.size ? ` · ${item.size}` : ""}${item.color ? ` · ${item.color}` : ""}
          <br /><span class="email-muted" style="color:#667085;font-size:12px;">Qty ${String(item.quantity)}</span>
        </td>
        <td class="email-text email-divider" style="padding:8px 0;border-bottom:1px solid #eceff3;font-size:14px;color:#101010;text-align:right;white-space:nowrap;">
          ${formatMoney(item.lineTotal, currency)}
        </td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`;
}

const orderStatusCopy: Record<string, { subject: string; message: string }> =
  {
    shipped: {
      subject: "Your order has shipped",
      message: "Your order is on its way to you.",
    },
    "out-for-delivery": {
      subject: "Your order is out for delivery",
      message: "Your order is out for delivery and should arrive soon.",
    },
    delivered: {
      subject: "Your order has been delivered",
      message: "Your order has been marked as delivered. Enjoy!",
    },
    cancelled: {
      subject: "Your order has been cancelled",
      message: "Your order has been cancelled. Any charges will be reversed if applicable.",
    },
  };

export function adminNewOrderTemplate(
  order: NotifiableOrder & { id: string },
): EmailTemplate {
  return {
    subject: `New order placed - ${order.orderNumber}`,
    html: layout(
      "New order received",
      `${text(`${order.customerName} (${order.customerEmail}) just placed a new order.`)}
       ${strongLine(`Order ${order.orderNumber}`)}
       ${itemsTable(order.items, order.currency)}
       ${strongLine(`Total: ${formatMoney(order.total, order.currency)}`)}
       ${button("View order", `${CLIENT_BASE_URL}/admin/orders/${order.id}`)}`,
    ),
  };
}

export function orderConfirmationTemplate(order: NotifiableOrder): EmailTemplate {
  return {
    subject: `Order confirmed - ${order.orderNumber}`,
    html: layout(
      "Thank you for your order!",
      `${text(`Hi ${order.customerName}, we've received your order and it's being prepared.`)}
       ${strongLine(`Order ${order.orderNumber}`)}
       ${itemsTable(order.items, order.currency)}
       ${strongLine(`Total: ${formatMoney(order.total, order.currency)}`)}
       ${button("Track your order", `${CLIENT_BASE_URL}/track`)}
       ${muted(`Use order number ${order.orderNumber} and email ${order.customerEmail} to track this order.`)}`,
    ),
  };
}

export function orderStatusUpdateTemplate(order: NotifiableOrder): EmailTemplate {
  const copy = orderStatusCopy[order.status] ?? {
    subject: "Your order status has been updated",
    message: `Your order status is now "${order.status}".`,
  };

  return {
    subject: `${copy.subject} - ${order.orderNumber}`,
    html: layout(
      copy.subject,
      `${text(`Hi ${order.customerName}, ${copy.message}`)}
       ${strongLine(`Order ${order.orderNumber}`)}
       ${itemsTable(order.items, order.currency)}
       ${button("Track your order", `${CLIENT_BASE_URL}/track`)}`,
    ),
  };
}

export function welcomeTemplate(input: { name: string }): EmailTemplate {
  return {
    subject: `Welcome to ${BRAND_NAME}`,
    html: layout(
      `Welcome, ${input.name}!`,
      `${text(`Thanks for creating an account with ${BRAND_NAME}. You're all set to start shopping.`)}
       ${button("Start shopping", `${CLIENT_BASE_URL}/products`)}`,
    ),
  };
}

export function passwordResetRequestedTemplate(input: {
  name: string;
  resetToken: string;
}): EmailTemplate {
  const resetUrl = `${CLIENT_BASE_URL}/reset-password?token=${input.resetToken}`;

  return {
    subject: `Reset your ${BRAND_NAME} password`,
    html: layout(
      "Reset your password",
      `${text(`Hi ${input.name}, we received a request to reset your password. This link expires in 1 hour.`)}
       ${button("Reset password", resetUrl)}
       ${muted("If you didn't request this, you can safely ignore this email.")}`,
    ),
  };
}

export function passwordChangedTemplate(input: { name: string }): EmailTemplate {
  return {
    subject: `Your ${BRAND_NAME} password was changed`,
    html: layout(
      "Password changed",
      `${text(`Hi ${input.name}, your password was just changed and all active sessions were signed out.`)}
       ${muted("If you didn't make this change, please reset your password immediately or contact support.")}`,
    ),
  };
}

export function accountStatusChangedTemplate(input: {
  name: string;
  status: "active" | "blocked";
}): EmailTemplate {
  const isBlocked = input.status === "blocked";

  return {
    subject: isBlocked
      ? `Your ${BRAND_NAME} account has been blocked`
      : `Your ${BRAND_NAME} account has been reactivated`,
    html: layout(
      isBlocked ? "Account blocked" : "Account reactivated",
      `${text(`Hi ${input.name}, your account has been ${isBlocked ? "blocked" : "reactivated"} by an administrator.`)}
       ${isBlocked ? muted("If you believe this is a mistake, please contact support.") : button("Sign in", `${CLIENT_BASE_URL}/login`)}`,
    ),
  };
}

export function roleChangedTemplate(input: {
  name: string;
  role: "admin" | "customer";
}): EmailTemplate {
  const isAdmin = input.role === "admin";

  return {
    subject: isAdmin
      ? `You've been made an admin on ${BRAND_NAME}`
      : `Your ${BRAND_NAME} admin access was removed`,
    html: layout(
      isAdmin ? "Admin access granted" : "Admin access removed",
      `${text(`Hi ${input.name}, your account role was changed to <strong>${input.role}</strong> by an administrator.`)}
       ${isAdmin ? button("Open admin dashboard", `${CLIENT_BASE_URL}/admin`) : ""}`,
    ),
  };
}
