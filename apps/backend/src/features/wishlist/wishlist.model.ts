import { Schema, model, type InferSchemaType } from "mongoose";

const wishlistItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true },
);

export type WishlistDocument = InferSchemaType<typeof wishlistSchema>;

export const WishlistModel = model("Wishlist", wishlistSchema);
