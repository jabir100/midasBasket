import type { ReactNode } from "react";

export type StatusTone =
  "neutral" | "info" | "violet" | "cyan" | "amber" | "success" | "danger";

const orderStatusTone: Record<string, StatusTone> = {
  placed: "neutral",
  confirmed: "info",
  packed: "violet",
  shipped: "cyan",
  "out-for-delivery": "amber",
  delivered: "success",
  cancelled: "danger",
};

const paymentStatusTone: Record<string, StatusTone> = {
  pending: "amber",
  paid: "success",
  failed: "danger",
};

const paymentStatusLabelMap: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};

const paymentMethodTone: Record<string, StatusTone> = {
  cod: "neutral",
  "bank-transfer": "info",
  bkash: "violet",
  nagad: "cyan",
  card: "success",
};

const paymentMethodLabel: Record<string, string> = {
  cod: "Cash on delivery",
  "bank-transfer": "Bank transfer",
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card",
};

export function orderStatusLabel(status: string): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function paymentStatusLabel(status: string): string {
  return (
    paymentStatusLabelMap[status] ??
    status.charAt(0).toUpperCase() + status.slice(1)
  );
}

export function StatusBadge({
  tone,
  children,
}: Readonly<{ tone: StatusTone; children: ReactNode }>): ReactNode {
  return <span className={`admin-status-badge tone-${tone}`}>{children}</span>;
}

export function OrderStatusBadge({
  status,
}: Readonly<{ status: string }>): ReactNode {
  return (
    <StatusBadge tone={orderStatusTone[status] ?? "neutral"}>
      {orderStatusLabel(status)}
    </StatusBadge>
  );
}

export function PaymentStatusBadge({
  status,
}: Readonly<{ status: string }>): ReactNode {
  return (
    <StatusBadge tone={paymentStatusTone[status] ?? "neutral"}>
      {paymentStatusLabel(status)}
    </StatusBadge>
  );
}

export function PaymentMethodBadge({
  method,
}: Readonly<{ method: string }>): ReactNode {
  return (
    <StatusBadge tone={paymentMethodTone[method] ?? "neutral"}>
      {paymentMethodLabel[method] ??
        method.charAt(0).toUpperCase() + method.slice(1)}
    </StatusBadge>
  );
}

const userStatusTone: Record<string, StatusTone> = {
  active: "success",
  blocked: "danger",
};

const userRoleTone: Record<string, StatusTone> = {
  admin: "violet",
  customer: "neutral",
};

export function UserStatusBadge({
  status,
}: Readonly<{ status: string }>): ReactNode {
  return (
    <StatusBadge tone={userStatusTone[status] ?? "neutral"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  );
}

export function UserRoleBadge({
  role,
}: Readonly<{ role: string }>): ReactNode {
  return (
    <StatusBadge tone={userRoleTone[role] ?? "neutral"}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </StatusBadge>
  );
}
