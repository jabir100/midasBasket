import { Router, type Response, type Router as ExpressRouter } from "express";
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { requireRoles } from "../auth/authorization.middleware.js";
import { invalidateHomepageCache } from "../homepage/homepage-cache.service.js";
import { BrandModel, CategoryModel, ProductModel } from "./catalog.model.js";
import {
  brandSchema,
  categorySchema,
  listQuerySchema,
  productSchema,
} from "./catalog.schemas.js";

export const catalogRouter: ExpressRouter = Router();
const adminRouter = Router();

const listCacheControl =
  "public, max-age=120, s-maxage=600, stale-while-revalidate=1800";
const detailCacheControl =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=900";

function setCatalogCacheHeader(res: Response, value: string): void {
  res.setHeader("Cache-Control", value);
}

catalogRouter.get("/categories", async (_req, res, next) => {
  try {
    setCatalogCacheHeader(res, listCacheControl);
    const categories = await CategoryModel.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    sendSuccess(res, { data: { categories }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/brands", async (_req, res, next) => {
  try {
    setCatalogCacheHeader(res, listCacheControl);
    const brands = await BrandModel.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    sendSuccess(res, { data: { brands }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/products", async (req, res, next) => {
  try {
    setCatalogCacheHeader(res, listCacheControl);
    const query = listQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = { isPublished: true };

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.category) {
      const category = await CategoryModel.findOne({
        slug: query.category,
        isActive: true,
      }).select("_id");
      filter.categoryId = category?._id ?? new Types.ObjectId();
    }

    if (query.brand) {
      const brand = await BrandModel.findOne({
        slug: query.brand,
        isActive: true,
      }).select("_id");
      filter.brandId = brand?._id ?? new Types.ObjectId();
    }

    const sort: Record<string, 1 | -1> =
      query.sort === "price-asc"
        ? { price: 1 }
        : query.sort === "price-desc"
          ? { price: -1 }
          : { createdAt: -1 };
    const skip = (query.page - 1) * query.limit;
    const [products, total] = await Promise.all([
      ProductModel.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
      ProductModel.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: { products },
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

catalogRouter.get("/products/:slug", async (req, res, next) => {
  try {
    setCatalogCacheHeader(res, detailCacheControl);
    const product = await ProductModel.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).lean();

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "Product was not found",
      });
    }

    sendSuccess(res, { data: { product }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.use(authenticateAccessToken, requireRoles(["admin"]));

adminRouter.get("/categories", async (_req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    sendSuccess(res, { data: { categories }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/categories", async (req, res, next) => {
  try {
    const category = await CategoryModel.create(categorySchema.parse(req.body));
    await invalidateHomepageCache("category.created");
    sendSuccess(res, {
      statusCode: 201,
      data: { category },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/categories/:id", async (req, res, next) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      categorySchema.partial().parse(req.body),
      { new: true },
    );
    if (!category) {
      throw new AppError({
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category was not found",
      });
    }
    await invalidateHomepageCache("category.updated");
    sendSuccess(res, { data: { category }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/categories/:id", async (req, res, next) => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.id);
    await invalidateHomepageCache("category.deleted");
    sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/brands", async (req, res, next) => {
  try {
    const brand = await BrandModel.create(brandSchema.parse(req.body));
    await invalidateHomepageCache("brand.created");
    sendSuccess(res, {
      statusCode: 201,
      data: { brand },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/brands", async (_req, res, next) => {
  try {
    const brands = await BrandModel.find().sort({ name: 1 }).lean();
    sendSuccess(res, { data: { brands }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/brands/:id", async (req, res, next) => {
  try {
    const brand = await BrandModel.findByIdAndUpdate(
      req.params.id,
      brandSchema.partial().parse(req.body),
      { new: true },
    );
    if (!brand) {
      throw new AppError({
        statusCode: 404,
        code: "BRAND_NOT_FOUND",
        message: "Brand was not found",
      });
    }
    await invalidateHomepageCache("brand.updated");
    sendSuccess(res, { data: { brand }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/products", async (_req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    sendSuccess(res, { data: { products }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/brands/:id", async (req, res, next) => {
  try {
    await BrandModel.findByIdAndDelete(req.params.id);
    await invalidateHomepageCache("brand.deleted");
    sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/products", async (req, res, next) => {
  try {
    const input = productSchema.parse(req.body);
    const product = await ProductModel.create({
      ...input,
      publishedAt: input.isPublished ? new Date() : undefined,
    });
    await invalidateHomepageCache("product.created");
    sendSuccess(res, {
      statusCode: 201,
      data: { product },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/products/:id", async (req, res, next) => {
  try {
    const input = productSchema.partial().parse(req.body);
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...input, ...(input.isPublished ? { publishedAt: new Date() } : {}) },
      { new: true },
    );
    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "Product was not found",
      });
    }
    await invalidateHomepageCache("product.updated");
    sendSuccess(res, { data: { product }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/products/:id", async (req, res, next) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    await invalidateHomepageCache("product.deleted");
    sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
  } catch (error) {
    next(error);
  }
});

catalogRouter.use("/admin", adminRouter);
