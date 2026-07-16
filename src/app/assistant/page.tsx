import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RedirectBookingChat from "@/components/RedirectBookingChat";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export default async function AssistantPage() {
  await connectDB();
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).lean();

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={categories as any} />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-brand-ink">
              What do you need to book?
            </h1>
            <p className="text-gray-500 mt-2">
              Tell me what you need and I'll find the right provider for you.
            </p>
          </div>
          <RedirectBookingChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}