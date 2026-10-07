import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { objectIdParamSchema } from "../admin/admin.schemas.js";
import { authenticateAccessToken, authenticateOptionalAccessToken, } from "../auth/authentication.middleware.js";
import { getPrincipal, requireRoles } from "../auth/authorization.middleware.js";
import { getContactCache, invalidateContactCache, setContactCache, } from "./contact-cache.service.js";
import { ContactDetailsModel, ContactMessageModel, SocialLinkModel, } from "./contact.model.js";
import { adminContactMessagesQuerySchema, contactDetailsSchema, contactMessageCreateSchema, contactMessageUpdateSchema, socialLinkSchema, } from "./contact.schemas.js";
export const contactRouter = Router();
const adminRouter = Router();
const contactCacheControl = "public, max-age=120, s-maxage=600, stale-while-revalidate=1800";
const contactSubmissionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new AppError({
            statusCode: 429,
            code: "TOO_MANY_CONTACT_MESSAGES",
            message: "You have sent several messages recently. Please wait a few minutes and try again.",
        }));
    },
});
function toContactDetails(details) {
    return {
        phone: details?.phone ?? "",
        whatsapp: details?.whatsapp ?? "",
        email: details?.email ?? "",
        address: details?.address ?? "",
        businessHours: details?.businessHours ?? "",
    };
}
function toAdminSocialLink(link) {
    return {
        id: String(link._id),
        platform: link.platform,
        url: link.url,
        label: link.label ?? "",
        sortOrder: link.sortOrder ?? 0,
        isActive: link.isActive ?? true,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
    };
}
function toContactMessageSummary(message) {
    return {
        id: String(message._id),
        name: message.name,
        email: message.email,
        phone: message.phone ?? null,
        subject: message.subject,
        preview: message.message.slice(0, 160),
        status: message.status,
        createdAt: message.createdAt,
    };
}
function toContactMessageDetail(message) {
    return {
        id: String(message._id),
        name: message.name,
        email: message.email,
        phone: message.phone ?? null,
        subject: message.subject,
        message: message.message,
        status: message.status,
        adminNote: message.adminNote ?? "",
        readAt: message.readAt ?? null,
        userId: message.userId ? String(message.userId) : null,
        ipAddress: message.ipAddress ?? null,
        userAgent: message.userAgent ?? null,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
}
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/* ------------------------------------------------------------------ */
/*  Public: contact channels + social links (footer, contact page)    */
/* ------------------------------------------------------------------ */
contactRouter.get("/", async (_req, res, next) => {
    try {
        res.setHeader("Cache-Control", contactCacheControl);
        const cached = await getContactCache();
        if (cached) {
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(cached);
            return;
        }
        const [details, socialLinks] = await Promise.all([
            ContactDetailsModel.findOne().lean(),
            SocialLinkModel.find({ isActive: true })
                .sort({ sortOrder: 1, createdAt: 1 })
                .lean(),
        ]);
        const payload = {
            success: true,
            data: {
                details: toContactDetails(details),
                socialLinks: socialLinks.map((link) => ({
                    id: String(link._id),
                    platform: link.platform,
                    url: link.url,
                    label: link.label,
                })),
            },
            requestId: getRequestId(res),
        };
        const serialized = JSON.stringify(payload);
        await setContactCache(serialized);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(serialized);
    }
    catch (error) {
        next(error);
    }
});
contactRouter.post("/messages", contactSubmissionLimiter, authenticateOptionalAccessToken, async (req, res, next) => {
    try {
        const { website, phone, ...input } = contactMessageCreateSchema.parse(req.body);
        // Pretend success to bots that filled the honeypot; store nothing.
        if (website) {
            sendSuccess(res, {
                statusCode: 201,
                data: { received: true },
                requestId: getRequestId(res),
            });
            return;
        }
        const principal = getPrincipal(res);
        await ContactMessageModel.create({
            ...input,
            ...(phone ? { phone } : {}),
            ...(principal ? { userId: principal.userId } : {}),
            ipAddress: req.ip,
            userAgent: req.get("user-agent")?.slice(0, 300),
        });
        sendSuccess(res, {
            statusCode: 201,
            data: { received: true },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
/* ------------------------------------------------------------------ */
/*  Admin                                                             */
/* ------------------------------------------------------------------ */
adminRouter.use(authenticateAccessToken, requireRoles(["admin"]));
/* Contact details — singleton upsert */
adminRouter.get("/details", async (_req, res, next) => {
    try {
        const details = await ContactDetailsModel.findOne().lean();
        sendSuccess(res, {
            data: { details: toContactDetails(details) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put("/details", async (req, res, next) => {
    try {
        const input = contactDetailsSchema.parse(req.body);
        const details = await ContactDetailsModel.findOneAndUpdate({}, { $set: input }, { new: true, upsert: true }).lean();
        await invalidateContactCache("contact-details.updated");
        sendSuccess(res, {
            data: { details: toContactDetails(details) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
/* Social links CRUD */
adminRouter.get("/social-links", async (_req, res, next) => {
    try {
        const links = await SocialLinkModel.find()
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();
        sendSuccess(res, {
            data: { socialLinks: links.map(toAdminSocialLink) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/social-links", async (req, res, next) => {
    try {
        const input = socialLinkSchema.parse(req.body);
        const link = await SocialLinkModel.create(input);
        await invalidateContactCache("social-link.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { socialLink: toAdminSocialLink(link.toObject()) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/social-links/:id", async (req, res, next) => {
    try {
        const params = objectIdParamSchema.parse(req.params);
        const input = socialLinkSchema.partial().parse(req.body);
        const link = await SocialLinkModel.findByIdAndUpdate(params.id, { $set: input }, { new: true, runValidators: true }).lean();
        if (!link) {
            throw new AppError({
                statusCode: 404,
                code: "SOCIAL_LINK_NOT_FOUND",
                message: "Social link was not found",
            });
        }
        await invalidateContactCache("social-link.updated");
        sendSuccess(res, {
            data: { socialLink: toAdminSocialLink(link) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/social-links/:id", async (req, res, next) => {
    try {
        const params = objectIdParamSchema.parse(req.params);
        const link = await SocialLinkModel.findByIdAndDelete(params.id);
        if (!link) {
            throw new AppError({
                statusCode: 404,
                code: "SOCIAL_LINK_NOT_FOUND",
                message: "Social link was not found",
            });
        }
        await invalidateContactCache("social-link.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
/* Contact form submissions */
adminRouter.get("/messages", async (req, res, next) => {
    try {
        const query = adminContactMessagesQuerySchema.parse(req.query);
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.search) {
            const pattern = { $regex: escapeRegex(query.search), $options: "i" };
            filter.$or = [
                { name: pattern },
                { email: pattern },
                { phone: pattern },
                { subject: pattern },
            ];
        }
        const skip = (query.page - 1) * query.limit;
        const [messages, total, unread] = await Promise.all([
            ContactMessageModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(query.limit)
                .lean(),
            ContactMessageModel.countDocuments(filter),
            ContactMessageModel.countDocuments({ status: "new" }),
        ]);
        sendSuccess(res, {
            data: { messages: messages.map(toContactMessageSummary) },
            meta: {
                page: query.page,
                limit: query.limit,
                total,
                pages: Math.ceil(total / query.limit),
                unread,
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get("/messages/:id", async (req, res, next) => {
    try {
        const params = objectIdParamSchema.parse(req.params);
        const message = await ContactMessageModel.findById(params.id).lean();
        if (!message) {
            throw new AppError({
                statusCode: 404,
                code: "CONTACT_MESSAGE_NOT_FOUND",
                message: "Message was not found",
            });
        }
        // Opening an unread message marks it as read, like an inbox.
        if (message.status === "new") {
            const readAt = new Date();
            await ContactMessageModel.updateOne({ _id: message._id, status: "new" }, { $set: { status: "read", readAt } });
            message.status = "read";
            message.readAt = readAt;
        }
        sendSuccess(res, {
            data: { message: toContactMessageDetail(message) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/messages/:id", async (req, res, next) => {
    try {
        const params = objectIdParamSchema.parse(req.params);
        const input = contactMessageUpdateSchema.parse(req.body);
        const message = await ContactMessageModel.findByIdAndUpdate(params.id, { $set: input }, { new: true, runValidators: true }).lean();
        if (!message) {
            throw new AppError({
                statusCode: 404,
                code: "CONTACT_MESSAGE_NOT_FOUND",
                message: "Message was not found",
            });
        }
        sendSuccess(res, {
            data: { message: toContactMessageDetail(message) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/messages/:id", async (req, res, next) => {
    try {
        const params = objectIdParamSchema.parse(req.params);
        const message = await ContactMessageModel.findByIdAndDelete(params.id);
        if (!message) {
            throw new AppError({
                statusCode: 404,
                code: "CONTACT_MESSAGE_NOT_FOUND",
                message: "Message was not found",
            });
        }
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
contactRouter.use("/admin", adminRouter);
//# sourceMappingURL=contact.router.js.map