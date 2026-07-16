import { Schema, model } from "mongoose";
const authSessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: { type: Date },
    replacedBySessionId: { type: Schema.Types.ObjectId, ref: "AuthSession" },
}, { timestamps: true });
export const AuthSessionModel = model("AuthSession", authSessionSchema);
//# sourceMappingURL=auth-session.model.js.map