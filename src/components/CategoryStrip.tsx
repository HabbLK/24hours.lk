import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryStrip({ categories }: { categories: any[] }) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading font-bold text-brand-ink">Explore Categories</h2>
        <Link href="/search" className="hidden sm:flex items-center gap-2 text-brand-red hover:text-brand-red-dk font-semibold text-sm transition-colors group">
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x snap-mandatory scroll-smooth">
          {categories.map((category, idx) => (
            <Link 
              key={category._id.toString()} 
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center justify-center min-w-[120px] w-[120px] h-[120px] bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all snap-start hover:-translate-y-2 hover:border-brand-red/30 relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/0 group-hover:from-brand-red/5 group-hover:to-brand-red/10 transition-all" />
              <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform relative z-10">{category.icon}</span>
              <span className="text-xs font-semibold text-center text-gray-700 group-hover:text-brand-red px-3 line-clamp-2 leading-tight relative z-10 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
        {/* Scroll indicators */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-brand-mist to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-brand-mist to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
