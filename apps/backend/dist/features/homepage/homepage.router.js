import { Router } from "express";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "../auth/authentication.middleware.js";
import { requireRoles } from "../auth/authorization.middleware.js";
import { BrandModel, CategoryModel, ProductModel } from "../catalog/catalog.model.js";
import { getHomepageCache, invalidateHomepageCache, setHomepageCache, } from "./homepage-cache.service.js";
import { BlogModel, HomepageSettingsModel, TestimonialModel, CarouselSlideModel, } from "./homepage.model.js";
import { blogSchema, homepageSettingsSchema, testimonialSchema, carouselSlideSchema, } from "./homepage.schemas.js";
import { AppError } from "../../core/errors/app-error.js";
import { uploadMiddleware } from "../../core/middlewares/upload.middleware.js";
import { uploadToCloudinary, deleteFromCloudinary, } from "../../core/services/cloudinary.service.js";
import sharp from "sharp";
export const homepageRouter = Router();
const adminRouter = Router();
const homepageCacheControl = "public, max-age=120, s-maxage=600, stale-while-revalidate=1800";
/* ------------------------------------------------------------------ */
/*  Public GET /homepage — assembles the full homepage payload         */
/* ------------------------------------------------------------------ */
homepageRouter.get("/", async (_req, res, next) => {
    try {
        res.setHeader("Cache-Control", homepageCacheControl);
        const cached = await getHomepageCache();
        if (cached) {
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(cached);
            return;
        }
        const [settings, featuredCategories, featuredBrands, carouselSlides] = await Promise.all([
            HomepageSettingsModel.findOne().lean(),
            CategoryModel.find({ isFeatured: true, isActive: true })
                .sort({ name: 1 })
                .limit(6)
                .lean(),
            BrandModel.find({ isFeatured: true, isActive: true })
                .sort({ name: 1 })
                .limit(8)
                .lean(),
            CarouselSlideModel.find({ isActive: true })
                .sort({ sortOrder: 1 })
                .lean(),
        ]);
        /* Resolve admin-picked product lists, preserving admin-chosen order */
        const popularProductIds = settings?.popularProductIds ?? [];
        const bestSellingProductIds = settings?.bestSellingProductIds ?? [];
        const pickedProductIds = [...popularProductIds, ...bestSellingProductIds];
        const pickedProducts = pickedProductIds.length
            ? await ProductModel.find({
                _id: { $in: pickedProductIds },
                isPublished: true,
            }).lean()
            : [];
        const pickedProductMap = new Map(pickedProducts.map((product) => [String(product._id), product]));
        const resolveOrderedProducts = (ids) => ids
            .map((id) => pickedProductMap.get(String(id)))
            .filter((product) => Boolean(product));
        const popularProducts = resolveOrderedProducts(popularProductIds);
        const bestSellingProducts = resolveOrderedProducts(bestSellingProductIds);
        /* Count products per featured category */
        const categoryProductCounts = await Promise.all(featuredCategories.map(async (category) => {
            const count = await ProductModel.countDocuments({
                categoryId: category._id,
                isPublished: true,
            });
            return { categoryId: String(category._id), count };
        }));
        const countMap = new Map(categoryProductCounts.map((c) => [c.categoryId, c.count]));
        const mapImage = (img) => img
            ? { src: String(img.url), alt: String(img.alt), width: 1200, height: 900 }
            : undefined;
        const mapProduct = (product) => ({
            id: String(product._id),
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            price: product.price,
            ...(product.compareAtPrice
                ? { compareAtPrice: product.compareAtPrice }
                : {}),
            stockQuantity: product.stockQuantity,
            currency: "BDT",
            rating: 0,
            reviewCount: 0,
            image: mapImage(product.images[0]) ?? {
                src: "/images/homepage/placeholder.webp",
                alt: product.name,
                width: 1200,
                height: 900,
            },
            ...(product.isFeatured ? { badge: "Featured" } : {}),
        });
        const hero = settings?.hero ?? {
            eyebrow: "Premium essentials, delivered fast",
            title: "Modern shopping for everyday wins",
            description: "A fast, secure, mobile-first ecommerce experience for curated products, trusted brands, and smooth checkout.",
            primaryAction: { href: "/products", label: "Shop products" },
            secondaryAction: { href: "/offers", label: "View offers" },
        };
        const payload = {
            success: true,
            data: {
                carousel: (carouselSlides ?? []).map((slide) => ({
                    id: String(slide._id),
                    image: {
                        src: slide.image?.url ?? "",
                        alt: slide.image?.alt ?? "",
                        width: 1920,
                        height: 1080,
                    },
                    linkHref: slide.linkHref,
                    title: slide.title ?? "",
                    description: slide.description ?? "",
                    sortOrder: slide.sortOrder,
                    isActive: slide.isActive,
                })),
                hero: {
                    eyebrow: hero.eyebrow ?? "",
                    title: hero.title ?? "Modern shopping for everyday wins",
                    description: hero.description ?? "",
                    primaryAction: hero.primaryAction ?? {
                        href: "/products",
                        label: "Shop products",
                    },
                    secondaryAction: hero.secondaryAction ?? {
                        href: "/offers",
                        label: "View offers",
                    },
                    image: mapImage(settings?.hero?.image) ?? {
                        src: "/images/homepage/placeholder.webp",
                        alt: "Midas Basket premium storefront",
                        width: 1200,
                        height: 900,
                    },
                },
                featuredCategories: featuredCategories.map((category) => ({
                    id: String(category._id),
                    name: category.name,
                    slug: category.slug,
                    image: mapImage(category.image) ?? {
                        src: "/images/homepage/placeholder.webp",
                        alt: category.name,
                        width: 1200,
                        height: 900,
                    },
                    productCount: countMap.get(String(category._id)) ?? 0,
                })),
                popularProducts: popularProducts.map(mapProduct),
                bestSellingProducts: bestSellingProducts.map(mapProduct),
                featuredBrands: featuredBrands.map((brand) => ({
                    id: String(brand._id),
                    name: brand.name,
                    slug: brand.slug,
                    logo: mapImage(brand.logo) ?? {
                        src: "/images/homepage/placeholder.webp",
                        alt: brand.name,
                        width: 1200,
                        height: 900,
                    },
                })),
                whyChooseUs: settings?.whyChooseUs && settings.whyChooseUs.length > 0
                    ? settings.whyChooseUs.map((item, index) => ({
                        id: `value-${index.toString()}`,
                        title: item.title,
                        description: item.description ?? "",
                    }))
                    : [
                        {
                            id: "secure",
                            title: "Security-led platform",
                            description: "Backend-first authorization, HTTP-only session strategy, strict validation, and audit-ready foundations.",
                        },
                        {
                            id: "fast",
                            title: "Built for speed",
                            description: "SSR-friendly sections, cache-backed homepage, lean interactions, and semantic HTML.",
                        },
                        {
                            id: "curated",
                            title: "Curated buying experience",
                            description: "Clear category paths, product highlights, trusted brands, and friction-light shopping journeys.",
                        },
                    ],
                generatedAt: new Date().toISOString(),
            },
            requestId: getRequestId(res),
        };
        const serialized = JSON.stringify(payload);
        await setHomepageCache(serialized);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(serialized);
    }
    catch (error) {
        next(error);
    }
});
/* ------------------------------------------------------------------ */
/*  Admin routes for homepage settings, testimonials, and blogs       */
/* ------------------------------------------------------------------ */
adminRouter.use(authenticateAccessToken, requireRoles(["admin"]));
/* Homepage settings — upsert pattern */
adminRouter.get("/settings", async (_req, res, next) => {
    try {
        const settings = await HomepageSettingsModel.findOne().lean();
        sendSuccess(res, { data: { settings: settings ?? {} }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.put("/settings", async (req, res, next) => {
    try {
        const input = homepageSettingsSchema.parse(req.body);
        const settings = await HomepageSettingsModel.findOneAndUpdate({}, { $set: input }, { new: true, upsert: true });
        await invalidateHomepageCache("homepage-settings.updated");
        sendSuccess(res, { data: { settings }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
/* Testimonials CRUD */
adminRouter.get("/testimonials", async (_req, res, next) => {
    try {
        const testimonials = await TestimonialModel.find()
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();
        sendSuccess(res, { data: { testimonials }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/testimonials", async (req, res, next) => {
    try {
        const input = testimonialSchema.parse(req.body);
        const testimonial = await TestimonialModel.create(input);
        await invalidateHomepageCache("testimonial.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { testimonial },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/testimonials/:id", async (req, res, next) => {
    try {
        const input = testimonialSchema.partial().parse(req.body);
        const testimonial = await TestimonialModel.findByIdAndUpdate(req.params.id, input, { new: true });
        if (!testimonial) {
            throw new AppError({
                statusCode: 404,
                code: "TESTIMONIAL_NOT_FOUND",
                message: "Testimonial was not found",
            });
        }
        await invalidateHomepageCache("testimonial.updated");
        sendSuccess(res, { data: { testimonial }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/testimonials/:id", async (req, res, next) => {
    try {
        await TestimonialModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("testimonial.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
/* Blog CRUD */
adminRouter.get("/blogs", async (_req, res, next) => {
    try {
        const blogs = await BlogModel.find()
            .sort({ createdAt: -1 })
            .lean();
        sendSuccess(res, { data: { blogs }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/blogs", async (req, res, next) => {
    try {
        const input = blogSchema.parse(req.body);
        const blog = await BlogModel.create({
            ...input,
            publishedAt: input.isPublished ? new Date() : undefined,
        });
        await invalidateHomepageCache("blog.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { blog },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/blogs/:id", async (req, res, next) => {
    try {
        const input = blogSchema.partial().parse(req.body);
        const blog = await BlogModel.findByIdAndUpdate(req.params.id, {
            ...input,
            ...(input.isPublished ? { publishedAt: new Date() } : {}),
        }, { new: true });
        if (!blog) {
            throw new AppError({
                statusCode: 404,
                code: "BLOG_NOT_FOUND",
                message: "Blog was not found",
            });
        }
        await invalidateHomepageCache("blog.updated");
        sendSuccess(res, { data: { blog }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/blogs/:id", async (req, res, next) => {
    try {
        await BlogModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("blog.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
/* Carousel CRUD */
adminRouter.get("/carousel", async (_req, res, next) => {
    try {
        const slides = await CarouselSlideModel.find().sort({ sortOrder: 1 }).lean();
        sendSuccess(res, { data: { slides }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.post("/carousel", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError({
                statusCode: 400,
                code: "IMAGE_REQUIRED",
                message: "An image file is required",
            });
        }
        const input = carouselSlideSchema.parse(req.body);
        // Process image buffer using sharp (resize to max 1920x1080, convert to webp)
        const processedBuffer = await sharp(req.file.buffer)
            .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(processedBuffer, "carousel");
        const slide = await CarouselSlideModel.create({
            image: {
                url: uploadResult.url,
                alt: input.imageAlt,
                publicId: uploadResult.publicId,
            },
            linkHref: input.linkHref,
            title: input.title,
            description: input.description,
            sortOrder: input.sortOrder,
            isActive: input.isActive,
        });
        await invalidateHomepageCache("carousel.created");
        sendSuccess(res, {
            statusCode: 201,
            data: { slide },
            requestId: getRequestId(res),
        });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/carousel/:id", uploadMiddleware.single("image"), async (req, res, next) => {
    try {
        const input = carouselSlideSchema.partial().parse(req.body);
        const slide = await CarouselSlideModel.findById(req.params.id);
        if (!slide) {
            throw new AppError({
                statusCode: 404,
                code: "SLIDE_NOT_FOUND",
                message: "Carousel slide was not found",
            });
        }
        let imageUpdate = undefined;
        if (req.file) {
            // Process new image
            const processedBuffer = await sharp(req.file.buffer)
                .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            // Upload new image
            const uploadResult = await uploadToCloudinary(processedBuffer, "carousel");
            imageUpdate = {
                url: uploadResult.url,
                alt: input.imageAlt ?? slide.image?.alt ?? "",
                publicId: uploadResult.publicId,
            };
            // Delete old image from Cloudinary if it exists
            if (slide.image?.publicId) {
                await deleteFromCloudinary(slide.image.publicId);
            }
        }
        else if (input.imageAlt) {
            imageUpdate = {
                url: slide.image?.url ?? "",
                publicId: slide.image?.publicId,
                alt: input.imageAlt,
            };
        }
        const updatedSlide = await CarouselSlideModel.findByIdAndUpdate(req.params.id, {
            $set: {
                ...(imageUpdate ? { image: imageUpdate } : {}),
                ...(input.linkHref !== undefined ? { linkHref: input.linkHref } : {}),
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.description !== undefined ? { description: input.description } : {}),
                ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
                ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
            },
        }, { new: true });
        await invalidateHomepageCache("carousel.updated");
        sendSuccess(res, { data: { slide: updatedSlide }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.patch("/carousel/:id/toggle", async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (isActive === undefined || typeof isActive !== "boolean") {
            throw new AppError({
                statusCode: 400,
                code: "INVALID_INPUT",
                message: "isActive parameter is required and must be a boolean",
            });
        }
        const slide = await CarouselSlideModel.findByIdAndUpdate(req.params.id, { $set: { isActive } }, { new: true });
        if (!slide) {
            throw new AppError({
                statusCode: 404,
                code: "SLIDE_NOT_FOUND",
                message: "Carousel slide was not found",
            });
        }
        await invalidateHomepageCache("carousel.toggled");
        sendSuccess(res, { data: { slide }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
adminRouter.delete("/carousel/:id", async (req, res, next) => {
    try {
        const slide = await CarouselSlideModel.findById(req.params.id);
        if (!slide) {
            throw new AppError({
                statusCode: 404,
                code: "SLIDE_NOT_FOUND",
                message: "Carousel slide was not found",
            });
        }
        // Delete image from Cloudinary
        if (slide.image?.publicId) {
            await deleteFromCloudinary(slide.image.publicId);
        }
        // Delete record from DB
        await CarouselSlideModel.findByIdAndDelete(req.params.id);
        await invalidateHomepageCache("carousel.deleted");
        sendSuccess(res, { data: { deleted: true }, requestId: getRequestId(res) });
    }
    catch (error) {
        next(error);
    }
});
homepageRouter.use("/admin", adminRouter);
//# sourceMappingURL=homepage.router.js.map