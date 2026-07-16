import { ExternalLink, Star } from "lucide-react";

export default function FeaturedServices({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-ink mb-2">Popular Services</h2>
          <p className="text-gray-600">Most accessed services by our users</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <a 
            key={service._id.toString()} 
            href={service.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all hover:-translate-y-2 relative overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-gold/0 group-hover:from-brand-red/5 group-hover:to-brand-gold/5 transition-all" />
            
            {/* External link icon */}
            <div className="absolute top-4 right-4 text-gray-300 group-hover:text-brand-red transition-all group-hover:scale-110">
              <ExternalLink className="w-5 h-5" />
            </div>
            
            {/* Icon */}
            <div className="relative w-14 h-14 bg-gradient-to-br from-brand-red/10 to-brand-gold/10 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            
            {/* Content */}
            <div className="relative">
              <h3 className="font-bold text-lg text-brand-ink mb-2 group-hover:text-brand-red transition-colors">{service.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
              
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
