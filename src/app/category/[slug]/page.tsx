import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Service from "@/models/Service";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FeaturedServices from "@/components/FeaturedServices";
import BannerSlot from "@/components/BannerSlot";
import IconRenderer from "@/components/IconRenderer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  
  const [category, allCategories] = await Promise.all([
    Category.findOne({ slug, active: true }).lean(),
    Category.find({ active: true }).sort({ sortOrder: 1 }).lean(),
  ]);
  
  if (!category) {
    notFound();
  }

  const services = await Service.find({ category: category.slug, active: true }).lean();

  const tierPriority: Record<string, number> = { featured: 0, verified: 1, basic: 2 };
  services.sort((a: any, b: any) => {
    const tierA = tierPriority[a.tier] ?? 2;
    const tierB = tierPriority[b.tier] ?? 2;
    if (tierA !== tierB) return tierA - tierB;
    return (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={allCategories as any} />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-brand-red hover:text-brand-red-dk mb-8 transition-colors group animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>

          {/* Category Header */}
          <div className="flex items-start gap-6 mb-12 animate-fade-in-up">
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-gray-100">
              {category.icon && <IconRenderer iconName={category.icon} className="w-10 h-10" />}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-ink mb-3">{category.name}</h1>
              <p className="text-lg text-gray-600">{category.description || `Explore all ${category.name.toLowerCase()} services available across Sri Lanka`}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-bold px-3 py-1 rounded-full">
                  {services.length} Service{services.length !== 1 ? 's' : ''} Available
                </span>
              </div>
            </div>
          </div>
          
          <BannerSlot slot="category" categorySlug={slug} />

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="animate-fade-in-up delay-200">
              <FeaturedServices services={services as any} />
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
              <div className="mb-4 opacity-50 flex justify-center">
                {category.icon && <IconRenderer iconName={category.icon} className="w-16 h-16" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No services yet</h2>
              <p className="text-gray-500 mb-6">We're working on adding services to this category.</p>
              <Link 
                href="/" 
                className="inline-block px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg transition-all hover:scale-105"
              >
                Explore Other Categories
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
