export const userRoles = ["admin", "customer"] as const;

export type UserRole = (typeof userRoles)[number];

export type AuthenticatedPrincipal = {
  userId: string;
  role: UserRole;
  sessionId: string;
};
