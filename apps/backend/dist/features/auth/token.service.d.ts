import type { AuthenticatedPrincipal } from "./auth.types.js";
export type AuthTokenKind = "access" | "refresh";
export type AuthTokenPayload = AuthenticatedPrincipal & {
    kind: AuthTokenKind;
};
export declare function issueAccessToken(principal: AuthenticatedPrincipal): Promise<string>;
export declare function issueRefreshToken(principal: AuthenticatedPrincipal): Promise<string>;
export declare function verifyAccessToken(token: string): Promise<AuthTokenPayload>;
export declare function verifyRefreshToken(token: string): Promise<AuthTokenPayload>;
//# sourceMappingURL=token.service.d.ts.map