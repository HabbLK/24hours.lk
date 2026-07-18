import { Search, ListOrdered, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-7 h-7" />,
      title: "Search for What You Need",
      description: "Type in any service you're looking for — from government forms to healthcare appointments.",
    },
    {
      icon: <ListOrdered className="w-7 h-7" />,
      title: "Follow Step-by-Step Guides",
      description: "Get detailed instructions on how to complete your task, with direct links to the right resources.",
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: "Complete Your Task",
      description: "Access the service directly through our partners and get things done quickly.",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/5 border border-brand-red/10 rounded-full text-brand-red text-xs font-bold uppercase tracking-wider mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-ink mb-3">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            Getting things done in Sri Lanka has never been easier. Just three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative text-center group animate-fade-in-up bg-white rounded-2xl p-8 border border-gray-100 hover:border-brand-red/20 hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-300"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-brand-red rounded-full flex items-center justify-center z-10 shadow-lg shadow-brand-red/30">
                <span className="text-xs font-bold text-white">{index + 1}</span>
              </div>

              {/* Icon container */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-red/10 to-brand-red/5 text-brand-red rounded-2xl mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-red/10 transition-all duration-300">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-heading font-bold text-brand-ink mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up delay-400">
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-red/20 hover:shadow-xl hover:shadow-brand-red/30"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
