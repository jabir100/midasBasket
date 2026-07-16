import { Router } from "express";
import { Types } from "mongoose";
import sharp from "sharp";
import { AppError } from "../../core/errors/app-error.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { uploadMiddleware } from "../../core/middlewares/upload.middleware.js";
import { deleteFromCloudinary, uploadToCloudinary, } from "../../core/services/cloudinary.service.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { requireRoles } from "../auth/authorization.middleware.js";
import { invalidateHomepageCache } from "../homepage/homepage-cache.service.js";
import { BrandModel, CategoryModel, ProductModel } from "./catalog.model.js";
import { brandSchema, categorySchema, listQuerySchema, MAX_PRODUCT_IMAGES, productSchema, } from "./catalog.schemas.js";
export const catalogRouter = Router();
const adminRouter = Router();
const listCacheControl = "public, max-age=120, s-maxage=600, stale-while-revalidate=1800";
const detailCacheControl = "public, max-age=60, s-maxage=300, stale-while-revalidate=900";
function setCatalogCacheHeader(res, value) {
    res.setHeader("Cache-Control", value);
}
function toStringValue(value) {
    return typeof value === "string" ? value : undefined;
}
function toBooleanValue(value) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false;
        }
    }
    return undefined;
}
function toNumberValue(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}
function parseCategoryInput(body) {
    const input = {};
    const name = toStringValue(body.name);
    const slug = toStringValue(body.slug);
    const description = toStringValue(body.description);
    const isActive = toBooleanValue(body.isActive);
    const isFeatured = toBooleanValue(body.isFeatured);
    if (name !== undefined) {
        input.name = name;
    }
    if (slug !== undefined) {
        input.slug = slug;
    }
    if (description !== undefined) {
        input.description = description;
    }
    if (isActive !== undefined) {
        input.isActive = isActive;
    }
    if (isFeatured !== undefined) {
        input.isFeatured = isFeatured;
    }
    return input;
}
function parseJsonArrayValue(value, code) {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== "string") {
        throw new AppError({
            statusCode: 400,
            code,
            message: `Expected a JSON array string for this field`,
        });
    }
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            throw new Error("not an array");
        }
        return parsed;
    }
    catch {
        throw new AppError({
            statusCode: 400,
            code,
            message: `Malformed JSON array payload`,
        });
    }
}
function parseProductInput(body) {
    const input = {};
    const name = toStringValue(body.name);
    const slug = toStringValue(body.slug);
    const sku = toStringValue(body.sku);
    const description = toStringValue(body.description);
    const shortDescription = toStringValue(body.shortDescription);
    const categoryId = toStringValue(body.categoryId);
    const brandId = toStringValue(body.brandId);
    const price = toNumberValue(body.price);
    const compareAtPrice = toNumberValue(body.compareAtPrice);
    const stockQuantity = toNumberValue(body.stockQuantity);
    const isPublished = toBooleanValue(body.isPublished);
    const variants = parseJsonArrayValue(body.variants, "INVALID_VARIANTS_PAYLOAD");
    const tags = parseJsonArrayValue(body.tags, "INVALID_TAGS_PAYLOAD");
    if (name !== undefined) {
        input.name = name;
    }
    if (slug !== undefined) {
        input.slug = slug;
    }
    if (sku !== undefined) {
        input.sku = sku;
    }
    if (description !== undefined) {
        input.description = description;
    }
    if (shortDescription !== undefined) {
        input.shortDescription = shortDescription;
    }
    if (categoryId !== undefined) {
        input.categoryId = categoryId;
    }
    if (brandId !== undefined) {
        input.brandId = brandId;
    }
    if (price !== undefined) {
        input.price = price;
    }
    if (compareAtPrice !== undefined) {
        input.compareAtPrice = compareAtPrice;
    }
    if (stockQuantity !== undefined) {
        input.stockQuantity = stockQuantity;
    }
    if (isPublished !== undefined) {
        input.isPublished = isPublished;
    }
    if (variants !== undefined) {
        input.variants = variants;
    }
    if (tags !== undefined) {
        input.tags = tags;
    }
    return input;
}
function computeTotalStock(variants, fallbackStockQuantity) {
    if (variants && variants.length > 0) {
        return variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    }
    return fallbackStockQuantity ?? 0;
}
async function uploadCatalogImage(file, folder) {
    const processedBuffer = await sharp(file.buffer)
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    return uploadToCloudinary(processedBuffer, `catalog/${folder}`);
}
catalogRouter.get("/categories", async (_req, res, next) => {
    try {
        setCatalogCacheHeader(res, listCacheControl);
        const categories = await CategoryModel.find({ isActive: true })
            .sort({ name: 1 })
            .lean();
        sendSuccess(res, { data: { categories }, requestId: getRequestId(res) });
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
catalogRouter.get("/products", async (req, res, next) => {
    try {
        setCatalogCacheHeader(res, listCacheControl);
        const query = listQuerySchema.parse(req.query);
        const filter = { isPublished: true };
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
        const sort = query.sort === "price-asc"
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
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
adminRouter.use(authenticateAccessToken, requireRoles(["admin"]));
adminRouter.get("/categories", async (_req, res, next) => {
    try {
        const categories = await CategoryModel.find().sort({ name: 1 }).lean();
        sendSuccess(res, { data: { categories }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/categories", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        const parsedInput = categorySchema.parse(parseCategoryInput(req.body));
        const imageAlt = toStringValue(req.body.imageAlt);
        const categoryPayload = { ...parsedInput };
        if (req.file) {
            const uploadResult = await uploadCatalogImage(req.file, "categories");
            categoryPayload.image = {
                url: uploadResult.url,
                alt: imageAlt ?? parsedInput.name,
                publicId: uploadResult.publicId,
            };
        }
        const category = await CategoryModel.create(categoryPayload);
        await invalidateHomepageCache("category.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { category },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/categories/:id", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        const parsedInput = categorySchema
            .partial()
            .parse(parseCategoryInput(req.body));
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            throw new AppError({
                statusCode: 404,
                code: "CATEGORY_NOT_FOUND",
                message: "Category was not found",
            });
        }
        const patchPayload = { ...parsedInput };
        const imageAlt = toStringValue(req.body.imageAlt);
        if (req.file) {
            const uploadResult = await uploadCatalogImage(req.file, "categories");
            patchPayload.image = {
                url: uploadResult.url,
                alt: imageAlt ?? category.image?.alt ?? category.name,
                publicId: uploadResult.publicId,
            };
            if (category.image?.publicId) {
                await deleteFromCloudinary(category.image.publicId);
            }
        }
        else if (imageAlt && category.image?.url) {
            patchPayload.image = {
                url: category.image.url,
                publicId: category.image.publicId,
                alt: imageAlt,
            };
        }
        const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, { $set: patchPayload }, { new: true });
        await invalidateHomepageCache("category.updated");
        sendSuccess(res, {
            data: { category: updatedCategory },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/categories/:id", async (req, res, next) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (category?.image?.publicId) {
            await deleteFromCloudinary(category.image.publicId);
        }
        await CategoryModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("category.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/brands", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        const parsedInput = brandSchema.parse(parseCategoryInput(req.body));
        const imageAlt = toStringValue(req.body.imageAlt);
        const brandPayload = { ...parsedInput };
        if (req.file) {
            const uploadResult = await uploadCatalogImage(req.file, "brands");
            brandPayload.logo = {
                url: uploadResult.url,
                alt: imageAlt ?? parsedInput.name,
                publicId: uploadResult.publicId,
            };
        }
        const brand = await BrandModel.create(brandPayload);
        await invalidateHomepageCache("brand.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { brand },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get("/brands", async (_req, res, next) => {
    try {
        const brands = await BrandModel.find().sort({ name: 1 }).lean();
        sendSuccess(res, { data: { brands }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/brands/:id", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        const parsedInput = brandSchema
            .partial()
            .parse(parseCategoryInput(req.body));
        const brand = await BrandModel.findById(req.params.id);
        if (!brand) {
            throw new AppError({
                statusCode: 404,
                code: "BRAND_NOT_FOUND",
                message: "Brand was not found",
            });
        }
        const patchPayload = { ...parsedInput };
        const imageAlt = toStringValue(req.body.imageAlt);
        if (req.file) {
            const uploadResult = await uploadCatalogImage(req.file, "brands");
            patchPayload.logo = {
                url: uploadResult.url,
                alt: imageAlt ?? brand.logo?.alt ?? brand.name,
                publicId: uploadResult.publicId,
            };
            if (brand.logo?.publicId) {
                await deleteFromCloudinary(brand.logo.publicId);
            }
        }
        else if (imageAlt && brand.logo?.url) {
            patchPayload.logo = {
                url: brand.logo.url,
                publicId: brand.logo.publicId,
                alt: imageAlt,
            };
        }
        const updatedBrand = await BrandModel.findByIdAndUpdate(req.params.id, { $set: patchPayload }, { new: true });
        await invalidateHomepageCache("brand.updated");
        sendSuccess(res, {
            data: { brand: updatedBrand },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get("/products", async (_req, res, next) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
        sendSuccess(res, { data: { products }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.get("/products/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id).lean();
        if (!product) {
            throw new AppError({
                statusCode: 404,
                code: "PRODUCT_NOT_FOUND",
                message: "Product was not found",
            });
        }
        sendSuccess(res, { data: { product }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/brands/:id", async (req, res, next) => {
    try {
        const brand = await BrandModel.findById(req.params.id);
        if (brand?.logo?.publicId) {
            await deleteFromCloudinary(brand.logo.publicId);
        }
        await BrandModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("brand.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/products", uploadMiddleware.array("images", MAX_PRODUCT_IMAGES), async (req, res, next) => {
    try {
        const input = productSchema.parse(parseProductInput(req.body));
        const files = req.files ?? [];
        const newImageColors = (parseJsonArrayValue(req.body.newImageColors, "INVALID_IMAGE_COLORS_PAYLOAD") ??
            []).filter((value) => value === null || typeof value === "string");
        const images = [...(input.images ?? [])];
        for (const [index, file] of files.entries()) {
            const uploadResult = await uploadCatalogImage(file, "products");
            const color = newImageColors[index];
            images.push({
                url: uploadResult.url,
                alt: input.name,
                publicId: uploadResult.publicId,
                ...(color ? { color } : {}),
            });
        }
        const totalStock = computeTotalStock(input.variants, input.stockQuantity);
        const product = await ProductModel.create({
            ...input,
            ...(images.length > 0 ? { images } : {}),
            stockQuantity: totalStock,
            publishedAt: input.isPublished ? new Date() : undefined,
        });
        await invalidateHomepageCache("product.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { product },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/products/:id", uploadMiddleware.array("images", MAX_PRODUCT_IMAGES), async (req, res, next) => {
    try {
        const parsedInput = productSchema
            .partial()
            .parse(parseProductInput(req.body));
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            throw new AppError({
                statusCode: 404,
                code: "PRODUCT_NOT_FOUND",
                message: "Product was not found",
            });
        }
        const patchPayload = { ...parsedInput };
        const files = req.files ?? [];
        const removeImagePublicIds = (parseJsonArrayValue(req.body.removeImagePublicIds, "INVALID_REMOVE_IMAGES_PAYLOAD") ?? []).filter((value) => typeof value === "string");
        const imageOrder = (parseJsonArrayValue(req.body.imageOrder, "INVALID_IMAGE_ORDER_PAYLOAD") ?? []).filter((value) => typeof value === "string");
        const imageColorsEntries = parseJsonArrayValue(req.body.imageColors, "INVALID_IMAGE_COLORS_PAYLOAD");
        const imageColors = new Map(imageColorsEntries ?? []);
        const newImageColors = (parseJsonArrayValue(req.body.newImageColors, "INVALID_IMAGE_COLORS_PAYLOAD") ??
            []).filter((value) => value === null || typeof value === "string");
        let remainingImages = (product.images ?? [])
            .filter((image) => !image.publicId || !removeImagePublicIds.includes(image.publicId))
            .map((image) => ({
            url: image.url,
            alt: image.alt,
            ...(image.publicId ? { publicId: image.publicId } : {}),
            ...(image.color ? { color: image.color } : {}),
        }));
        if (imageColors.size > 0) {
            remainingImages = remainingImages.map((image) => {
                if (!image.publicId || !imageColors.has(image.publicId)) {
                    return image;
                }
                const color = imageColors.get(image.publicId);
                return { ...image, ...(color ? { color } : {}) };
            });
        }
        if (imageOrder.length > 0) {
            const byPublicId = new Map(remainingImages.map((image) => [image.publicId, image]));
            const ordered = imageOrder
                .map((publicId) => byPublicId.get(publicId))
                .filter((image) => Boolean(image));
            const orderedPublicIds = new Set(imageOrder);
            const unordered = remainingImages.filter((image) => !image.publicId || !orderedPublicIds.has(image.publicId));
            remainingImages = [...ordered, ...unordered];
        }
        for (const publicId of removeImagePublicIds) {
            await deleteFromCloudinary(publicId);
        }
        const newImages = [];
        for (const [index, file] of files.entries()) {
            const uploadResult = await uploadCatalogImage(file, "products");
            const color = newImageColors[index];
            newImages.push({
                url: uploadResult.url,
                alt: parsedInput.name ?? product.name,
                publicId: uploadResult.publicId,
                ...(color ? { color } : {}),
            });
        }
        if (removeImagePublicIds.length > 0 ||
            newImages.length > 0 ||
            imageOrder.length > 0 ||
            imageColors.size > 0) {
            patchPayload.images = [...remainingImages, ...newImages];
        }
        const nextVariants = parsedInput.variants ?? product.variants;
        const nextStockQuantity = parsedInput.variants !== undefined || parsedInput.stockQuantity !== undefined
            ? computeTotalStock(nextVariants, parsedInput.stockQuantity ?? product.stockQuantity)
            : undefined;
        if (nextStockQuantity !== undefined) {
            patchPayload.stockQuantity = nextStockQuantity;
        }
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
            $set: {
                ...patchPayload,
                ...(parsedInput.isPublished ? { publishedAt: new Date() } : {}),
            },
        }, { new: true });
        await invalidateHomepageCache("product.updated");
        sendSuccess(res, { data: { product: updatedProduct }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/products/:id", async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        for (const image of product?.images ?? []) {
            if (image.publicId) {
                await deleteFromCloudinary(image.publicId);
            }
        }
        await ProductModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("product.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
catalogRouter.use("/admin", adminRouter);
//# sourceMappingURL=catalog.router.js.map