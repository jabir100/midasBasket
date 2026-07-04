import { Schema, model, type InferSchemaType } from "mongoose";

import { userRoles } from "../auth/auth.types.js";

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
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, default: "customer", index: true },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: unknown;
};

export const UserModel = model("User", userSchema);
