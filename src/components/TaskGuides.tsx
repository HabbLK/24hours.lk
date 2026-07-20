import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function TaskGuides({ guides }: { guides: any[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink">Step-by-step guides</h2>
          <p className="text-sm text-gray-500 mt-1">Detailed walkthroughs for any task</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide._id.toString()}
            href={`/guide/${guide.slug}`}
            className="group bg-brand-night text-white rounded-xl p-5 hover:bg-brand-ink transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-heading font-bold leading-snug pr-2">
                {guide.title}
              </h3>
              {guide.steps?.length > 0 && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                  {guide.steps.length} steps
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {guide.steps?.slice(0, 2).map((step: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-400 line-clamp-1">{step.title}</p>
                </div>
              ))}
              {guide.steps?.length > 2 && (
                <p className="text-[11px] text-gray-600 ml-[22px]">
                  +{guide.steps.length - 2} more
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs font-bold text-brand-red group-hover:text-white transition-colors">
                View guide
              </span>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
