import { Schema, model } from "mongoose";
const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    imageUrl: { type: String, trim: true },
    size: { type: String, trim: true, uppercase: true },
    color: { type: String, trim: true },
}, { _id: false });
const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        sparse: true,
    },
    guestCartId: { type: String, trim: true, index: true, sparse: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: { type: String, trim: true, uppercase: true },
    currency: { type: String, trim: true, uppercase: true, default: "BDT" },
}, { timestamps: true });
cartSchema.index({ userId: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestCartId: 1 }, { unique: true, sparse: true });
export const CartModel = model("Cart", cartSchema);
//# sourceMappingURL=cart.model.js.map