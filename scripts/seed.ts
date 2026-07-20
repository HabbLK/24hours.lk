import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

    await Category.deleteMany({});
    await Service.deleteMany({});
    await TaskGuide.deleteMany({});
    await SiteSettings.deleteMany({});
    await AdminUser.deleteMany({});
    console.log("Cleared existing data");

    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await AdminUser.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@24hours.lk",
      password: hashedPassword,
    });
    console.log("Admin user created");

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

    const servicesData = [
      // Transport
      { name: "Bus Tickets (SLTB)", slug: "bus-tickets-sltb", icon: "🚌", category: "transport", description: "Official SLTB bus booking platform", externalUrl: "https://sltb.eseat.lk", featured: true, tags: ["bus", "transport", "sltb", "intercity"] },
      { name: "PickMe Taxi", slug: "pickme-taxi", icon: "🚕", category: "transport", description: "Local ride-hailing app", externalUrl: "https://pickme.lk", featured: true, tags: ["taxi", "tuk", "ride"] },
      // Updated: point straight at the city-availability page you shared,
      // rather than the generic uber.com homepage.
      { name: "Uber Sri Lanka", slug: "uber-sri-lanka", icon: "🚗", category: "transport", description: "Global ride-hailing service", externalUrl: "https://www.uber.com/global/en/r/sri-lanka/cities/", tags: ["taxi", "ride"] },
      { name: "SriLankan Airlines", slug: "srilankan-airlines", icon: "✈️", category: "transport", description: "National carrier — domestic and international flights", externalUrl: "https://www.srilankan.com", featured: true, tags: ["flight", "airline", "transport"] },
      { name: "FitsAir", slug: "fitsair", icon: "✈️", category: "transport", description: "Low-cost carrier, domestic and regional routes", externalUrl: "https://www.fitsair.com", tags: ["flight", "airline"] },
      { name: "Emirates", slug: "emirates", icon: "✈️", category: "transport", description: "International flights via Dubai", externalUrl: "https://www.emirates.com", tags: ["flight", "airline"] },
      { name: "Qatar Airways", slug: "qatar-airways", icon: "✈️", category: "transport", description: "International flights via Doha", externalUrl: "https://www.qatarairways.com", tags: ["flight", "airline"] },
      // Updated: point at the actual seat-booking path you found, rather
      // than the site root.
      { name: "Sri Lanka Railways (Seat Reservation)", slug: "slr-seat-reservation", icon: "🚆", category: "transport", description: "Official government train seat booking platform", externalUrl: "https://seatreservation.railway.gov.lk/mtktwebslr/", featured: true, tags: ["train", "railway"] },
      { name: "BusSeat.lk", slug: "busseat-lk", icon: "🚌", category: "transport", description: "Private intercity bus seat booking platform", externalUrl: "https://busseat.lk/", tags: ["bus", "transport", "private", "intercity"] },
      { name: "Bus.lk", slug: "bus-lk", icon: "🚌", category: "transport", description: "Private intercity bus booking platform", externalUrl: "https://bus.lk/", tags: ["bus", "transport", "private", "intercity"] },
      { name: "Magiya.lk", slug: "magiya-lk", icon: "🚌", category: "transport", description: "Private intercity bus booking platform", externalUrl: "https://magiya.lk/", tags: ["bus", "transport", "private", "intercity"] },

      // Hotels & Stays
      { name: "Booking.com Sri Lanka", slug: "booking-com", icon: "🏨", category: "hotels-stays", description: "Find the best hotels and stays", externalUrl: "https://www.booking.com/country/lk.html", featured: true, tags: ["hotel", "stay", "accommodation"] },
      { name: "Trivago Sri Lanka", slug: "trivago", icon: "🛏️", category: "hotels-stays", description: "Compare hotel prices", externalUrl: "https://ar.trivago.com/en-145/odr/hotels-sri-lanka", tags: ["hotel", "compare"] },
      { name: "Agoda Sri Lanka", slug: "agoda", icon: "🏖️", category: "hotels-stays", description: "Hotels and resorts", externalUrl: "https://www.agoda.com/country/sri-lanka.html", tags: ["hotel", "resort"] },
      { name: "Airbnb Sri Lanka", slug: "airbnb", icon: "🏠", category: "hotels-stays", description: "Vacation rentals and experiences", externalUrl: "https://www.airbnb.com/s/Sri-Lanka", featured: true, tags: ["rental", "homestay", "villa"] },

      // Entertainment
      { name: "BookMyShow LK", slug: "bookmyshow", icon: "🍿", category: "entertainment", description: "Movie and event tickets", externalUrl: "https://lk.bookmyshow.com", featured: true, tags: ["movies", "cinema", "events"] },
      { name: "Eventbrite Sri Lanka", slug: "eventbrite", icon: "🎟️", category: "entertainment", description: "Find local events", externalUrl: "https://www.eventbrite.lk", tags: ["events", "tickets"] },

      // Health
      { name: "eChannelling", slug: "echannelling", icon: "🩺", category: "health-medical", description: "Channel a doctor easily", externalUrl: "https://www.echannelling.com", featured: true, tags: ["doctor", "hospital", "channeling"] },
      { name: "DL Medical (echannelling)", slug: "dl-medical", icon: "👁️", category: "health-medical", description: "Book driving licence medical test", externalUrl: "https://www.echannelling.com/driving-license-medical", tags: ["medical"] },    
      { name: "1990 Ambulance", slug: "1990-ambulance", icon: "🚑", category: "health-medical", description: "Suwaseriya Emergency Ambulance", externalUrl: "tel:1990", featured: true, tags: ["emergency", "ambulance"] },
      { name: "Osu Sala", slug: "osu-sala", icon: "💊", category: "health-medical", description: "Government Pharmacy locator", externalUrl: "https://www.nmra.gov.lk", tags: ["pharmacy", "medicine"] },
      { name: "Doc.lk", slug: "doc-lk", icon: "🩺", category: "health-medical", description: "Search and book doctors across Sri Lanka", externalUrl: "https://www.doc.lk", featured: true, tags: ["doctor", "hospital", "channeling"] },
      { name: "Asiri Health", slug: "asiri-health", icon: "🏥", category: "health-medical", description: "Book appointments across Asiri hospitals", externalUrl: "https://asirihealth.com/doctor-appointment", tags: ["doctor", "hospital", "channeling"] },
      { name: "Durdans Hospital", slug: "durdans", icon: "🏥", category: "health-medical", description: "Book a doctor appointment at Durdans", externalUrl: "https://www.durdans.com/appointments/search.php", tags: ["doctor", "hospital", "channeling"] },
      { name: "Nine Wells Hospital", slug: "ninewells", icon: "🏥", category: "health-medical", description: "Book a doctor appointment at Nine Wells", externalUrl: "https://www.ninewellshospital.lk/appointment-booking/", tags: ["doctor", "hospital", "channeling"] },

      // Government
      { name: "Department of Motor Traffic", slug: "dmt", icon: "🚗", category: "government", description: "Driving licences and vehicle registration", externalUrl: "https://www.gov.lk/services/erl/es/erl/view/index.action", featured: true, tags: ["dmt", "licence", "vehicle", "driving"] },
      // New: DMT online appointment booking and revenue licence renewal
      { name: "DMT Appointment Booking", slug: "dmt-appointments", icon: "📅", category: "government", description: "Book a Department of Motor Traffic appointment online", externalUrl: "https://dmtappointments.dmt.gov.lk/", tags: ["dmt", "licence", "appointment", "driving"] },
      { name: "Vehicle Revenue Licence", slug: "vehicle-revenue-licence", icon: "🧾", category: "government", description: "Renew your vehicle revenue licence online", externalUrl: "https://www.gov.lk/services/erl/es/erl/view/index.action", tags: ["dmt", "licence", "revenue"] },
      // Updated: point at the specific passports/visas landing page you shared.
      { name: "Department of Immigration", slug: "immigration", icon: "🛂", category: "government", description: "Passports and visas", externalUrl: "https://www.immigration.gov.lk/index_e.php", tags: ["passport", "visa"] },
      // Fixed: this previously pointed to the Election Commission
      // (ec.gov.lk), which is the wrong agency entirely for NIC services.
      // Now correctly points to the Department for Registration of Persons.
      { name: "NIC — Department for Registration of Persons", slug: "nic", icon: "🪪", category: "government", description: "Apply for or manage your National Identity Card", externalUrl: "https://drp.gov.lk/en/home.php", tags: ["nic", "id"] },

      // Delivery
      { name: "ParcelBuddy", slug: "parcelbuddy", icon: "📦", category: "delivery", description: "P2P parcel delivery", externalUrl: "https://www.parcelbuddy.lk/send", secondaryUrls: [{ label: "Track/Find Parcel", url: "https://www.parcelbuddy.lk/parcels" }], tags: ["delivery", "p2p"] },
      { name: "Kapruka", slug: "kapruka", icon: "🎁", category: "delivery", description: "Online shopping and delivery", externalUrl: "https://www.kapruka.com", featured: true, tags: ["gift", "delivery", "shopping"] },

      // Food
      { name: "PickMe Food", slug: "pickme-food", icon: "🍔", category: "food", description: "Food delivery from local restaurants", externalUrl: "https://pickme.lk/food", featured: true, tags: ["food", "delivery"] },
      { name: "Uber Eats LK", slug: "uber-eats", icon: "🍕", category: "food", description: "Global food delivery app", externalUrl: "https://www.ubereats.com", tags: ["food", "delivery"] },
      // New: table booking / restaurant reservation services
      { name: "MyTable.lk", slug: "mytable", icon: "🍽️", category: "food", description: "Reserve a table at restaurants across Sri Lanka", externalUrl: "https://mytable.lk/venues", tags: ["restaurant", "reservation", "dining"] },
      { name: "EatApp", slug: "eatapp", icon: "🍽️", category: "food", description: "Book a table online at partner restaurants", externalUrl: "https://eatapp.co/sri-lanka", tags: ["restaurant", "reservation", "dining"] },
      { name: "Galle Face Hotel Dining", slug: "galle-face-dining", icon: "🍽️", category: "food", description: "Reserve a table at Galle Face Hotel's restaurants", externalUrl: "https://gallefacehotel.com/dining/", tags: ["restaurant", "reservation", "dining"] },

      // Jobs
      { name: "TopJobs Sri Lanka", slug: "topjobs", icon: "💼", category: "jobs", description: "Local job portal", externalUrl: "https://www.topjobs.lk", featured: true, tags: ["job", "career", "work"] },
      // New: Xpress Jobs
      { name: "Xpress Jobs", slug: "xpress-jobs", icon: "💼", category: "jobs", description: "Search job vacancies across Sri Lanka", externalUrl: "https://xpress.jobs", featured: true, tags: ["job", "career", "work"] },
      { name: "Fiverr", slug: "fiverr", icon: "💻", category: "jobs", description: "Global freelance marketplace", externalUrl: "https://www.fiverr.com", tags: ["freelance", "gig"] },
    ];
    await Service.insertMany(servicesData);
    console.log("Services seeded");

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