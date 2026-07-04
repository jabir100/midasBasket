import { Router, type Router as ExpressRouter } from "express";

import { authRouter } from "../features/auth/auth.router.js";
import { cartRouter } from "../features/cart/cart.router.js";
import { catalogRouter } from "../features/catalog/catalog.router.js";
import { healthRouter } from "../features/health/health.router.js";
import { ordersRouter } from "../features/orders/orders.router.js";
import { wishlistRouter } from "../features/wishlist/wishlist.router.js";

export const apiRouter: ExpressRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/wishlist", wishlistRouter);
