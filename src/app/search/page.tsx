import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchClient from "@/components/SearchClient";
import ScrollToTop from "@/components/ScrollToTop";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export default async function SearchPage() {
  await connectDB();
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).lean();

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={categories as any} />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          }>
            <SearchClient />
          </Suspense>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
