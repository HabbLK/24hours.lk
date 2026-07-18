import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchClient from "@/components/SearchClient";
import ScrollToTop from "@/components/ScrollToTop";
import BannerSlot from "@/components/BannerSlot";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
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
          <div className="mt-8">
            <BannerSlot slot="search" />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
