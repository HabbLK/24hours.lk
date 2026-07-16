import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  icon: String,
  color: String,
  sortOrder: Number,
  active: Boolean,
});

const ServiceSchema = new mongoose.Schema({
  name: String,
  slug: String,
  icon: String,
  category: String,
  description: String,
  externalUrl: String,
  secondaryUrls: [{ label: String, url: String }],
  featured: Boolean,
  active: Boolean,
  sortOrder: Number,
  tags: [String],
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

// Emoji to Icon mapping
const emojiToIconMap: Record<string, string> = {
  // Categories
  "🚌": "Bus",
  "🏨": "Hotel",
  "🎬": "Film",
  "🏥": "Heart",
  "🏛️": "Landmark",
  "📦": "Package",
  "🍽️": "UtensilsCrossed",
  "💼": "Briefcase",
  "🎓": "GraduationCap",
  "💰": "Wallet",
  
  // Services
  "🚕": "Car",
  "🚗": "Car",
  "✈️": "Plane",
  "🛏️": "Bed",
  "🏖️": "Palmtree",
  "🏠": "Home",
  "🍿": "Popcorn",
  "🎟️": "Ticket",
  "🩺": "Stethoscope",
  "👁️": "Eye",
  "🚑": "Ambulance",
  "💊": "Pill",
  "🛂": "Passport",
  "🪪": "IdCard",
  "🎁": "Gift",
  "🍔": "Utensils",
  "🍕": "Pizza",
  "💻": "Laptop",
};

async function migrateIcons() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Update Categories
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories to update`);
    
    for (const category of categories) {
      const newIcon = emojiToIconMap[category.icon] || "HelpCircle";
      await Category.updateOne(
        { _id: category._id },
        { $set: { icon: newIcon } }
      );
      console.log(`Updated category "${category.name}": ${category.icon} → ${newIcon}`);
    }

    // Update Services
    const services = await Service.find({});
    console.log(`Found ${services.length} services to update`);
    
    for (const service of services) {
      const newIcon = emojiToIconMap[service.icon] || "ExternalLink";
      await Service.updateOne(
        { _id: service._id },
        { $set: { icon: newIcon } }
      );
      console.log(`Updated service "${service.name}": ${service.icon} → ${newIcon}`);
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateIcons();
