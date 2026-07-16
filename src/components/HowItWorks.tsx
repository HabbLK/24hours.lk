import { Search, List, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Search for What You Need",
      description: "Type in any service you're looking for - from government forms to healthcare appointments."
    },
    {
      icon: <List className="w-8 h-8" />,
      title: "Follow Step-by-Step Guides",
      description: "Get detailed instructions on how to complete your task, with links to the right resources."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Complete Your Task",
      description: "Access the service directly and get things done quickly and efficiently."
    }
  ];

  return (
    <section className="bg-white py-20 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-ink mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting things done in Sri Lanka has never been easier. Just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting lines on desktop */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -z-10" />
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step number background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-brand-mist rounded-full flex items-center justify-center z-10">
                <span className="text-sm font-bold text-brand-red">{index + 1}</span>
              </div>

              {/* Icon container */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-red to-brand-gold text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-bold text-brand-ink mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up delay-600">
          <a 
            href="/search" 
            className="inline-block px-8 py-4 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}
