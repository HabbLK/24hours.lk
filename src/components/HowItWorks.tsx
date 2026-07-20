import { Search, ListOrdered, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Search",
      description: "Tell us what you need — a flight, a doctor, a bus ticket. We'll find the right providers.",
    },
    {
      icon: <ListOrdered className="w-6 h-6" />,
      title: "Follow the guide",
      description: "Step-by-step instructions with everything you need to complete your task.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Get it done",
      description: "Book directly through verified providers. No middlemen, no hassle.",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/images/sections/how-it-works.jpg"
                alt="Getting things done at a service counter in Sri Lanka"
                className="w-full h-[380px] lg:h-[480px] object-cover"
              />
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.15em] mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink mb-10 leading-tight">
              Three steps to get<br />anything done
            </h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">0{index + 1}</span>
                      <h3 className="text-lg font-heading font-bold text-brand-ink">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm rounded-lg transition-colors"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
