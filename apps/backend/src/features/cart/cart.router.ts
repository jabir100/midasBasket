import { Router, type Router as ExpressRouter } from "express";
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import {
  authenticateOptionalAccessToken,
  authenticateAccessToken,
} from "../auth/authentication.middleware.js";
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
    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: query.guestCartId,
      createIfMissing: false,
    });

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

    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: input.guestCartId,
      createIfMissing: true,
    });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === input.productId,
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = Math.min(
        cart.items[itemIndex].quantity + input.quantity,
        99,
      );
      cart.items[itemIndex].unitPrice = product.price;
      cart.items[itemIndex].title = product.name;
      cart.items[itemIndex].slug = product.slug;
      cart.items[itemIndex].imageUrl = product.images?.[0]?.url;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(input.productId),
        quantity: input.quantity,
        unitPrice: product.price,
        title: product.name,
        slug: product.slug,
        imageUrl: product.images?.[0]?.url,
      });
    }

    await cart.save();

    sendSuccess(res, {
      statusCode: 201,
      data: { cart: formatCart(cart.toObject()) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.patch("/items/:productId", async (req, res, next) => {
  try {
    const input = updateCartItemSchema.parse(req.body);
    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: input.guestCartId,
      createIfMissing: false,
    });

    if (!cart) {
      throw new AppError({
        statusCode: 404,
        code: "CART_NOT_FOUND",
        message: "Cart was not found",
      });
    }

    const item = cart.items.find(
      (candidate) => candidate.productId.toString() === req.params.productId,
    );

    if (!item) {
      throw new AppError({
        statusCode: 404,
        code: "CART_ITEM_NOT_FOUND",
        message: "Cart item was not found",
      });
    }

    item.quantity = input.quantity;
    await cart.save();

    sendSuccess(res, {
      data: { cart: formatCart(cart.toObject()) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/items/:productId", async (req, res, next) => {
  try {
    const query = cartQuerySchema.parse(req.query);
    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: query.guestCartId,
      createIfMissing: false,
    });

    if (!cart) {
      throw new AppError({
        statusCode: 404,
        code: "CART_NOT_FOUND",
        message: "Cart was not found",
      });
    }

    const nextItems = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId,
    );

    cart.items = nextItems;
    await cart.save();

    sendSuccess(res, {
      data: { cart: formatCart(cart.toObject()) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.put("/coupon", async (req, res, next) => {
  try {
    const input = couponSchema.parse(req.body);
    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: input.guestCartId,
      createIfMissing: true,
    });

    cart.couponCode = input.couponCode;
    await cart.save();

    sendSuccess(res, {
      data: {
        cart: formatCart(cart.toObject()),
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
    const cart = await getResolvedCart({
      userId: getPrincipal(res)?.userId,
      guestCartId: query.guestCartId,
      createIfMissing: false,
    });

    if (!cart) {
      sendSuccess(res, {
        data: { cart: null, cleared: true },
        requestId: getRequestId(res),
      });
      return;
    }

    cart.items = [];
    cart.couponCode = undefined;
    await cart.save();

    sendSuccess(res, {
      data: { cart: formatCart(cart.toObject()), cleared: true },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

export async function requireCustomerCart(res: Parameters<typeof getPrincipal>[0]) {
  const principal = getPrincipal(res);

  if (!principal) {
    throw new AppError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required",
    });
  }

  return getResolvedCart({
    userId: principal.userId,
    createIfMissing: false,
  });
}

async function getResolvedCart(input: {
  userId?: string;
  guestCartId?: string;
  createIfMissing: boolean;
}) {
  if (input.userId) {
    const cart = await CartModel.findOne({ userId: input.userId });

    if (!cart && input.createIfMissing) {
      return CartModel.create({ userId: new Types.ObjectId(input.userId) });
    }

    return cart;
  }

  if (!input.guestCartId) {
    throw new AppError({
      statusCode: 422,
      code: "GUEST_CART_ID_REQUIRED",
      message: "guestCartId is required for guest cart operations",
    });
  }

  const cart = await CartModel.findOne({ guestCartId: input.guestCartId });

  if (!cart && input.createIfMissing) {
    return CartModel.create({ guestCartId: input.guestCartId });
  }

  return cart;
}

function formatCart(cart: {
  _id?: unknown;
  guestCartId?: string | null;
  couponCode?: string | null;
  currency?: string | null;
  items: Array<{
    productId: unknown;
    quantity: number;
    unitPrice: number;
    title: string;
    slug: string;
    imageUrl?: string | null;
  }>;
} | null) {
  if (!cart) {
    return {
      id: null,
      guestCartId: null,
      currency: "BDT",
      couponCode: null,
      items: [],
      summary: {
        itemCount: 0,
        subTotal: 0,
        discountTotal: 0,
        total: 0,
      },
    };
  }

  const subTotal = cart.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  return {
    id: cart._id ? String(cart._id) : null,
    guestCartId: cart.guestCartId ?? null,
    currency: cart.currency ?? "BDT",
    couponCode: cart.couponCode ?? null,
    items: cart.items.map((item) => ({
      productId: String(item.productId),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.quantity * item.unitPrice,
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl ?? null,
    })),
    summary: {
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      subTotal,
      discountTotal: 0,
      total: subTotal,
    },
  };
}
