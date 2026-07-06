import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/midas-basket";

const Schema = mongoose.Schema;
const carouselSlideSchema = new Schema(
  {
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
      publicId: { type: String },
    },
    linkHref: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }
);

const CarouselSlide = mongoose.model("CarouselSlide", carouselSlideSchema);

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  const count = await CarouselSlide.countDocuments();
  console.log("Total slides:", count);
  const slides = await CarouselSlide.find().lean();
  console.log("Slides:", JSON.stringify(slides, null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
