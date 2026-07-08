import Link from "next/link";

export default function CategoryStrip({ categories }: { categories: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-heading font-bold mb-6 text-brand-ink">Explore Categories</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x">
        {categories.map((category) => (
          <Link 
            key={category._id.toString()} 
            href={`/category/${category.slug}`}
            className="flex flex-col items-center justify-center min-w-[100px] w-[100px] h-[100px] bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all snap-start hover:-translate-y-1"
          >
            <span className="text-3xl mb-2">{category.icon}</span>
            <span className="text-xs font-medium text-center text-gray-700 px-2 line-clamp-2 leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
