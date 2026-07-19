import Link from "next/link";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";

export default function TaskGuides({ guides }: { guides: any[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <div className="mb-5 sm:mb-7">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink mb-1 sm:mb-2">Step-by-Step Guides</h2>
        <p className="text-sm sm:text-base text-gray-500">Complete any task with our detailed walkthroughs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {guides.map((guide, idx) => (
          <Link 
            key={guide._id.toString()}
            href={`/guide/${guide.slug}`}
            className="block bg-gradient-to-br from-brand-night via-[#1a1210] to-brand-ink text-white rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-brand-red/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Background blob */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-red/15 rounded-full blur-2xl group-hover:bg-brand-red/30 transition-all duration-500 group-hover:scale-125" />
            <div className="absolute -left-8 -top-8 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-all duration-500" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-heading font-bold pr-3 sm:pr-4 flex-1 group-hover:text-brand-gold transition-colors duration-300 leading-tight">
                  {guide.title}
                </h3>
                {guide.steps?.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {guide.steps.length}
                  </div>
                )}
              </div>
              
              {/* Steps preview */}
              <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                {guide.steps?.slice(0, 2).map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-1">{step.title}</p>
                  </div>
                ))}
                {guide.steps?.length > 2 && (
                  <p className="text-[11px] sm:text-xs text-gray-500 ml-5 sm:ml-[18px]">
                    +{guide.steps.length - 2} more step{guide.steps.length - 2 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              
              {/* CTA */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                <span className="text-xs sm:text-sm font-bold text-brand-red group-hover:text-white transition-colors duration-300">
                  View Full Guide
                </span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-red/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
