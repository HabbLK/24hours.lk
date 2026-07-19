import Link from "next/link";
import { ArrowRight } from "lucide-react";
import IconRenderer from "./IconRenderer";

export default function CategoryStrip({ categories }: { categories: any[] }) {
  return (
    <section className="animate-fade-in-up -mx-4 sm:mx-0">
      <div className="flex justify-between items-center mb-5 sm:mb-7 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink mb-1">Explore Categories</h2>
          <p className="text-sm text-gray-500">Browse services by category</p>
        </div>
        <Link href="/search" className="hidden sm:flex items-center gap-2 text-brand-red hover:text-brand-red-dk font-semibold text-sm transition-colors group">
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 gap-3 sm:gap-4 hide-scrollbar snap-x snap-mandatory scroll-smooth px-4 sm:px-0">
          {categories.map((category, idx) => (
            <Link 
              key={category._id} 
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center justify-center min-w-[100px] w-[100px] h-[100px] sm:min-w-[130px] sm:w-[130px] sm:h-[130px] bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all snap-start hover:-translate-y-2 hover:border-brand-red/20 relative overflow-hidden animate-fade-in-up flex-shrink-0"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/0 group-hover:from-brand-red/[0.03] group-hover:to-brand-red/[0.06] transition-all duration-500" />
              <div className="mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                <IconRenderer iconName={category.icon} className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: category.color }} />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-center text-gray-700 group-hover:text-brand-red px-2 sm:px-3 line-clamp-2 leading-tight relative z-10 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
        {/* Fade edges */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-brand-mist to-transparent pointer-events-none" />
        <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-brand-mist to-transparent pointer-events-none" />
      </div>
      {/* Mobile View All Link */}
      <Link href="/search" className="sm:hidden flex items-center justify-center gap-2 text-brand-red hover:text-brand-red-dk font-semibold text-sm transition-colors mt-3 px-4">
        View All Categories
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
