import { Router } from "express";
import { Types } from "mongoose";
import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { getPrincipal, requireRoles, } from "../auth/authorization.middleware.js";
import { OrderModel } from "../orders/order.model.js";
import { WishlistModel } from "../wishlist/wishlist.model.js";
import { UserModel } from "./user.model.js";
import { notificationPreferencesUpdateSchema, userAddressIdParamSchema, userAddressSchema, userAddressUpdateSchema, userProfileUpdateSchema, } from "./user.schemas.js";
export const usersRouter = Router();
usersRouter.use(authenticateAccessToken, requireRoles(["customer", "admin"]));
usersRouter.get("/me/profile", async (_req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const user = await UserModel.findById(principal.userId).lean();
        if (user?.status !== "active") {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        const [ordersCount, wishlist] = await Promise.all([
            OrderModel.countDocuments({ userId: principal.userId }),
            WishlistModel.findOne({ userId: principal.userId }).lean(),
        ]);
        sendSuccess(res, {
            data: {
                user: serializeUserProfile(user),
                summary: {
                    ordersCount,
                    wishlistItems: wishlist?.items.length ?? 0,
                    addressesCount: user.addresses.length,
                },
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.patch("/me/profile", async (req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const input = userProfileUpdateSchema.parse(req.body);
        const user = await UserModel.findByIdAndUpdate(principal.userId, { $set: input }, { new: true }).lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        sendSuccess(res, {
            data: { user: serializeUserProfile(user) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.get("/me/addresses", async (_req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const user = await UserModel.findById(principal.userId).lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        sendSuccess(res, {
            data: {
                addresses: user.addresses.map((address) => serializeAddress(address)),
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.post("/me/addresses", async (req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const input = userAddressSchema.parse(req.body);
        const user = await UserModel.findById(principal.userId)
            .select("addresses")
            .lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        const addressId = new Types.ObjectId();
        const nextIsDefault = input.isDefault ?? user.addresses.length === 0;
        if (nextIsDefault) {
            await UserModel.updateOne({ _id: principal.userId }, { $set: { "addresses.$[].isDefault": false } });
        }
        await UserModel.updateOne({ _id: principal.userId }, {
            $push: {
                addresses: {
                    _id: addressId,
                    ...input,
                    isDefault: nextIsDefault,
                },
            },
        });
        const updated = await UserModel.findById(principal.userId)
            .select("addresses")
            .lean();
        const address = updated?.addresses.find((entry) => String(entry._id) === addressId.toString());
        if (!address) {
            throw new AppError({
                statusCode: 500,
                code: "ADDRESS_CREATION_FAILED",
                message: "Address could not be created",
            });
        }
        sendSuccess(res, {
            statusCode: 201,
            data: { address: serializeAddress(address) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.patch("/me/addresses/:addressId", async (req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const params = userAddressIdParamSchema.parse(req.params);
        const input = userAddressUpdateSchema.parse(req.body);
        const addressId = new Types.ObjectId(params.addressId);
        if (input.isDefault) {
            await UserModel.updateOne({ _id: principal.userId }, { $set: { "addresses.$[].isDefault": false } });
        }
        const setPayload = Object.fromEntries(Object.entries(input).map(([key, value]) => [
            `addresses.$[address].${key}`,
            value,
        ]));
        const result = await UserModel.updateOne({ _id: principal.userId }, { $set: setPayload }, {
            arrayFilters: [{ "address._id": addressId }],
        });
        if (result.matchedCount === 0 || result.modifiedCount === 0) {
            throw new AppError({
                statusCode: 404,
                code: "ADDRESS_NOT_FOUND",
                message: "Address was not found",
            });
        }
        const updated = await UserModel.findById(principal.userId)
            .select("addresses")
            .lean();
        const address = updated?.addresses.find((entry) => String(entry._id) === params.addressId);
        if (!address) {
            throw new AppError({
                statusCode: 404,
                code: "ADDRESS_NOT_FOUND",
                message: "Address was not found",
            });
        }
        sendSuccess(res, {
            data: { address: serializeAddress(address) },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.delete("/me/addresses/:addressId", async (req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const params = userAddressIdParamSchema.parse(req.params);
        const user = await UserModel.findById(principal.userId)
            .select("addresses")
            .lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        const removedAddress = user.addresses.find((entry) => String(entry._id) === params.addressId);
        if (!removedAddress) {
            throw new AppError({
                statusCode: 404,
                code: "ADDRESS_NOT_FOUND",
                message: "Address was not found",
            });
        }
        await UserModel.updateOne({ _id: principal.userId }, { $pull: { addresses: { _id: new Types.ObjectId(params.addressId) } } });
        if (removedAddress.isDefault) {
            const refreshed = await UserModel.findById(principal.userId)
                .select("addresses")
                .lean();
            const nextDefaultAddress = refreshed?.addresses[0];
            if (nextDefaultAddress) {
                await UserModel.updateOne({
                    _id: principal.userId,
                    "addresses._id": nextDefaultAddress._id,
                }, {
                    $set: {
                        "addresses.$.isDefault": true,
                    },
                });
            }
        }
        sendSuccess(res, {
            data: { deleted: true },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.get("/me/notifications", async (_req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const user = await UserModel.findById(principal.userId)
            .select("notificationPreferences")
            .lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        sendSuccess(res, {
            data: {
                notificationPreferences: {
                    emailOrders: user.notificationPreferences.emailOrders,
                    emailOffers: user.notificationPreferences.emailOffers,
                    smsOrders: user.notificationPreferences.smsOrders,
                    pushNotifications: user.notificationPreferences.pushNotifications,
                },
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.patch("/me/notifications", async (req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const input = notificationPreferencesUpdateSchema.parse(req.body);
        const user = await UserModel.findByIdAndUpdate(principal.userId, {
            $set: Object.fromEntries(Object.entries(input).map(([key, value]) => [
                `notificationPreferences.${key}`,
                value,
            ])),
        }, { new: true })
            .select("notificationPreferences")
            .lean();
        if (!user) {
            throw new AppError({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "User was not found",
            });
        }
        sendSuccess(res, {
            data: {
                notificationPreferences: {
                    emailOrders: user.notificationPreferences.emailOrders,
                    emailOffers: user.notificationPreferences.emailOffers,
                    smsOrders: user.notificationPreferences.smsOrders,
                    pushNotifications: user.notificationPreferences.pushNotifications,
                },
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
usersRouter.get("/me/invoices", async (_req, res, next) => {
    try {
        const principal = requirePrincipal(res);
        const orders = await OrderModel.find({ userId: principal.userId })
            .sort({ createdAt: -1 })
            .lean();
        sendSuccess(res, {
            data: {
                invoices: orders.map((order) => ({
                    id: String(order._id),
                    invoiceNumber: `INV-${order.orderNumber}`,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    currency: order.currency,
                    total: order.total,
                    issuedAt: order.createdAt,
                })),
            },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
function requirePrincipal(res) {
    const principal = getPrincipal(res);
    if (!principal) {
        throw new AppError({
            statusCode: 401,
            code: "AUTHENTICATION_REQUIRED",
            message: "Authentication is required",
        });
    }
    return principal;
}
function serializeUserProfile(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
    };
}
function serializeAddress(address) {
    return {
        id: String(address._id),
        label: address.label,
        line1: address.line1,
        line2: address.line2 ?? null,
        area: address.area,
        city: address.city,
        postalCode: address.postalCode ?? null,
        country: address.country,
        isDefault: address.isDefault ?? false,
    };
}
//# sourceMappingURL=user.router.js.map