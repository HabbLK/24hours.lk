import { ExternalLink } from "lucide-react";

export default function FeaturedServices({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-heading font-bold text-brand-ink">Popular Services</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <a 
            key={service._id.toString()} 
            href={service.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-gray-300 group-hover:text-brand-red transition-colors">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 bg-mist rounded-xl flex items-center justify-center text-2xl mb-4">
              {service.icon}
            </div>
            <h3 className="font-bold text-lg text-brand-ink mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
