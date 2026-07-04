import { Schema, model, type InferSchemaType } from "mongoose";

export const orderStatuses = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

const addressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true, maxlength: 220 },
    line2: { type: String, trim: true, maxlength: 220 },
    area: { type: String, required: true, trim: true, maxlength: 140 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
    postalCode: { type: String, trim: true, maxlength: 24 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    imageUrl: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const statusTimelineEntrySchema = new Schema(
  {
    status: { type: String, enum: orderStatuses, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    updatedBy: { type: String, required: true, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 400 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      sparse: true,
    },
    guestCartId: { type: String, trim: true, index: true, sparse: true },
    customerName: { type: String, required: true, trim: true, maxlength: 140 },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
      index: true,
    },
    customerPhone: { type: String, required: true, trim: true, maxlength: 40 },
    shippingAddress: { type: addressSchema, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    status: {
      type: String,
      enum: orderStatuses,
      default: "placed",
      index: true,
    },
    statusTimeline: { type: [statusTimelineEntrySchema], default: [] },
    items: { type: [orderItemSchema], required: true },
    currency: { type: String, required: true, default: "BDT", maxlength: 8 },
    couponCode: { type: String, trim: true, uppercase: true },
    subTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });

export type OrderStatus = (typeof orderStatuses)[number];
export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = model("Order", orderSchema);
