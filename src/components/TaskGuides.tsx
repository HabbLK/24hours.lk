import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

export default function TaskGuides({ guides }: { guides: any[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-3xl font-heading font-bold text-brand-ink mb-2">Step-by-Step Guides</h2>
        <p className="text-gray-600">Complete any task with our detailed walkthroughs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, idx) => (
          <Link 
            key={guide._id.toString()}
            href={`/guide/${guide.slug}`}
            className="block bg-gradient-to-br from-brand-night to-brand-ink text-white rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-brand-red/20 transition-all hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Animated background blob */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl group-hover:bg-brand-red/40 transition-all group-hover:scale-125" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/20 transition-all group-hover:scale-125" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-heading font-bold pr-4 flex-1 group-hover:text-brand-gold transition-colors">
                  {guide.title}
                </h3>
                {guide.steps?.length > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {guide.steps.length} steps
                  </div>
                )}
              </div>
              
              {/* Steps preview */}
              <div className="space-y-3 mb-6">
                {guide.steps?.slice(0, 2).map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-1">{step.title}</p>
                  </div>
                ))}
                {guide.steps?.length > 2 && (
                  <p className="text-xs text-gray-500 ml-7">
                    + {guide.steps.length - 2} more step{guide.steps.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              {/* CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-bold text-brand-red group-hover:text-white transition-colors">
                  View Full Guide
                </span>
                <ArrowRight className="w-5 h-5 text-brand-red group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
