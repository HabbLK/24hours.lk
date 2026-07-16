import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FeaturedServices from "@/components/FeaturedServices";
import TaskGuides from "@/components/TaskGuides";
import HowItWorks from "@/components/HowItWorks";
import PartnerChips from "@/components/PartnerChips";
import StatsSection from "@/components/StatsSection";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import Category from "@/models/Category";
import TaskGuide from "@/models/TaskGuide";
import SiteSettings from "@/models/SiteSettings";

export default async function Home() {
  await connectDB();

  const [services, categories, guides, settings] = await Promise.all([
    Service.find({ featured: true, active: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Category.find({ active: true }).sort({ sortOrder: 1 }).lean(),
    TaskGuide.find({ active: true }).sort({ createdAt: -1 }).limit(6).lean(),
    SiteSettings.find({}).lean(),
  ]);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={categories as any} />
      <main className="flex-grow">
        <Hero 
          headline={settingsMap.hero_headline || "What do you need to get done today?"}
          subtext={settingsMap.hero_subtext || "24hours.lk guides you to the right services, exactly when you need them. No signup required."}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          <CategoryStrip categories={categories as any} />
          <TaskGuides guides={guides as any} />
          <FeaturedServices services={services as any} />
        </div>
        <HowItWorks />
        <StatsSection />
        <PartnerChips />
        <NewsletterCTA />
      </main>
      <Footer tagline={settingsMap.footer_tagline} />
      <ScrollToTop />
    </div>
  );
}
