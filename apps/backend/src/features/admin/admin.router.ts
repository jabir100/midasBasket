import { Router, type Router as ExpressRouter } from "express";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { getPrincipal, requireRoles } from "../auth/authorization.middleware.js";
import { UserModel } from "../users/user.model.js";
import { AuditLogModel } from "./audit-log.model.js";
import {
  adminOrdersQuerySchema,
  adminUserUpdateSchema,
  adminUsersQuerySchema,
  auditLogsQuerySchema,
  objectIdParamSchema,
  orderStatusUpdateSchema,
} from "./admin.schemas.js";
import { OrderModel, orderStatuses, type OrderStatus } from "../orders/order.model.js";

export const adminRouter: ExpressRouter = Router();

adminRouter.use(authenticateAccessToken, requireRoles(["admin"]));

adminRouter.get("/dashboard/summary", async (_req, res, next) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalAdmins,
      blockedUsers,
      totalOrders,
      recentOrders,
      totalRevenue,
      recentRevenue,
      orderStatusRows,
    ] = await Promise.all([
      UserModel.countDocuments({}),
      UserModel.countDocuments({ role: "customer" }),
      UserModel.countDocuments({ role: "admin" }),
      UserModel.countDocuments({ status: "blocked" }),
      OrderModel.countDocuments({}),
      OrderModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      OrderModel.aggregate([{ $group: { _id: null, value: { $sum: "$total" } } }]),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: null, value: { $sum: "$total" } } },
      ]),
      OrderModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    sendSuccess(res, {
      data: {
        users: {
          totalUsers,
          totalCustomers,
          totalAdmins,
          blockedUsers,
        },
        orders: {
          totalOrders,
          recentOrders,
          statusBreakdown: orderStatuses.map((status) => ({
            status,
            count: orderStatusRows.find((row) => row._id === status)?.count ?? 0,
          })),
        },
        revenue: {
          currency: "BDT",
          lifetime: Number(totalRevenue[0]?.value ?? 0),
          last7Days: Number(recentRevenue[0]?.value ?? 0),
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/dashboard/users", async (req, res, next) => {
  try {
    const query = adminUsersQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;
    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .select("name email phone role status createdAt updatedAt")
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: {
        users: users.map((user) => ({
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone ?? null,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      },
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/dashboard/users/:id", async (req, res, next) => {
  try {
    const principal = requireAdminPrincipal(res);
    const params = objectIdParamSchema.parse(req.params);
    const input = adminUserUpdateSchema.parse(req.body);

    if (params.id === principal.userId && input.role === "customer") {
      throw new AppError({
        statusCode: 422,
        code: "INVALID_ADMIN_MUTATION",
        message: "Admin role cannot be removed from the active session user",
      });
    }

    const user = await UserModel.findByIdAndUpdate(params.id, { $set: input }, { new: true })
      .select("name email phone role status createdAt updatedAt")
      .lean();

    if (!user) {
      throw new AppError({
        statusCode: 404,
        code: "USER_NOT_FOUND",
        message: "User was not found",
      });
    }

    await writeAuditLog({
      actorUserId: principal.userId,
      action: "admin.user.updated",
      entityType: "user",
      entityId: params.id,
      metadata: {
        changedFields: Object.keys(input),
        role: user.role,
        status: user.status,
      },
    });

    sendSuccess(res, {
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone ?? null,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/dashboard/orders", async (req, res, next) => {
  try {
    const query = adminOrdersQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.paymentStatus) {
      filter.paymentStatus = query.paymentStatus;
    }

    const skip = (query.page - 1) * query.limit;
    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      OrderModel.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: {
        orders: orders.map((order) => ({
          id: String(order._id),
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: order.status,
          paymentStatus: order.paymentStatus,
          total: order.total,
          currency: order.currency,
          createdAt: order.createdAt,
          statusTimeline: order.statusTimeline,
        })),
      },
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/dashboard/orders/:id/status", async (req, res, next) => {
  try {
    const principal = requireAdminPrincipal(res);
    const params = objectIdParamSchema.parse(req.params);
    const input = orderStatusUpdateSchema.parse(req.body);

    const order = await OrderModel.findById(params.id);
    const actor = await UserModel.findById(principal.userId).select("email").lean();

    if (!order) {
      throw new AppError({
        statusCode: 404,
        code: "ORDER_NOT_FOUND",
        message: "Order was not found",
      });
    }

    if (!isValidStatusTransition(order.status as OrderStatus, input.status)) {
      throw new AppError({
        statusCode: 422,
        code: "INVALID_ORDER_STATUS_TRANSITION",
        message: `Cannot transition order from ${order.status} to ${input.status}`,
      });
    }

    order.status = input.status;
    if (input.paymentStatus) {
      order.paymentStatus = input.paymentStatus;
    }

    order.statusTimeline.push({
      status: input.status,
      timestamp: new Date(),
      updatedBy: actor?.email ?? principal.userId,
      ...(input.note ? { note: input.note } : {}),
    });
    await order.save();

    await writeAuditLog({
      actorUserId: principal.userId,
      action: "admin.order.status.updated",
      entityType: "order",
      entityId: String(order._id),
      metadata: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });

    sendSuccess(res, {
      data: {
        order: {
          id: String(order._id),
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          statusTimeline: order.statusTimeline,
        },
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/dashboard/audit-logs", async (req, res, next) => {
  try {
    const query = auditLogsQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};

    if (query.action) {
      filter.action = query.action;
    }

    if (query.actorEmail) {
      filter.actorEmail = query.actorEmail;
    }

    const skip = (query.page - 1) * query.limit;
    const [logs, total] = await Promise.all([
      AuditLogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      AuditLogModel.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: {
        logs: logs.map((log) => ({
          id: String(log._id),
          actorUserId: String(log.actorUserId),
          actorEmail: log.actorEmail,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId,
          metadata: log.metadata ?? null,
          createdAt: log.createdAt,
        })),
      },
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

function requireAdminPrincipal(res: Parameters<typeof getPrincipal>[0]): {
  userId: string;
  sessionId: string;
  role: "admin";
} {
  const principal = getPrincipal(res);

  if (!principal || principal.role !== "admin") {
    throw new AppError({
      statusCode: 403,
      code: "INSUFFICIENT_PERMISSIONS",
      message: "Insufficient permissions",
    });
  }

  return {
    userId: principal.userId,
    role: "admin",
    sessionId: principal.sessionId,
  };
}

async function writeAuditLog(input: {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const actor = await UserModel.findById(input.actorUserId)
    .select("email")
    .lean();

  await AuditLogModel.create({
    actorUserId: input.actorUserId,
    actorEmail: actor?.email ?? "unknown",
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
  });
}

function isValidStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) {
    return true;
  }

  if (current === "cancelled" || current === "delivered") {
    return false;
  }

  if (next === "cancelled") {
    return true;
  }

  const order: OrderStatus[] = [
    "placed",
    "confirmed",
    "packed",
    "shipped",
    "out-for-delivery",
    "delivered",
  ];

  const currentIndex = order.indexOf(current);
  const nextIndex = order.indexOf(next);

  return currentIndex >= 0 && nextIndex >= 0 && nextIndex >= currentIndex;
}
