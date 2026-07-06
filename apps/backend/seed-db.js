import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/midas-basket";

const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const carouselSlideSchema = new Schema(
  {
    image: imageSchema,
    linkHref: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const homepageSettingsSchema = new Schema(
  {
    hero: {
      eyebrow: { type: String, default: "" },
      title: { type: String, required: true },
      description: { type: String, default: "" },
      primaryAction: {
        href: { type: String, default: "" },
        label: { type: String, default: "" },
      },
      secondaryAction: {
        href: { type: String, default: "" },
        label: { type: String, default: "" },
      },
      image: imageSchema,
    },
  },
  { timestamps: true }
);

const CarouselSlide = mongoose.model("CarouselSlide", carouselSlideSchema);
const HomepageSettings = mongoose.model("HomepageSettings", homepageSettingsSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding");

  // 1. Delete existing slides
  await CarouselSlide.deleteMany({});
  console.log("Cleared old carousel slides");

  // 2. Insert new slides
  const slides = [
    {
      image: {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&h=1080&fit=crop",
        alt: "Fresh organic vegetables and fruits on display",
      },
      linkHref: "/products",
      title: "Fresh Organic Essentials",
      description: "Directly sourced from trusted local farms. Freshness guaranteed at your doorstep.",
      sortOrder: 1,
      isActive: true,
    },
    {
      image: {
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1920&h=1080&fit=crop",
        alt: "Premium pantry grocery jars and spices",
      },
      linkHref: "/products",
      title: "Gourmet Pantry Delights",
      description: "Elevate your cooking with our handpicked selections of artisanal spices, oils, and grains.",
      sortOrder: 2,
      isActive: true,
    },
    {
      image: {
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&h=1080&fit=crop",
        alt: "Delivery packages and logistics speed",
      },
      linkHref: "/products",
      title: "Super Fast Dispatch Target",
      description: "Order by 2 PM and get same-day dispatch. Secure and contactless packaging.",
      sortOrder: 3,
      isActive: true,
    },
  ];

  await CarouselSlide.insertMany(slides);
  console.log("Successfully seeded 3 carousel slides");

  // 3. Ensure HomepageSettings exists
  const settingsCount = await HomepageSettings.countDocuments();
  if (settingsCount === 0) {
    await HomepageSettings.create({
      hero: {
        eyebrow: "Premium essentials, delivered fast",
        title: "Modern shopping for everyday wins",
        description: "A fast, secure, mobile-first ecommerce experience for curated products, trusted brands, and smooth checkout.",
        primaryAction: { href: "/products", label: "Shop products" },
        secondaryAction: { href: "/offers", label: "View offers" },
        image: {
          url: "/images/homepage/placeholder.webp",
          alt: "Midas Basket premium storefront",
        },
      },
    });
    console.log("Created default HomepageSettings");
  }

  await mongoose.disconnect();
  console.log("Database connection closed");
}

seed().catch(console.error);
