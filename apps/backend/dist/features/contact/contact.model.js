import { Schema, model } from "mongoose";
export const socialPlatforms = [
    "facebook",
    "instagram",
    "youtube",
    "tiktok",
    "x",
    "linkedin",
    "pinterest",
    "messenger",
    "telegram",
    "website",
];
export const contactMessageStatuses = ["new", "read", "resolved"];
/* Singleton: the store's public contact channels. */
const contactDetailsSchema = new Schema({
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    whatsapp: { type: String, trim: true, maxlength: 30, default: "" },
    email: { type: String, trim: true, lowercase: true, maxlength: 180, default: "" },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    businessHours: { type: String, trim: true, maxlength: 160, default: "" },
}, { timestamps: true });
const socialLinkSchema = new Schema({
    platform: { type: String, enum: socialPlatforms, required: true },
    url: { type: String, required: true, trim: true, maxlength: 500 },
    label: { type: String, trim: true, maxlength: 60, default: "" },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });
const contactMessageSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 180,
        index: true,
    },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
        type: String,
        enum: contactMessageStatuses,
        default: "new",
        index: true,
    },
    adminNote: { type: String, trim: true, maxlength: 2000, default: "" },
    readAt: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    ipAddress: { type: String, trim: true, maxlength: 64 },
    userAgent: { type: String, trim: true, maxlength: 300 },
}, { timestamps: true });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });
export const ContactDetailsModel = model("ContactDetails", contactDetailsSchema);
export const SocialLinkModel = model("SocialLink", socialLinkSchema);
export const ContactMessageModel = model("ContactMessage", contactMessageSchema);
//# sourceMappingURL=contact.model.js.map