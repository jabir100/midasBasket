export declare const userRoles: readonly ["admin", "customer"];
export type UserRole = (typeof userRoles)[number];
export type AuthenticatedPrincipal = {
    userId: string;
    role: UserRole;
    sessionId: string;
};
//# sourceMappingURL=auth.types.d.ts.map