import { ExternalLink, Star } from "lucide-react";
import IconRenderer from "./IconRenderer";

export default function FeaturedServices({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 sm:mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink mb-1 sm:mb-2">Popular Services</h2>
          <p className="text-sm sm:text-base text-gray-600">Most accessed services by our users</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {services.map((service, idx) => (
          <a 
            key={service._id} 
            href={service.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all hover:-translate-y-2 relative overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-gold/0 group-hover:from-brand-red/5 group-hover:to-brand-gold/5 transition-all" />
            
            {/* External link icon */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-300 group-hover:text-brand-red transition-all group-hover:scale-110">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            {/* Icon */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-red/10 to-brand-gold/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <IconRenderer iconName={service.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-brand-red" />
            </div>
            
            {/* Content */}
            <div className="relative">
              <h3 className="font-bold text-base sm:text-lg text-brand-ink mb-2 group-hover:text-brand-red transition-colors line-clamp-2">{service.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
              
              {/* Rating (if available) */}
              {service.rating && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  <span className="font-semibold">{service.rating}</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
