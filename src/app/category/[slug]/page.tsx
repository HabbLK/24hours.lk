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

const CATEGORY_BANNERS: Record<string, string> = {
  transport: "/images/categories/transport.jpg",
  government: "/images/categories/government.jpg",
  education: "/images/categories/education.jpg",
  "health-medical": "/images/categories/health.jpg",
  "hotels-stays": "/images/categories/travel.jpg",
  entertainment: "/images/categories/Entertainment.webp",
  delivery: "/images/categories/delivey and logistics.jpg",
  food: "/images/categories/food and dining.avif",
  jobs: "/images/categories/freelance and jobs.webp",
  finance: "/images/categories/finance aand.jpg",
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug, active: true }).lean();

  if (!category) {
    notFound();
  }

  const rawServices = await Service.find({ category: category.slug, active: true }).lean();

  const tierPriority: Record<string, number> = { featured: 0, verified: 1, basic: 2 };
  rawServices.sort((a: any, b: any) => {
    const tierA = tierPriority[a.tier] ?? 2;
    const tierB = tierPriority[b.tier] ?? 2;
    if (tierA !== tierB) return tierA - tierB;
    return (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name);
  });

  const services = JSON.parse(JSON.stringify(rawServices));
  const banner = CATEGORY_BANNERS[category.slug];

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pb-12">
        {banner ? (
          <div className="relative h-52 sm:h-64 -mt-0 pt-14">
            <img src={banner} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-night/80 via-brand-night/30 to-transparent" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Home
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center">
                  {category.icon && <IconRenderer iconName={category.icon} className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">{category.name}</h1>
                  <p className="text-white/70 text-sm mt-1">{services.length} service{services.length !== 1 ? "s" : ""} available</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-brand-red hover:text-brand-red-dk mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Link>

            <div className="flex items-center gap-5 mb-4">
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                {category.icon && <IconRenderer iconName={category.icon} className="w-8 h-8" />}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink">{category.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{services.length} service{services.length !== 1 ? "s" : ""} available</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {banner && (
            <p className="text-gray-600 mb-6">
              {category.description || `Explore all ${category.name.toLowerCase()} services available across Sri Lanka`}
            </p>
          )}
          <BannerSlot slot="category" categorySlug={slug} />

          {services.length > 0 ? (
            <FeaturedServices services={services} />
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
              <div className="mb-3 opacity-40 flex justify-center">
                {category.icon && <IconRenderer iconName={category.icon} className="w-14 h-14" />}
              </div>
              <h2 className="text-xl font-bold text-gray-700 mb-1">No services yet</h2>
              <p className="text-gray-500 text-sm mb-5">We&apos;re working on adding services to this category.</p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm rounded-lg transition-colors"
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
