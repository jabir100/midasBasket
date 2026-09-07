import { UserModel } from "../users/user.model.js";
import { logger } from "../../core/logging/logger.js";
import {
  accountStatusChangedTemplate,
  adminNewOrderTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordChangedTemplate,
  passwordResetRequestedTemplate,
  roleChangedTemplate,
  welcomeTemplate,
  type NotifiableOrder,
} from "./email-templates.js";
import { sendMail } from "./mailer.js";

const orderStatusNotificationList = new Set([
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
]);

async function isOrderEmailAllowed(userId: string | undefined): Promise<boolean> {
  if (!userId) {
    return true;
  }

  const user = await UserModel.findById(userId)
    .select("notificationPreferences.emailOrders")
    .lean<{ notificationPreferences?: { emailOrders?: boolean } } | null>();

  return user?.notificationPreferences?.emailOrders !== false;
}

export async function notifyOrderPlaced(
  order: NotifiableOrder,
  userId?: string,
): Promise<void> {
  if (!(await isOrderEmailAllowed(userId))) {
    return;
  }

  const { subject, html } = orderConfirmationTemplate(order);
  await sendMail({ to: order.customerEmail, subject, html });
}

export async function notifyOrderStatusChanged(
  order: NotifiableOrder,
  userId?: string,
): Promise<void> {
  if (!orderStatusNotificationList.has(order.status)) {
    return;
  }

  if (!(await isOrderEmailAllowed(userId))) {
    return;
  }

  const { subject, html } = orderStatusUpdateTemplate(order);
  await sendMail({ to: order.customerEmail, subject, html });
}

export async function notifyAdminsNewOrder(
  order: NotifiableOrder & { id: string },
): Promise<void> {
  const admins = await UserModel.find({ role: "admin", status: "active" })
    .select("email")
    .lean<{ email: string }[]>();

  if (admins.length === 0) {
    logger.warn("No active admins found to notify about a new order");
    return;
  }

  const { subject, html } = adminNewOrderTemplate(order);
  await Promise.all(
    admins.map((admin) => sendMail({ to: admin.email, subject, html })),
  );
}

export function notifyWelcome(input: { email: string; name: string }): Promise<void> {
  const { subject, html } = welcomeTemplate(input);
  return sendMail({ to: input.email, subject, html });
}

export function notifyPasswordResetRequested(input: {
  email: string;
  name: string;
  resetToken: string;
}): Promise<void> {
  const { subject, html } = passwordResetRequestedTemplate(input);
  return sendMail({ to: input.email, subject, html });
}

export function notifyPasswordChanged(input: {
  email: string;
  name: string;
}): Promise<void> {
  const { subject, html } = passwordChangedTemplate(input);
  return sendMail({ to: input.email, subject, html });
}

export function notifyAccountStatusChanged(input: {
  email: string;
  name: string;
  status: "active" | "blocked";
}): Promise<void> {
  const { subject, html } = accountStatusChangedTemplate(input);
  return sendMail({ to: input.email, subject, html });
}

export function notifyRoleChanged(input: {
  email: string;
  name: string;
  role: "admin" | "customer";
}): Promise<void> {
  const { subject, html } = roleChangedTemplate(input);
  return sendMail({ to: input.email, subject, html });
}

export type { NotifiableOrder, NotifiableOrderItem } from "./email-templates.js";
