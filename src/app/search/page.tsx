import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchClient from "@/components/SearchClient";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <SearchClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
