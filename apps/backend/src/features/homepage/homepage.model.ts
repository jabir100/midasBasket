import { Schema, model, type InferSchemaType } from "mongoose";

const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 140 },
    publicId: { type: String, trim: true },
  },
  { _id: false },
);

const linkSchema = new Schema(
  {
    href: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true, maxlength: 80 },
  },
  { _id: false },
);

const heroSchema = new Schema(
  {
    eyebrow: { type: String, trim: true, maxlength: 120, default: "" },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    primaryAction: linkSchema,
    secondaryAction: linkSchema,
    image: imageSchema,
  },
  { _id: false },
);

const metricSchema = new Schema(
  {
    value: { type: String, required: true, trim: true, maxlength: 20 },
    label: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { _id: false },
);

const promoBannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    action: linkSchema,
  },
  { _id: false },
);

const valuePropositionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 400, default: "" },
  },
  { _id: false },
);

const homepageSettingsSchema = new Schema(
  {
    hero: { type: heroSchema, default: () => ({}) },
    metrics: { type: [metricSchema], default: [] },
    promoBanner: { type: promoBannerSchema, default: () => ({}) },
    whyChooseUs: { type: [valuePropositionSchema], default: [] },
  },
  { timestamps: true },
);

const testimonialSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    quote: { type: String, required: true, trim: true, maxlength: 500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const seoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 70 },
    description: { type: String, trim: true, maxlength: 170 },
  },
  { _id: false },
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: { type: String, trim: true, maxlength: 500, default: "" },
    content: { type: String, trim: true, default: "" },
    image: imageSchema,
    seo: seoSchema,
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
  },
  { timestamps: true },
);

blogSchema.index({ isPublished: 1, publishedAt: -1 });

const carouselSlideSchema = new Schema(
  {
    image: {
      url: { type: String, required: true, trim: true },
      alt: { type: String, required: true, trim: true, maxlength: 140 },
      publicId: { type: String, trim: true },
    },
    linkHref: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type HomepageSettingsDocument = InferSchemaType<typeof homepageSettingsSchema>;
export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;
export type BlogDocument = InferSchemaType<typeof blogSchema>;
export type CarouselSlideDocument = InferSchemaType<typeof carouselSlideSchema>;

export const HomepageSettingsModel = model("HomepageSettings", homepageSettingsSchema);
export const TestimonialModel = model("Testimonial", testimonialSchema);
export const BlogModel = model("Blog", blogSchema);
export const CarouselSlideModel = model("CarouselSlide", carouselSlideSchema);
