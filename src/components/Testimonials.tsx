import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nadeesha P.",
    location: "Colombo",
    photo: "/images/people/avatar-1.jpg",
    quote: "Renewed my driving licence in one afternoon instead of losing a whole day at the DMT. The step-by-step guide told me exactly what to bring.",
  },
  {
    name: "Ashan F.",
    location: "Kandy",
    photo: "/images/people/avatar-2.jpg",
    quote: "I found a verified doctor and booked a channelling appointment in minutes. No more calling around to five different clinics.",
  },
  {
    name: "Priyanka W.",
    location: "Galle",
    photo: "/images/people/avatar-3.jpg",
    quote: "Everything I need — bus tickets, bill payments, government forms — is finally in one place. This should have existed years ago.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-brand-mist py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10">
          <div>
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.15em] mb-3">
              What people say
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink leading-tight">
              Real stories from<br />real people
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-100"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                ))}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-brand-ink">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
