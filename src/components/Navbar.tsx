import Link from "next/link";
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
          <div className="hidden md:flex space-x-8">
            {categories.map((category: any) => (
              <Link key={category._id.toString()} href={`/category/${category.slug}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
