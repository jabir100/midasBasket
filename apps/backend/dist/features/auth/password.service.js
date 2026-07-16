import argon2 from "argon2";
const argon2Options = {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
};
export async function hashPassword(password) {
    return argon2.hash(password, argon2Options);
}
export async function verifyPassword(hash, password) {
    return argon2.verify(hash, password);
}
//# sourceMappingURL=password.service.js.map