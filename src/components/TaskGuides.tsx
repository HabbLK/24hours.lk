import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function TaskGuides({ guides }: { guides: any[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-heading font-bold mb-6 text-brand-ink">What do you want to do?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link 
            key={guide._id.toString()}
            href={`/guide/${guide.slug}`}
            className="block bg-brand-night text-white rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-brand-red/10 transition-all"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl group-hover:bg-brand-red/30 transition-all" />
            <h3 className="text-xl font-heading font-bold mb-4 pr-8">{guide.title}</h3>
            <div className="space-y-3 mb-6">
              {guide.steps.slice(0, 2).map((step: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-1">{step.title}</p>
                </div>
              ))}
              {guide.steps.length > 2 && (
                <p className="text-xs text-gray-500 ml-7">
                  + {guide.steps.length - 2} more step{guide.steps.length - 2 > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center text-sm font-bold text-brand-red group-hover:text-white transition-colors">
              View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
