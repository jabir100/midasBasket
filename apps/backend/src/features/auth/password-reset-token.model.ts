import { Schema, model, type InferSchemaType } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    consumedAt: { type: Date },
  },
  { timestamps: true },
);

export type PasswordResetTokenDocument = InferSchemaType<
  typeof passwordResetTokenSchema
>;

export const PasswordResetTokenModel = model(
  "PasswordResetToken",
  passwordResetTokenSchema,
);
