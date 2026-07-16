import { SignJWT, jwtVerify } from "jose";
import { env } from "../../core/config/env.js";
const encoder = new TextEncoder();
const accessSecret = encoder.encode(env.JWT_ACCESS_SECRET);
const refreshSecret = encoder.encode(env.JWT_REFRESH_SECRET);
export async function issueAccessToken(principal) {
    return issueToken(principal, "access", env.JWT_ACCESS_TOKEN_TTL_SECONDS, accessSecret);
}
export async function issueRefreshToken(principal) {
    return issueToken(principal, "refresh", env.JWT_REFRESH_TOKEN_TTL_SECONDS, refreshSecret);
}
export async function verifyAccessToken(token) {
    return verifyToken(token, "access", accessSecret);
}
export async function verifyRefreshToken(token) {
    return verifyToken(token, "refresh", refreshSecret);
}
async function issueToken(principal, kind, ttlSeconds, secret) {
    return new SignJWT({
        role: principal.role,
        sessionId: principal.sessionId,
        kind,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(principal.userId)
        .setIssuedAt()
        .setExpirationTime(`${ttlSeconds.toString()}s`)
        .sign(secret);
}
async function verifyToken(token, expectedKind, secret) {
    const { payload } = await jwtVerify(token, secret);
    if (payload.kind !== expectedKind ||
        typeof payload.sub !== "string" ||
        typeof payload.sessionId !== "string" ||
        !isUserRole(payload.role)) {
        throw new Error("Invalid token payload");
    }
    return {
        userId: payload.sub,
        role: payload.role,
        sessionId: payload.sessionId,
        kind: expectedKind,
    };
}
function isUserRole(value) {
    return value === "admin" || value === "customer";
}
//# sourceMappingURL=token.service.js.map