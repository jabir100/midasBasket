import type { RequestHandler, Response } from "express";
import type { AuthenticatedPrincipal, UserRole } from "./auth.types.js";
export declare function setPrincipal(res: Response, principal: AuthenticatedPrincipal): void;
export declare function getPrincipal(res: Response): AuthenticatedPrincipal | null;
export declare function requireRoles(allowedRoles: readonly UserRole[]): RequestHandler;
//# sourceMappingURL=authorization.middleware.d.ts.map