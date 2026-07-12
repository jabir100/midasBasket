/**
 * One-off backfill: gives existing products (created before size+color
 * variants existed) a single "ONE SIZE / Default" variant carrying their
 * current flat stockQuantity, so they remain purchasable through the
 * variant-aware cart/checkout flow. Products that already have variants,
 * or that have zero stock, are left untouched.
 *
 * Not run automatically — run manually when needed:
 *   node backfill-variants.mjs
 */

import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/midas-basket";
const Schema = mongoose.Schema;

const variantSchema = new Schema(
  {
    size: { type: String, required: true, trim: true, uppercase: true },
    color: { type: String, required: true, trim: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    stockQuantity: { type: Number, min: 0, default: 0 },
    variants: { type: [variantSchema], default: [] },
  },
  { strict: false },
);

const ProductModel = mongoose.model("Product", productSchema);

async function backfill() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const products = await ProductModel.find({
    $or: [{ variants: { $exists: false } }, { variants: { $size: 0 } }],
  });

  let updated = 0;
  for (const product of products) {
    if (!product.stockQuantity || product.stockQuantity <= 0) {
      continue;
    }

    product.variants = [
      {
        size: "ONE SIZE",
        color: "Default",
        stockQuantity: product.stockQuantity,
      },
    ];
    await product.save();
    updated++;
    console.log(`Backfilled variant for: ${product.get("name")}`);
  }

  console.log(`\n${updated} product(s) backfilled with a default variant.`);
  await mongoose.disconnect();
}

backfill().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
