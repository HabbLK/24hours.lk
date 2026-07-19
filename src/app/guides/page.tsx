import { ListOrdered } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import TaskGuides from "@/components/TaskGuides";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";

export const metadata = {
  title: "Guides | 24hours.lk",
  description: "Step-by-step guides to help you complete any task in Sri Lanka.",
};

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  await connectDB();
  const guides = await TaskGuide.find({ active: true }).sort({ createdAt: -1 }).lean();
  const serializedGuides = JSON.parse(JSON.stringify(guides));

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {serializedGuides.length > 0 ? (
            <TaskGuides guides={serializedGuides} />
          ) : (
            <div className="text-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
              <ListOrdered className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-700 mb-2">No guides yet</h1>
              <p className="text-gray-500">We&apos;re working on adding step-by-step guides.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
