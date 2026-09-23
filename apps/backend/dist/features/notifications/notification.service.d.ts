import { type NotifiableOrder } from "./email-templates.js";
export declare function notifyOrderPlaced(order: NotifiableOrder, userId?: string): Promise<void>;
export declare function notifyOrderStatusChanged(order: NotifiableOrder, userId?: string): Promise<void>;
export declare function notifyAdminsNewOrder(order: NotifiableOrder & {
    id: string;
}): Promise<void>;
export declare function notifyWelcome(input: {
    email: string;
    name: string;
}): Promise<void>;
export declare function notifyPasswordResetRequested(input: {
    email: string;
    name: string;
    resetToken: string;
}): Promise<void>;
export declare function notifyPasswordChanged(input: {
    email: string;
    name: string;
}): Promise<void>;
export declare function notifyAccountStatusChanged(input: {
    email: string;
    name: string;
    status: "active" | "blocked";
}): Promise<void>;
export declare function notifyRoleChanged(input: {
    email: string;
    name: string;
    role: "admin" | "customer";
}): Promise<void>;
export type { NotifiableOrder, NotifiableOrderItem } from "./email-templates.js";
//# sourceMappingURL=notification.service.d.ts.map