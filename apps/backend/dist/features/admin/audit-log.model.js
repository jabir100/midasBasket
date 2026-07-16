import { Schema, model } from "mongoose";
const auditLogSchema = new Schema({
    actorUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    actorEmail: { type: String, required: true, trim: true, maxlength: 180 },
    action: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
        index: true,
    },
    entityType: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
        index: true,
    },
    entityId: { type: String, required: true, trim: true, maxlength: 64 },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
auditLogSchema.index({ createdAt: -1 });
export const AuditLogModel = model("AuditLog", auditLogSchema);
//# sourceMappingURL=audit-log.model.js.map