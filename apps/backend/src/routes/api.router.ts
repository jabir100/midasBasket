import { Router, type Router as ExpressRouter } from "express";

import { adminRouter } from "../features/admin/admin.router.js";
import { authRouter } from "../features/auth/auth.router.js";
import { cartRouter } from "../features/cart/cart.router.js";
import { catalogRouter } from "../features/catalog/catalog.router.js";
import { healthRouter } from "../features/health/health.router.js";
import { homepageRouter } from "../features/homepage/homepage.router.js";
import { ordersRouter } from "../features/orders/orders.router.js";
import { usersRouter } from "../features/users/user.router.js";
import { wishlistRouter } from "../features/wishlist/wishlist.router.js";

export const apiRouter: ExpressRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/homepage", homepageRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/wishlist", wishlistRouter);
