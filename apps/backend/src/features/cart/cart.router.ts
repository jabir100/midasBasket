import { Router, type Router as ExpressRouter } from "express";
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateOptionalAccessToken } from "../auth/authentication.middleware.js";
import { getPrincipal } from "../auth/authorization.middleware.js";
import { ProductModel } from "../catalog/catalog.model.js";
import { CartModel } from "./cart.model.js";
import {
  addCartItemSchema,
  cartQuerySchema,
  couponSchema,
  updateCartItemSchema,
} from "./cart.schemas.js";

export const cartRouter: ExpressRouter = Router();

cartRouter.use(authenticateOptionalAccessToken);

cartRouter.get("/", async (req, res, next) => {
  try {
    const query = cartQuerySchema.parse(req.query);
    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      query.guestCartId,
    );
    const cart = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      data: { cart: formatCart(cart) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/items", async (req, res, next) => {
  try {
    const input = addCartItemSchema.parse(req.body);
    const product = await ProductModel.findOne({
      _id: input.productId,
      isPublished: true,
    }).lean();

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "Product was not found",
      });
    }

    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      input.guestCartId,
    );

    await CartModel.updateOne(
      scope.filter,
      { $setOnInsert: scope.setOnInsert },
      { upsert: true },
    );

    const cart = await CartModel.findOne(scope.filter).lean();

    if (!cart) {
      throw new AppError({
        statusCode: 500,
        code: "CART_RESOLUTION_FAILED",
        message: "Cart could not be resolved",
      });
    }

    const existing = cart.items.find(
      (item) => String(item.productId) === input.productId,
    );

    if (existing) {
      const nextQuantity = Math.min(existing.quantity + input.quantity, 99);
      await CartModel.updateOne(
        scope.filter,
        {
          $set: {
            "items.$[item].quantity": nextQuantity,
            "items.$[item].unitPrice": product.price,
            "items.$[item].title": product.name,
            "items.$[item].slug": product.slug,
            "items.$[item].imageUrl": product.images?.[0]?.url ?? null,
          },
        },
        {
          arrayFilters: [
            { "item.productId": new Types.ObjectId(input.productId) },
          ],
        },
      );
    } else {
      await CartModel.updateOne(scope.filter, {
        $push: {
          items: {
            productId: new Types.ObjectId(input.productId),
            quantity: input.quantity,
            unitPrice: product.price,
            title: product.name,
            slug: product.slug,
            imageUrl: product.images?.[0]?.url ?? null,
          },
        },
      });
    }

    const updated = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      statusCode: 201,
      data: { cart: formatCart(updated) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.patch("/items/:productId", async (req, res, next) => {
  try {
    const input = updateCartItemSchema.parse(req.body);
    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      input.guestCartId,
    );

    const updateResult = await CartModel.updateOne(
      scope.filter,
      {
        $set: {
          "items.$[item].quantity": input.quantity,
        },
      },
      {
        arrayFilters: [
          { "item.productId": new Types.ObjectId(req.params.productId) },
        ],
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new AppError({
        statusCode: 404,
        code: "CART_NOT_FOUND",
        message: "Cart was not found",
      });
    }

    if (updateResult.modifiedCount === 0) {
      throw new AppError({
        statusCode: 404,
        code: "CART_ITEM_NOT_FOUND",
        message: "Cart item was not found",
      });
    }

    const updated = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      data: { cart: formatCart(updated) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/items/:productId", async (req, res, next) => {
  try {
    const query = cartQuerySchema.parse(req.query);
    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      query.guestCartId,
    );

    const updateResult = await CartModel.updateOne(scope.filter, {
      $pull: {
        items: { productId: new Types.ObjectId(req.params.productId) },
      },
    });

    if (updateResult.matchedCount === 0) {
      throw new AppError({
        statusCode: 404,
        code: "CART_NOT_FOUND",
        message: "Cart was not found",
      });
    }

    const updated = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      data: { cart: formatCart(updated) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.put("/coupon", async (req, res, next) => {
  try {
    const input = couponSchema.parse(req.body);
    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      input.guestCartId,
    );

    await CartModel.updateOne(
      scope.filter,
      {
        $setOnInsert: scope.setOnInsert,
        ...(input.couponCode
          ? { $set: { couponCode: input.couponCode } }
          : { $unset: { couponCode: "" } }),
      },
      { upsert: true },
    );

    const updated = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      data: {
        cart: formatCart(updated),
        couponReady: true,
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/", async (req, res, next) => {
  try {
    const query = cartQuerySchema.parse(req.query);
    const scope = resolveCartScope(
      getPrincipal(res)?.userId,
      query.guestCartId,
    );

    const updateResult = await CartModel.updateOne(scope.filter, {
      $set: { items: [] },
      $unset: { couponCode: "" },
    });

    if (updateResult.matchedCount === 0) {
      sendSuccess(res, {
        data: { cart: null, cleared: true },
        requestId: getRequestId(res),
      });
      return;
    }

    const updated = await CartModel.findOne(scope.filter).lean();

    sendSuccess(res, {
      data: { cart: formatCart(updated), cleared: true },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

function resolveCartScope(
  userId: string | undefined,
  guestCartId: string | undefined,
) {
  if (userId) {
    return {
      filter: { userId },
      setOnInsert: { userId: new Types.ObjectId(userId) },
    };
  }

  if (!guestCartId) {
    throw new AppError({
      statusCode: 422,
      code: "GUEST_CART_ID_REQUIRED",
      message: "guestCartId is required for guest cart operations",
    });
  }

  return {
    filter: { guestCartId },
    setOnInsert: { guestCartId },
  };
}

function formatCart(
  cart: {
    _id?: unknown;
    guestCartId?: string | null;
    couponCode?: string | null;
    currency?: string | null;
    items?: Array<{
      productId: unknown;
      quantity: number;
      unitPrice: number;
      title: string;
      slug: string;
      imageUrl?: string | null;
    }>;
  } | null,
) {
  const items = cart?.items ?? [];
  const subTotal = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  return {
    id: cart?._id ? String(cart._id) : null,
    guestCartId: cart?.guestCartId ?? null,
    currency: cart?.currency ?? "BDT",
    couponCode: cart?.couponCode ?? null,
    items: items.map((item) => ({
      productId: String(item.productId),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.quantity * item.unitPrice,
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl ?? null,
    })),
    summary: {
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subTotal,
      discountTotal: 0,
      total: subTotal,
    },
  };
}
