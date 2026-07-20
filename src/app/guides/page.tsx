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
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink mb-2">Task guides</h1>
            <p className="text-gray-500 text-sm">Step-by-step walkthroughs for essential tasks in Sri Lanka</p>
          </div>

          {serializedGuides.length > 0 ? (
            <TaskGuides guides={serializedGuides} />
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
              <ListOrdered className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-700 mb-1">No guides yet</h2>
              <p className="text-gray-500 text-sm">We&apos;re working on adding step-by-step guides.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
