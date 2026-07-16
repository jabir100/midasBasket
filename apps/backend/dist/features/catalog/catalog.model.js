import { Schema, model } from "mongoose";
const seoSchema = new Schema({
    title: { type: String, trim: true, maxlength: 70 },
    description: { type: String, trim: true, maxlength: 170 },
}, { _id: false });
const imageSchema = new Schema({
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 140 },
    publicId: { type: String, trim: true },
    // Associates this image with a variant color (product images only);
    // unset means the image applies regardless of the selected color.
    color: { type: String, trim: true, maxlength: 40 },
}, { _id: false });
const categorySchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    description: { type: String, trim: true, maxlength: 600 },
    image: imageSchema,
    seo: seoSchema,
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });
const brandSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    description: { type: String, trim: true, maxlength: 600 },
    logo: imageSchema,
    seo: seoSchema,
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });
const variantSchema = new Schema({
    size: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },
    color: { type: String, required: true, trim: true, maxlength: 40 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true, maxlength: 80 },
}, { _id: false });
const productSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    description: { type: String, required: true, trim: true, maxlength: 5_000 },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
        index: true,
    },
    price: { type: Number, required: true, min: 0, index: true },
    compareAtPrice: { type: Number, min: 0 },
    // Derived/cached sum of variants[].stockQuantity when variants exist;
    // otherwise the product's own flat stock (legacy no-variant products).
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    variants: { type: [variantSchema], default: [] },
    images: { type: [imageSchema], default: [] },
    seo: seoSchema,
    tags: { type: [String], default: [], index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
}, { timestamps: true });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ categoryId: 1, isPublished: 1, price: 1 });
productSchema.index({ brandId: 1, isPublished: 1, createdAt: -1 });
export const CategoryModel = model("Category", categorySchema);
export const BrandModel = model("Brand", brandSchema);
export const ProductModel = model("Product", productSchema);
//# sourceMappingURL=catalog.model.js.map