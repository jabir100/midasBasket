import { Schema, model, type InferSchemaType } from "mongoose";

import { userRoles } from "../auth/auth.types.js";

const userAddressSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      default: "Home",
    },
    line1: { type: String, required: true, trim: true, maxlength: 220 },
    line2: { type: String, trim: true, maxlength: 220 },
    area: { type: String, required: true, trim: true, maxlength: 140 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
    postalCode: { type: String, trim: true, maxlength: 24 },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      default: "Bangladesh",
    },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const notificationPreferencesSchema = new Schema(
  {
    emailOrders: { type: Boolean, default: true },
    emailOffers: { type: Boolean, default: true },
    smsOrders: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: 180,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, default: "customer", index: true },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },
    addresses: { type: [userAddressSchema], default: [] },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({
        emailOrders: true,
        emailOffers: true,
        smsOrders: false,
        pushNotifications: false,
      }),
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: unknown;
};

export const UserModel = model("User", userSchema);
