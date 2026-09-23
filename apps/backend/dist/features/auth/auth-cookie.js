import { env } from "../../core/config/env.js";
export const refreshTokenCookieName = "midas_refresh_token";
export function createRefreshTokenCookieOptions() {
    const isProduction = env.NODE_ENV === "production";
    return {
        httpOnly: true,
        // In production the frontend and backend are deployed on different
        // origins (e.g. Vercel <-> Render), so the refresh cookie must be sent
        // cross-site. "lax" cookies are withheld by the browser on cross-site
        // fetch/XHR requests, which silently broke `/auth/refresh` and logged
        // users out as soon as the short-lived access token expired.
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: env.COOKIE_DOMAIN,
        path: "/api/v1/auth/refresh",
        maxAge: env.JWT_REFRESH_TOKEN_TTL_SECONDS * 1000,
    };
}
//# sourceMappingURL=auth-cookie.js.map