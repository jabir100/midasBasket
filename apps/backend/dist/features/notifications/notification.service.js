import { UserModel } from "../users/user.model.js";
import { logger } from "../../core/logging/logger.js";
import { accountStatusChangedTemplate, adminNewOrderTemplate, orderConfirmationTemplate, orderStatusUpdateTemplate, passwordChangedTemplate, passwordResetRequestedTemplate, roleChangedTemplate, welcomeTemplate, } from "./email-templates.js";
import { sendMail } from "./mailer.js";
const orderStatusNotificationList = new Set([
    "shipped",
    "out-for-delivery",
    "delivered",
    "cancelled",
]);
async function isOrderEmailAllowed(userId) {
    if (!userId) {
        return true;
    }
    const user = await UserModel.findById(userId)
        .select("notificationPreferences.emailOrders")
        .lean();
    return user?.notificationPreferences?.emailOrders !== false;
}
export async function notifyOrderPlaced(order, userId) {
    if (!(await isOrderEmailAllowed(userId))) {
        return;
    }
    const { subject, html } = orderConfirmationTemplate(order);
    await sendMail({ to: order.customerEmail, subject, html });
}
export async function notifyOrderStatusChanged(order, userId) {
    if (!orderStatusNotificationList.has(order.status)) {
        return;
    }
    if (!(await isOrderEmailAllowed(userId))) {
        return;
    }
    const { subject, html } = orderStatusUpdateTemplate(order);
    await sendMail({ to: order.customerEmail, subject, html });
}
export async function notifyAdminsNewOrder(order) {
    const admins = await UserModel.find({ role: "admin", status: "active" })
        .select("email")
        .lean();
    if (admins.length === 0) {
        logger.warn("No active admins found to notify about a new order");
        return;
    }
    const { subject, html } = adminNewOrderTemplate(order);
    await Promise.all(admins.map((admin) => sendMail({ to: admin.email, subject, html })));
}
export function notifyWelcome(input) {
    const { subject, html } = welcomeTemplate(input);
    return sendMail({ to: input.email, subject, html });
}
export function notifyPasswordResetRequested(input) {
    const { subject, html } = passwordResetRequestedTemplate(input);
    return sendMail({ to: input.email, subject, html });
}
export function notifyPasswordChanged(input) {
    const { subject, html } = passwordChangedTemplate(input);
    return sendMail({ to: input.email, subject, html });
}
export function notifyAccountStatusChanged(input) {
    const { subject, html } = accountStatusChangedTemplate(input);
    return sendMail({ to: input.email, subject, html });
}
export function notifyRoleChanged(input) {
    const { subject, html } = roleChangedTemplate(input);
    return sendMail({ to: input.email, subject, html });
}
//# sourceMappingURL=notification.service.js.map