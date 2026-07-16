import Link from "next/link";
import { Bot } from "lucide-react";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export default async function Navbar() {
  await connectDB();
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).limit(5).lean();

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-night text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              <span className="text-brand-red">24</span>hours.lk
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category: any) => (
              <Link key={category._id.toString()} href={`/category/${category.slug}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {category.name}
              </Link>
            ))}

            <Link
              href="/assistant"
              title="Ask 24hours.lk — book services by chatting with our assistant"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-red hover:bg-brand-red-dk transition-colors"
            >
              <Bot className="w-5 h-5 text-white" />
              <span className="sr-only">Ask 24hours.lk — book services by chatting with our assistant</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}