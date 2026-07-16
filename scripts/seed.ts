import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Since we run this standalone, we define simple schemas here to avoid import issues
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  color: String,
  description: String,
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  category: { type: String, required: true },
  description: { type: String, required: true, maxlength: 150 },
  externalUrl: { type: String, required: true },
  secondaryUrls: [{ label: String, url: String }],
  badge: String,
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  tags: [String],
});

const TaskGuideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  keywords: [String],
  steps: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId },
    externalUrl: String,
    linkLabel: String,
  }],
  active: { type: Boolean, default: true },
});

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: { createdAt: false, updatedAt: true } });

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
const TaskGuide = mongoose.models.TaskGuide || mongoose.model("TaskGuide", TaskGuideSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Service.deleteMany({});
    await TaskGuide.deleteMany({});
    await SiteSettings.deleteMany({});
    await AdminUser.deleteMany({});
    console.log("Cleared existing data");

    // 1. Seed Admin User
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await AdminUser.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@24hours.lk",
      password: hashedPassword,
    });
    console.log("Admin user created");

    // 2. Seed Categories
    const categoriesData = [
      { name: "Transport", slug: "transport", icon: "Bus", color: "#4F46E5", sortOrder: 1, active: true },
      { name: "Hotels & Stays", slug: "hotels-stays", icon: "Hotel", color: "#10B981", sortOrder: 2, active: true },
      { name: "Entertainment", slug: "entertainment", icon: "Film", color: "#F59E0B", sortOrder: 3, active: true },
      { name: "Health & Medical", slug: "health-medical", icon: "Heart", color: "#EF4444", sortOrder: 4, active: true },
      { name: "Government Services", slug: "government", icon: "Landmark", color: "#6B7280", sortOrder: 5, active: true },
      { name: "Delivery & Logistics", slug: "delivery", icon: "Package", color: "#8B5CF6", sortOrder: 6, active: true },
      { name: "Food & Dining", slug: "food", icon: "UtensilsCrossed", color: "#F97316", sortOrder: 7, active: true },
      { name: "Freelance & Jobs", slug: "jobs", icon: "Briefcase", color: "#06B6D4", sortOrder: 8, active: true },
      { name: "Education", slug: "education", icon: "GraduationCap", color: "#3B82F6", sortOrder: 9, active: true },
      { name: "Finance & Payments", slug: "finance", icon: "Wallet", color: "#14B8A6", sortOrder: 10, active: true },
    ];
    await Category.insertMany(categoriesData);
    console.log("Categories seeded");

    // 3. Seed Services
    const servicesData = [
      // Transport
      { name: "Bus Tickets (SLTB)", slug: "bus-tickets-sltb", icon: "Bus", category: "transport", description: "Official SLTB bus booking platform", externalUrl: "https://sltb.eseat.lk", secondaryUrls: [{ label: "Magiya", url: "https://magiya.lk" }, { label: "BusSeat", url: "https://busseat.lk" }], featured: true, active: true, tags: ["bus", "transport", "sltb", "intercity"] },
      { name: "PickMe Taxi", slug: "pickme-taxi", icon: "Car", category: "transport", description: "Local ride-hailing app", externalUrl: "https://pickme.lk", featured: true, active: true, tags: ["taxi", "tuk", "ride"] },
      { name: "Uber Sri Lanka", slug: "uber-sri-lanka", icon: "Car", category: "transport", description: "Global ride-hailing service", externalUrl: "https://uber.com", active: true, tags: ["taxi", "ride"] },
      { name: "Airport Taxi", slug: "airport-taxi", icon: "Plane", category: "transport", description: "Reliable airport transfers", externalUrl: "https://aerotaxi.lk", active: true, tags: ["airport", "transfer", "taxi"] },
      
      // Hotels & Stays
      { name: "Booking.com Sri Lanka", slug: "booking-com", icon: "Hotel", category: "hotels-stays", description: "Find the best hotels and stays", externalUrl: "https://www.booking.com/country/lk.html", featured: true, active: true, tags: ["hotel", "stay", "accommodation"] },
      { name: "Trivago Sri Lanka", slug: "trivago", icon: "Bed", category: "hotels-stays", description: "Compare hotel prices", externalUrl: "https://ar.trivago.com/en-145/odr/hotels-sri-lanka", active: true, tags: ["hotel", "compare"] },
      { name: "Agoda Sri Lanka", slug: "agoda", icon: "Palmtree", category: "hotels-stays", description: "Hotels and resorts", externalUrl: "https://www.agoda.com/country/sri-lanka.html", active: true, tags: ["hotel", "resort"] },
      { name: "Airbnb Sri Lanka", slug: "airbnb", icon: "Home", category: "hotels-stays", description: "Vacation rentals and experiences", externalUrl: "https://www.airbnb.com/s/Sri-Lanka", featured: true, active: true, tags: ["rental", "homestay", "villa"] },

      // Entertainment
      { name: "BookMyShow LK", slug: "bookmyshow", icon: "Popcorn", category: "entertainment", description: "Movie and event tickets", externalUrl: "https://lk.bookmyshow.com", featured: true, active: true, tags: ["movies", "cinema", "events"] },
      { name: "Eventbrite Sri Lanka", slug: "eventbrite", icon: "Ticket", category: "entertainment", description: "Find local events", externalUrl: "https://www.eventbrite.lk", active: true, tags: ["events", "tickets"] },

      // Health
      { name: "eChannelling", slug: "echannelling", icon: "Stethoscope", category: "health-medical", description: "Channel a doctor easily", externalUrl: "https://www.echannelling.com", featured: true, active: true, tags: ["doctor", "hospital", "channeling"] },
      { name: "DL Medical (echannelling)", slug: "dl-medical", icon: "Eye", category: "health-medical", description: "Book driving licence medical test", externalUrl: "https://www.echannelling.com/driving-license-medical", active: true, tags: ["medical", "driving", "licence"] },
      { name: "1990 Ambulance", slug: "1990-ambulance", icon: "Ambulance", category: "health-medical", description: "Suwaseriya Emergency Ambulance", externalUrl: "tel:1990", featured: true, active: true, tags: ["emergency", "ambulance"] },
      { name: "Osu Sala", slug: "osu-sala", icon: "Pill", category: "health-medical", description: "Government Pharmacy locator", externalUrl: "https://www.nmra.gov.lk", active: true, tags: ["pharmacy", "medicine"] },

      // Government
      { name: "Department of Motor Traffic", slug: "dmt", icon: "Car", category: "government", description: "Driving licences and vehicle registration", externalUrl: "https://www.motortraffic.gov.lk", featured: true, active: true, tags: ["dmt", "licence", "vehicle"] },
      { name: "Department of Immigration", slug: "immigration", icon: "Passport", category: "government", description: "Passports and visas", externalUrl: "https://www.immigration.gov.lk", active: true, tags: ["passport", "visa"] },
      { name: "NIDOA (NIC)", slug: "nic", icon: "IdCard", category: "government", description: "National Identity Card services", externalUrl: "https://www.ec.gov.lk", active: true, tags: ["nic", "id"] },
      
      // Delivery
      { name: "ParcelBuddy", slug: "parcelbuddy", icon: "Package", category: "delivery", description: "P2P parcel delivery", externalUrl: "https://parcelbuddy.lk", active: true, tags: ["delivery", "p2p"] },
      { name: "Kapruka", slug: "kapruka", icon: "Gift", category: "delivery", description: "Online shopping and delivery", externalUrl: "https://www.kapruka.com", featured: true, active: true, tags: ["gift", "delivery", "shopping"] },

      // Food
      { name: "PickMe Food", slug: "pickme-food", icon: "Utensils", category: "food", description: "Food delivery from local restaurants", externalUrl: "https://pickme.lk/food", featured: true, active: true, tags: ["food", "delivery"] },
      { name: "Uber Eats LK", slug: "uber-eats", icon: "Pizza", category: "food", description: "Global food delivery app", externalUrl: "https://www.ubereats.com", active: true, tags: ["food", "delivery"] },
      
      // Jobs
      { name: "TopJobs Sri Lanka", slug: "topjobs", icon: "Briefcase", category: "jobs", description: "Local job portal", externalUrl: "https://www.topjobs.lk", featured: true, active: true, tags: ["job", "career", "work"] },
      { name: "Fiverr", slug: "fiverr", icon: "Laptop", category: "jobs", description: "Global freelance marketplace", externalUrl: "https://www.fiverr.com", active: true, tags: ["freelance", "gig"] },
    ];
    await Service.insertMany(servicesData);
    console.log("Services seeded");

    // 4. Seed Task Guides
    const taskGuidesData = [
      {
        title: "Renew Driving Licence",
        slug: "renew-driving-licence",
        keywords: ["driving licence", "renew DL", "DMT"],
        steps: [
          { stepNumber: 1, title: "Book DL Medical Test", description: "You need a medical certificate first.", externalUrl: "https://www.echannelling.com/driving-license-medical", linkLabel: "Book Medical Test" },
          { stepNumber: 2, title: "Visit DMT Office", description: "Go to the Department of Motor Traffic. (Werahera or District office)", externalUrl: "https://www.motortraffic.gov.lk", linkLabel: "View Details" },
          { stepNumber: 3, title: "Book a bus", description: "Get there easily by booking a bus ticket.", externalUrl: "https://sltb.eseat.lk", linkLabel: "Book Bus" },
        ]
      },
      {
        title: "Plan a Trip to Ella",
        slug: "trip-to-ella",
        keywords: ["trip to ella", "visit ella", "ella travel"],
        steps: [
          { stepNumber: 1, title: "Book bus ticket", description: "Secure your transport to Ella.", externalUrl: "https://sltb.eseat.lk", linkLabel: "Book Bus" },
          { stepNumber: 2, title: "Book a hotel", description: "Find the best stay in Ella.", externalUrl: "https://www.booking.com/country/lk.html", linkLabel: "Find Hotels" },
          { stepNumber: 3, title: "Find events", description: "Check out what's happening nearby.", externalUrl: "https://lk.bookmyshow.com", linkLabel: "Find Events" },
        ]
      },
      {
        title: "Book a Doctor",
        slug: "book-a-doctor",
        keywords: ["doctor", "hospital", "consultation", "medical"],
        steps: [
          { stepNumber: 1, title: "Channel a doctor", description: "Find a specialist and book an appointment.", externalUrl: "https://www.echannelling.com", linkLabel: "Channel Doctor" },
          { stepNumber: 2, title: "Emergency Ambulance", description: "If it's an emergency, call an ambulance.", externalUrl: "tel:1990", linkLabel: "Call 1990" },
        ]
      }
    ];
    await TaskGuide.insertMany(taskGuidesData);
    console.log("Task Guides seeded");

    // 5. Seed Site Settings
    const settingsData = [
      { key: "hero_headline", value: "What do you need to get done today?" },
      { key: "hero_subtext", value: "24hours.lk guides you to the right services, exactly when you need them. No signup required." },
      { key: "footer_tagline", value: "Sri Lanka's Unified Service Hub" }
    ];
    await SiteSettings.insertMany(settingsData);
    console.log("Site Settings seeded");

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
