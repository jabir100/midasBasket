import { Router, type Router as ExpressRouter } from "express";
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { getPrincipal } from "../auth/authorization.middleware.js";
import { ProductModel } from "../catalog/catalog.model.js";
import { WishlistModel } from "./wishlist.model.js";
import { addWishlistItemSchema } from "./wishlist.schemas.js";

export const wishlistRouter: ExpressRouter = Router();

wishlistRouter.use(authenticateAccessToken);

wishlistRouter.get("/", async (_req, res, next) => {
  try {
    const principal = getPrincipal(res);

    if (!principal) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    const wishlist = await WishlistModel.findOne({ userId: principal.userId });

    sendSuccess(res, {
      data: {
        wishlist: {
          items:
            wishlist?.items.map((item) => ({
              productId: String(item.productId),
              addedAt: item.addedAt,
            })) ?? [],
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.post("/items", async (req, res, next) => {
  try {
    const principal = getPrincipal(res);

    if (!principal) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    const input = addWishlistItemSchema.parse(req.body);
    const product = await ProductModel.findOne({
      _id: input.productId,
      isPublished: true,
    }).select("_id");

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "Product was not found",
      });
    }

    const wishlist =
      (await WishlistModel.findOne({ userId: principal.userId })) ??
      (await WishlistModel.create({
        userId: new Types.ObjectId(principal.userId),
      }));

    const hasItem = wishlist.items.some(
      (item) => item.productId.toString() === input.productId,
    );

    if (!hasItem) {
      wishlist.items.push({ productId: new Types.ObjectId(input.productId) });
      await wishlist.save();
    }

    sendSuccess(res, {
      statusCode: 201,
      data: {
        wishlist: {
          items: wishlist.items.map((item) => ({
            productId: String(item.productId),
            addedAt: item.addedAt,
          })),
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.delete("/items/:productId", async (req, res, next) => {
  try {
    const principal = getPrincipal(res);

    if (!principal) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    const updateResult = await WishlistModel.updateOne(
      { userId: principal.userId },
      {
        $pull: {
          items: { productId: new Types.ObjectId(req.params.productId) },
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      sendSuccess(res, {
        data: { deleted: true, wishlist: { items: [] } },
        requestId: getRequestId(res),
      });
      return;
    }

    const wishlist = await WishlistModel.findOne({ userId: principal.userId });

    sendSuccess(res, {
      data: {
        deleted: true,
        wishlist: {
          items: (wishlist?.items ?? []).map((item) => ({
            productId: String(item.productId),
            addedAt: item.addedAt,
          })),
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});
