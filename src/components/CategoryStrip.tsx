import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  transport: "/images/categories/transport.jpg",
  "hotels-stays": "/images/categories/travel.jpg",
  "health-medical": "/images/categories/health.jpg",
  government: "/images/categories/government.jpg",
  education: "/images/categories/education.jpg",
  entertainment: "/images/categories/Entertainment.webp",
  delivery: "/images/categories/delivey and logistics.jpg",
  food: "/images/categories/food and dining.avif",
  jobs: "/images/categories/freelance and jobs.webp",
  finance: "/images/categories/finance aand.jpg",
};

export default function CategoryStrip({ categories }: { categories: any[] }) {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink">Explore by category</h2>
        </div>
        <Link
          href="/search"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:text-brand-red-dk transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => {
          const img = CATEGORY_IMAGES[category.slug];
          return (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-100"
            >
              {img ? (
                <img
                  src={img}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-brand-night" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white text-sm font-bold leading-tight block">{category.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/search"
        className="sm:hidden flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-red mt-4"
      >
        View all categories <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
