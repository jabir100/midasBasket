 
import { Router, type Router as ExpressRouter } from "express";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import {
  authenticateAccessToken,
  authenticateOptionalAccessToken,
} from "../auth/authentication.middleware.js";
import { getPrincipal } from "../auth/authorization.middleware.js";
import { CartModel } from "../cart/cart.model.js";
import { ProductModel } from "../catalog/catalog.model.js";
import { OrderModel } from "./order.model.js";
import {
  checkoutSchema,
  orderIdParamSchema,
  trackOrderQuerySchema,
} from "./order.schemas.js";

export const ordersRouter: ExpressRouter = Router();

ordersRouter.post(
  "/checkout",
  authenticateOptionalAccessToken,
  async (req, res, next) => {
    try {
      const input = checkoutSchema.parse(req.body);
      const principal = getPrincipal(res);

      const cart = await getCheckoutCart(principal?.userId, input.guestCartId);

      if (!cart || cart.items.length === 0) {
        throw new AppError({
          statusCode: 422,
          code: "CART_EMPTY",
          message: "Cart is empty",
        });
      }

      const productIds = cart.items.map((item) => item.productId.toString());
      const products = await ProductModel.find({
        _id: { $in: productIds },
        isPublished: true,
      }).lean();

      const productsById = new Map(
        products.map((product) => [String(product._id), product]),
      );
      const orderItems = cart.items.map((item) => {
        const product = productsById.get(item.productId.toString());

        if (!product) {
          throw new AppError({
            statusCode: 422,
            code: "PRODUCT_UNAVAILABLE",
            message: "One or more cart items are unavailable",
          });
        }

        const variant =
          item.size && item.color
            ? product.variants?.find(
                (v) => v.size === item.size && v.color === item.color,
              )
            : undefined;
        const availableStock = variant
          ? variant.stockQuantity
          : product.stockQuantity;

        if (availableStock < item.quantity) {
          throw new AppError({
            statusCode: 422,
            code: "INSUFFICIENT_STOCK",
            message: `${product.name} does not have enough stock`,
          });
        }

        return {
          productId: product._id,
          title: product.name,
          slug: product.slug,
          imageUrl: product.images[0]?.url,
          quantity: item.quantity,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
          size: item.size ?? undefined,
          color: item.color ?? undefined,
        };
      });

      const subTotal = orderItems.reduce(
        (total, item) => total + item.lineTotal,
        0,
      );
      const shippingFee = subTotal >= 2_000 ? 0 : 120;
      const discountTotal = 0;
      const total = subTotal + shippingFee - discountTotal;
      const orderNumber = createOrderNumber();

      // Decrement stock atomically before creating the order (guarded by
      // $gte so concurrent checkouts can't drive stock negative), rolling
      // back any already-applied decrements if a later item fails — this
      // repo has no multi-document transaction support (standalone MongoDB).
      const appliedDecrements: (typeof orderItems)[number][] = [];
      try {
        for (const item of orderItems) {
          const filter: Record<string, unknown> = item.size && item.color
            ? {
                _id: item.productId,
                variants: {
                  $elemMatch: {
                    size: item.size,
                    color: item.color,
                    stockQuantity: { $gte: item.quantity },
                  },
                },
              }
            : { _id: item.productId, stockQuantity: { $gte: item.quantity } };

          const update =
            item.size && item.color
              ? {
                  $inc: {
                    "variants.$[v].stockQuantity": -item.quantity,
                    stockQuantity: -item.quantity,
                  },
                }
              : { $inc: { stockQuantity: -item.quantity } };
          const options =
            item.size && item.color
              ? {
                  arrayFilters: [
                    { "v.size": item.size, "v.color": item.color },
                  ],
                }
              : {};

          const result = await ProductModel.updateOne(filter, update, options);

          if (result.matchedCount === 0) {
            throw new AppError({
              statusCode: 422,
              code: "INSUFFICIENT_STOCK",
              message: `${item.title} does not have enough stock`,
            });
          }

          appliedDecrements.push(item);
        }
      } catch (error) {
        await Promise.all(
          appliedDecrements.map((item) => {
            const update =
              item.size && item.color
                ? {
                    $inc: {
                      "variants.$[v].stockQuantity": item.quantity,
                      stockQuantity: item.quantity,
                    },
                  }
                : { $inc: { stockQuantity: item.quantity } };
            const options =
              item.size && item.color
                ? {
                    arrayFilters: [
                      { "v.size": item.size, "v.color": item.color },
                    ],
                  }
                : {};
            return ProductModel.updateOne(
              { _id: item.productId },
              update,
              options,
            );
          }),
        );
        throw error;
      }

      const order = await OrderModel.create({
        orderNumber,
        ...(principal?.userId
          ? { userId: new Types.ObjectId(principal.userId) }
          : { guestCartId: cart.guestCartId }),
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        notes: input.notes,
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        statusTimeline: [
          {
            status: "placed",
            timestamp: new Date(),
            updatedBy: principal?.userId ?? "guest-checkout",
            note: "Order created by checkout",
          },
        ],
        items: orderItems,
        currency: cart.currency ? cart.currency : "BDT",
        couponCode: cart.couponCode,
        subTotal,
        shippingFee,
        discountTotal,
        total,
      });

      await CartModel.updateOne(
        { _id: cart._id },
        {
          $set: { items: [] },
          $unset: { couponCode: "" },
        },
      );

      sendSuccess(res, {
        statusCode: 201,
        data: {
          order: serializeOrder(order.toObject()),
        },
        requestId: getRequestId(res),
      });
    } catch (error) {
      next(error);
    }
  },
);

ordersRouter.get("/me", authenticateAccessToken, async (_req, res, next) => {
  try {
    const principal = getPrincipal(res);

    if (!principal) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    const orders = await OrderModel.find({ userId: principal.userId })
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, {
      data: {
        orders: orders.map((order) => serializeOrder(order)),
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/me/:id", authenticateAccessToken, async (req, res, next) => {
  try {
    const principal = getPrincipal(res);

    if (!principal) {
      throw new AppError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required",
      });
    }

    const params = orderIdParamSchema.parse(req.params);
    const order = await OrderModel.findOne({
      _id: params.id,
      userId: principal.userId,
    }).lean();

    if (!order) {
      throw new AppError({
        statusCode: 404,
        code: "ORDER_NOT_FOUND",
        message: "Order was not found",
      });
    }

    sendSuccess(res, {
      data: { order: serializeOrder(order) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/track/:orderNumber", async (req, res, next) => {
  try {
    const query = trackOrderQuerySchema.parse(req.query);
    const order = await OrderModel.findOne({
      orderNumber: req.params.orderNumber.toUpperCase(),
      ...(query.email ? { customerEmail: query.email } : {}),
    }).lean();

    if (!order) {
      throw new AppError({
        statusCode: 404,
        code: "ORDER_NOT_FOUND",
        message: "Order was not found",
      });
    }

    sendSuccess(res, {
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          statusTimeline: order.statusTimeline,
          createdAt: order.createdAt,
          currency: order.currency,
          subTotal: order.subTotal,
          shippingFee: order.shippingFee,
          discountTotal: order.discountTotal,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          items: order.items,
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

function createOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `MB-${datePart}-${randomPart}`;
}

async function getCheckoutCart(
  userId: string | undefined,
  guestCartId: string | undefined,
) {
  if (userId) {
    return CartModel.findOne({ userId });
  }

  if (!guestCartId) {
    throw new AppError({
      statusCode: 422,
      code: "GUEST_CART_ID_REQUIRED",
      message: "guestCartId is required for guest checkout",
    });
  }

  return CartModel.findOne({ guestCartId });
}

function serializeOrder(order: {
  _id: unknown;
  orderNumber: string;
  status: string;
  statusTimeline: {
    status: string;
    timestamp: Date;
    updatedBy: string;
    note?: string | null;
  }[];
  createdAt?: Date;
  paymentMethod: string;
  paymentStatus: string;
  subTotal: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  currency: string;
  items: {
    productId: unknown;
    title: string;
    slug: string;
    imageUrl?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    size?: string | null;
    color?: string | null;
  }[];
}) {
  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    status: order.status,
    statusTimeline: order.statusTimeline,
    createdAt: order.createdAt,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    totals: {
      subTotal: order.subTotal,
      shippingFee: order.shippingFee,
      discountTotal: order.discountTotal,
      total: order.total,
      currency: order.currency,
    },
    items: order.items.map((item) => ({
      productId: String(item.productId),
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      size: item.size ?? null,
      color: item.color ?? null,
    })),
  };
}
