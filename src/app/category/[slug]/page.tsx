import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Service from "@/models/Service";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedServices from "@/components/FeaturedServices";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  
  const category = await Category.findOne({ slug, active: true }).lean();
  
  if (!category) {
    notFound();
  }

  const services = await Service.find({ category: category.slug, active: true }).sort({ sortOrder: 1, name: 1 }).lean();

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100" style={{ color: category.color || 'inherit' }}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-brand-ink">{category.name}</h1>
              <p className="text-gray-500 mt-1">{category.description || `Explore all ${category.name.toLowerCase()} services`}</p>
            </div>
          </div>
          
          {services.length > 0 ? (
            <FeaturedServices services={services as any} />
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No services found in this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
