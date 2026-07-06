/**
 * Comprehensive Seed Script
 * - Creates admin user (admin@midasbasket.com / Admin1234!)
 * - Seeds categories, brands, and sample products
 * - Ensures HomepageSettings and CarouselSlides are populated
 *
 * Run from the backend directory:
 *   node seed-admin-and-products.mjs
 */

import mongoose from "mongoose";
import argon2 from "argon2";

const MONGO_URI = "mongodb://localhost:27017/midas-basket";
const Schema = mongoose.Schema;

// ─── Schema definitions (mirror the app models) ───────────────────────────────

const imageSchema = new Schema(
  { url: String, alt: String, publicId: String },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    addresses: { type: [], default: [] },
    notificationPreferences: {
      type: new Schema(
        {
          emailOrders: { type: Boolean, default: true },
          emailOffers: { type: Boolean, default: true },
          smsOrders: { type: Boolean, default: false },
          pushNotifications: { type: Boolean, default: false },
        },
        { _id: false }
      ),
      default: () => ({ emailOrders: true, emailOffers: true, smsOrders: false, pushNotifications: false }),
    },
  },
  { timestamps: true }
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: String,
    image: imageSchema,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: String,
    logo: imageSchema,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    shortDescription: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stockQuantity: { type: Number, min: 0, default: 0 },
    images: { type: [imageSchema], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

const carouselSlideSchema = new Schema(
  {
    image: imageSchema,
    linkHref: { type: String, required: true },
    title: String,
    description: String,
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
      primaryAction: { href: { type: String, default: "" }, label: { type: String, default: "" } },
      secondaryAction: { href: { type: String, default: "" }, label: { type: String, default: "" } },
      image: imageSchema,
    },
  },
  { timestamps: true }
);

// ─── Models ───────────────────────────────────────────────────────────────────

const UserModel = mongoose.model("User", userSchema);
const CategoryModel = mongoose.model("Category", categorySchema);
const BrandModel = mongoose.model("Brand", brandSchema);
const ProductModel = mongoose.model("Product", productSchema);
const CarouselSlide = mongoose.model("CarouselSlide", carouselSlideSchema);
const HomepageSettings = mongoose.model("HomepageSettings", homepageSettingsSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "admin@midasbasket.com";
const ADMIN_PASSWORD = "Admin1234!";

const CATEGORIES = [
  {
    name: "Fresh Produce",
    slug: "fresh-produce",
    description: "Farm-fresh fruits and vegetables delivered daily.",
    image: {
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&h=600&fit=crop",
      alt: "Fresh fruits and vegetables",
    },
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Dairy and Eggs",
    slug: "dairy-eggs",
    description: "High-quality dairy products, eggs, and plant-based alternatives.",
    image: {
      url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&h=600&fit=crop",
      alt: "Dairy products and eggs",
    },
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Pantry and Dry Goods",
    slug: "pantry-dry-goods",
    description: "Artisanal spices, grains, oils, and pantry essentials.",
    image: {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&h=600&fit=crop",
      alt: "Pantry items and dry goods",
    },
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Refreshing drinks, juices, teas, and coffees.",
    image: {
      url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&h=600&fit=crop",
      alt: "Beverages collection",
    },
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Snacks and Confectionery",
    slug: "snacks-confectionery",
    description: "Delicious snacks, chocolates, biscuits, and sweet treats.",
    image: {
      url: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=800&h=600&fit=crop",
      alt: "Snacks and confectionery",
    },
    isFeatured: true,
    isActive: true,
  },
];

const BRANDS = [
  {
    name: "NatureFarm",
    slug: "naturefarm",
    description: "Organic, locally sourced produce from trusted farms.",
    logo: {
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&h=300&fit=crop",
      alt: "NatureFarm logo",
    },
    isFeatured: true,
    isActive: true,
  },
  {
    name: "DairyPure",
    slug: "dairypure",
    description: "Premium dairy products with no added preservatives.",
    logo: {
      url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&h=300&fit=crop",
      alt: "DairyPure logo",
    },
    isFeatured: true,
    isActive: true,
  },
  {
    name: "GourmetCo",
    slug: "gourmetco",
    description: "Artisanal gourmet products for the discerning palate.",
    logo: {
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&h=300&fit=crop",
      alt: "GourmetCo logo",
    },
    isFeatured: false,
    isActive: true,
  },
  {
    name: "FreshSip",
    slug: "freshsip",
    description: "Natural beverages crafted from real ingredients.",
    logo: {
      url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400&h=300&fit=crop",
      alt: "FreshSip logo",
    },
    isFeatured: false,
    isActive: true,
  },
  {
    name: "SnackHaven",
    slug: "snackhaven",
    description: "Guilt-free snacking done right.",
    logo: {
      url: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=400&h=300&fit=crop",
      alt: "SnackHaven logo",
    },
    isFeatured: false,
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // 1. Admin User
  const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log("Admin already exists: " + ADMIN_EMAIL + " skipping creation");
  } else {
    const passwordHash = await argon2.hash(ADMIN_PASSWORD, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    await UserModel.create({
      name: "Midas Admin",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      status: "active",
    });
    console.log("Admin created: " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
  }

  // 2. Categories
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const existing = await CategoryModel.findOne({ slug: cat.slug });
    if (existing) {
      categoryMap[cat.slug] = existing._id;
      console.log("Category already exists: " + cat.name);
    } else {
      const created = await CategoryModel.create(cat);
      categoryMap[cat.slug] = created._id;
      console.log("Category created: " + cat.name);
    }
  }

  // 3. Brands
  const brandMap = {};
  for (const brand of BRANDS) {
    const existing = await BrandModel.findOne({ slug: brand.slug });
    if (existing) {
      brandMap[brand.slug] = existing._id;
      console.log("Brand already exists: " + brand.name);
    } else {
      const created = await BrandModel.create(brand);
      brandMap[brand.slug] = created._id;
      console.log("Brand created: " + brand.name);
    }
  }

  // 4. Products
  const products = [
    {
      name: "Organic Red Apples 1 kg",
      slug: "organic-red-apples-1kg",
      sku: "NF-APPLE-1KG",
      description: "Freshly harvested organic red apples from the hills of Sylhet. Crisp, sweet, and bursting with natural flavor. No pesticides, no wax coating. Handpicked and packed with care.",
      shortDescription: "Crisp, sweet organic apples from local farms.",
      categoryId: categoryMap["fresh-produce"],
      brandId: brandMap["naturefarm"],
      price: 220,
      compareAtPrice: 280,
      stockQuantity: 150,
      images: [{ url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=800&h=800&fit=crop", alt: "Organic red apples" }],
      tags: ["organic", "fruit", "fresh", "apples"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Baby Spinach 250 g",
      slug: "baby-spinach-250g",
      sku: "NF-SPIN-250G",
      description: "Tender baby spinach leaves, triple-washed and ready to eat. Perfect for salads, smoothies, and stir-fries. Sourced from hydroponic farms ensuring year-round freshness.",
      shortDescription: "Triple-washed, ready-to-eat hydroponic baby spinach.",
      categoryId: categoryMap["fresh-produce"],
      brandId: brandMap["naturefarm"],
      price: 95,
      compareAtPrice: 120,
      stockQuantity: 80,
      images: [{ url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&h=800&fit=crop", alt: "Fresh baby spinach" }],
      tags: ["organic", "vegetable", "salad", "spinach"],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Mixed Bell Peppers 500 g",
      slug: "mixed-bell-peppers-500g",
      sku: "NF-BELLPEP-500G",
      description: "Vibrant mix of red, yellow, and green bell peppers. Ideal for grilling, stir-frying, or eating raw. Packed with vitamin C and antioxidants.",
      shortDescription: "Colourful, crunchy bell peppers packed with vitamins.",
      categoryId: categoryMap["fresh-produce"],
      brandId: brandMap["naturefarm"],
      price: 145,
      compareAtPrice: 180,
      stockQuantity: 60,
      images: [{ url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&h=800&fit=crop", alt: "Colourful mixed bell peppers" }],
      tags: ["vegetable", "peppers", "fresh", "organic"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Full-Cream Milk 1 L",
      slug: "full-cream-milk-1l",
      sku: "DP-MILK-1L",
      description: "Rich, creamy full-fat milk sourced from grass-fed cows. Pasteurised and homogenised for your safety and convenience. A daily staple for every household.",
      shortDescription: "Pasteurised full-cream milk from grass-fed cows.",
      categoryId: categoryMap["dairy-eggs"],
      brandId: brandMap["dairypure"],
      price: 85,
      compareAtPrice: 95,
      stockQuantity: 200,
      images: [{ url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&h=800&fit=crop", alt: "Fresh full-cream milk bottle" }],
      tags: ["dairy", "milk", "fresh"],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Free-Range Eggs 12 pack",
      slug: "free-range-eggs-12-pack",
      sku: "DP-EGGS-12PK",
      description: "A dozen large, free-range eggs from hens raised on open pastures. No hormones, no antibiotics. Superior taste and rich golden yolks.",
      shortDescription: "Large free-range eggs with rich golden yolks.",
      categoryId: categoryMap["dairy-eggs"],
      brandId: brandMap["dairypure"],
      price: 165,
      compareAtPrice: 195,
      stockQuantity: 120,
      images: [{ url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&h=800&fit=crop", alt: "Free-range eggs in carton" }],
      tags: ["dairy", "eggs", "free-range", "protein"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Greek Yoghurt Plain 400 g",
      slug: "greek-yoghurt-plain-400g",
      sku: "DP-GKYOG-400G",
      description: "Thick, creamy Greek-style yoghurt made with live cultures. High in protein and probiotics. Perfect for breakfast bowls, marinades, or a healthy snack.",
      shortDescription: "High-protein Greek yoghurt with live cultures.",
      categoryId: categoryMap["dairy-eggs"],
      brandId: brandMap["dairypure"],
      price: 130,
      compareAtPrice: 155,
      stockQuantity: 90,
      images: [{ url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&h=800&fit=crop", alt: "Greek yoghurt in a bowl" }],
      tags: ["dairy", "yoghurt", "probiotic", "healthy"],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Basmati Rice Premium 2 kg",
      slug: "basmati-rice-premium-2kg",
      sku: "GC-RICE-2KG",
      description: "Aged basmati rice with extra-long grains and a delicate, nutty aroma. Sourced from the finest rice paddies. Cooks to a fluffy, non-sticky perfection every time.",
      shortDescription: "Premium aged basmati with long, fluffy grains.",
      categoryId: categoryMap["pantry-dry-goods"],
      brandId: brandMap["gourmetco"],
      price: 320,
      compareAtPrice: 380,
      stockQuantity: 180,
      images: [{ url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&h=800&fit=crop", alt: "Premium basmati rice bag" }],
      tags: ["rice", "pantry", "grains", "basmati"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Extra Virgin Olive Oil 500 ml",
      slug: "extra-virgin-olive-oil-500ml",
      sku: "GC-EVOO-500ML",
      description: "Cold-pressed extra virgin olive oil from Mediterranean olive groves. Rich in healthy monounsaturated fats and antioxidants. Ideal for dressings, dipping, and light sauteing.",
      shortDescription: "Cold-pressed Mediterranean extra virgin olive oil.",
      categoryId: categoryMap["pantry-dry-goods"],
      brandId: brandMap["gourmetco"],
      price: 550,
      compareAtPrice: 650,
      stockQuantity: 70,
      images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&h=800&fit=crop", alt: "Bottle of extra virgin olive oil" }],
      tags: ["oil", "pantry", "healthy", "cooking"],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Cold-Pressed Orange Juice 1 L",
      slug: "cold-pressed-orange-juice-1l",
      sku: "FS-OJ-1L",
      description: "100% pure cold-pressed orange juice with no added sugar, preservatives, or artificial flavours. Made from freshly squeezed Valencia oranges. Packed with vitamin C.",
      shortDescription: "100% pure cold-pressed orange juice, no added sugar.",
      categoryId: categoryMap["beverages"],
      brandId: brandMap["freshsip"],
      price: 180,
      compareAtPrice: 220,
      stockQuantity: 100,
      images: [{ url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&h=800&fit=crop", alt: "Fresh orange juice bottle" }],
      tags: ["juice", "beverage", "vitamin-c", "fresh"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Sparkling Mineral Water 6 x 500 ml",
      slug: "sparkling-mineral-water-6x500ml",
      sku: "FS-SPARK-6PK",
      description: "Naturally carbonated mineral water sourced from a pristine mountain spring. Zero calories, zero sugar. A refreshing alternative to soft drinks.",
      shortDescription: "Naturally carbonated mountain spring mineral water.",
      categoryId: categoryMap["beverages"],
      brandId: brandMap["freshsip"],
      price: 240,
      compareAtPrice: 280,
      stockQuantity: 130,
      images: [{ url: "https://images.unsplash.com/photo-1606168094336-48f205522a4f?q=80&w=800&h=800&fit=crop", alt: "Sparkling water bottles" }],
      tags: ["water", "sparkling", "beverage", "hydration"],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Roasted Mixed Nuts 250 g",
      slug: "roasted-mixed-nuts-250g",
      sku: "SH-NUTS-250G",
      description: "A premium blend of lightly roasted cashews, almonds, walnuts, and pistachios. No added oil, no artificial seasoning. A powerhouse of healthy fats and protein.",
      shortDescription: "Lightly roasted mixed nuts, no added oil or salt.",
      categoryId: categoryMap["snacks-confectionery"],
      brandId: brandMap["snackhaven"],
      price: 420,
      compareAtPrice: 500,
      stockQuantity: 85,
      images: [{ url: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?q=80&w=800&h=800&fit=crop", alt: "Mixed nuts in a bowl" }],
      tags: ["nuts", "snack", "healthy", "protein"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      name: "Dark Chocolate Bar 70 Percent 100 g",
      slug: "dark-chocolate-bar-70-percent-100g",
      sku: "SH-CHOC-100G",
      description: "Intense, velvety dark chocolate with 70% cocoa content. Ethically sourced cacao beans, stone-ground for a smooth finish. A sophisticated treat packed with antioxidants.",
      shortDescription: "70% cocoa dark chocolate, rich, smooth, and ethical.",
      categoryId: categoryMap["snacks-confectionery"],
      brandId: brandMap["snackhaven"],
      price: 280,
      compareAtPrice: 320,
      stockQuantity: 110,
      images: [{ url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&h=800&fit=crop", alt: "Dark chocolate bar" }],
      tags: ["chocolate", "snack", "dark-chocolate", "antioxidant"],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  let productsCreated = 0;
  for (const product of products) {
    const existing = await ProductModel.findOne({ slug: product.slug });
    if (existing) {
      console.log("Product already exists: " + product.name);
    } else {
      await ProductModel.create(product);
      console.log("Product created: " + product.name + " price: " + product.price);
      productsCreated++;
    }
  }
  console.log(productsCreated + " new product(s) created");

  // 5. Carousel Slides
  const slideCount = await CarouselSlide.countDocuments();
  if (slideCount === 0) {
    await CarouselSlide.insertMany([
      {
        image: { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&h=1080&fit=crop", alt: "Fresh organic vegetables and fruits on display" },
        linkHref: "/products",
        title: "Fresh Organic Essentials",
        description: "Directly sourced from trusted local farms. Freshness guaranteed at your doorstep.",
        sortOrder: 1,
        isActive: true,
      },
      {
        image: { url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1920&h=1080&fit=crop", alt: "Premium pantry grocery jars and spices" },
        linkHref: "/products",
        title: "Gourmet Pantry Delights",
        description: "Elevate your cooking with handpicked artisanal spices, oils, and grains.",
        sortOrder: 2,
        isActive: true,
      },
      {
        image: { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&h=1080&fit=crop", alt: "Delivery packages and logistics speed" },
        linkHref: "/products",
        title: "Super Fast Dispatch",
        description: "Order by 2 PM and get same-day dispatch. Secure and contactless packaging.",
        sortOrder: 3,
        isActive: true,
      },
    ]);
    console.log("Carousel slides seeded");
  } else {
    console.log("Carousel slides already exist skipping");
  }

  // 6. Homepage Settings
  const settingsCount = await HomepageSettings.countDocuments();
  if (settingsCount === 0) {
    await HomepageSettings.create({
      hero: {
        eyebrow: "Premium essentials, delivered fast",
        title: "Modern shopping for everyday wins",
        description: "A fast, secure, mobile-first ecommerce experience for curated products, trusted brands, and smooth checkout.",
        primaryAction: { href: "/products", label: "Shop Products" },
        secondaryAction: { href: "/products", label: "View Offers" },
        image: { url: "/images/homepage/placeholder.webp", alt: "Midas Basket premium storefront" },
      },
    });
    console.log("HomepageSettings created");
  } else {
    console.log("HomepageSettings already exist skipping");
  }

  await mongoose.disconnect();

  console.log("\n===========================================");
  console.log("  Database seeding complete!");
  console.log("===========================================");
  console.log("  Admin:    admin@midasbasket.com / Admin1234!");
  console.log("  Customer: john@example.com / Password123!");
  console.log("  Frontend: http://localhost:3000");
  console.log("  Backend:  http://localhost:4000");
  console.log("===========================================\n");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
