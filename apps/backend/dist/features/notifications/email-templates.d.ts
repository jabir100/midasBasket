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
export declare function adminNewOrderTemplate(order: NotifiableOrder & {
    id: string;
}): EmailTemplate;
export declare function orderConfirmationTemplate(order: NotifiableOrder): EmailTemplate;
export declare function orderStatusUpdateTemplate(order: NotifiableOrder): EmailTemplate;
export declare function welcomeTemplate(input: {
    name: string;
}): EmailTemplate;
export declare function passwordResetRequestedTemplate(input: {
    name: string;
    resetToken: string;
}): EmailTemplate;
export declare function passwordChangedTemplate(input: {
    name: string;
}): EmailTemplate;
export declare function accountStatusChangedTemplate(input: {
    name: string;
    status: "active" | "blocked";
}): EmailTemplate;
export declare function roleChangedTemplate(input: {
    name: string;
    role: "admin" | "customer";
}): EmailTemplate;
//# sourceMappingURL=email-templates.d.ts.map