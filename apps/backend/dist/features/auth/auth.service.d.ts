import { createRefreshTokenCookieOptions } from "./auth-cookie.js";
import type { AuthenticatedPrincipal } from "./auth.types.js";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.schemas.js";
export type AuthUserDto = {
    id: string;
    name: string;
    email: string;
    role: string;
};
export type AuthResult = {
    user: AuthUserDto;
    accessToken: string;
    refreshToken: string;
};
export declare function registerCustomer(input: RegisterInput): Promise<AuthResult>;
export declare function login(input: LoginInput): Promise<AuthResult>;
export declare function rotateRefreshToken(refreshToken: string): Promise<AuthResult>;
export declare function revokeRefreshToken(refreshToken: string | null): Promise<void>;
export declare function getCurrentUser(principal: AuthenticatedPrincipal): Promise<AuthUserDto>;
export declare function createPasswordReset(input: ForgotPasswordInput): Promise<{
    resetToken?: string;
}>;
export declare function resetPassword(input: ResetPasswordInput): Promise<void>;
export declare function getRefreshCookieOptions(): ReturnType<typeof createRefreshTokenCookieOptions>;
//# sourceMappingURL=auth.service.d.ts.map