"use client";

import { useState } from "react";
import { Search, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero({ headline, subtext }: { headline: string; subtext: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const quickSearches = [
    "Renew License",
    "Book Doctor",
    "Bus Tickets",
  ];

  return (
    <div className="relative bg-gradient-to-b from-white via-brand-mist to-brand-mist pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-red/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        {/* Left: content */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/5 border border-brand-red/10 rounded-full text-brand-red text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
            Sri Lanka&apos;s #1 Service Directory
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-heading font-extrabold text-brand-ink tracking-tight mb-5 leading-[1.1]">
            {headline}
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {subtext}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-red/15 via-brand-gold/15 to-brand-red/15 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex bg-white rounded-xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                <input
                  suppressHydrationWarning
                  type="text"
                  placeholder="Search services, guides, providers..."
                  className="flex-1 px-5 sm:px-6 py-4 sm:py-5 bg-transparent text-brand-ink text-sm sm:text-base font-medium placeholder:text-gray-400 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-5 sm:px-8 py-4 sm:py-5 bg-brand-red hover:bg-brand-red-dk text-white font-bold transition-all flex items-center gap-2 text-sm sm:text-base shrink-0"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mb-10 lg:mb-12">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">Popular searches</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                  }}
                  className="group px-4 sm:px-5 py-2 sm:py-2.5 bg-white hover:bg-brand-red text-gray-700 hover:text-white rounded-full text-xs sm:text-sm font-medium transition-all border border-gray-200 hover:border-brand-red hover:shadow-lg hover:shadow-brand-red/20 flex items-center gap-2"
                >
                  {item}
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 text-gray-500 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
              <span><strong className="text-brand-ink font-bold">500+</strong> Services</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span><strong className="text-brand-ink font-bold">24/7</strong> Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              <span><strong className="text-brand-ink font-bold">100%</strong> Free</span>
            </div>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="relative hidden lg:block h-[440px] animate-fade-in">
          <img
            src="/illustrations/hero-illustration.svg"
            alt="Person booking a service on their phone"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Floating stat card */}
          <div className="absolute left-0 bottom-6 bg-white rounded-2xl shadow-xl shadow-black/10 px-4 py-3 flex items-center gap-3 animate-fade-in-up">
            <div className="flex -space-x-2">
              {["bg-brand-red", "bg-brand-gold", "bg-brand-night"].map((bg, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                  {["A", "S", "P"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-ink leading-none">50,000+</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Happy users</p>
            </div>
          </div>

          {/* Floating verified badge */}
          <div className="absolute right-4 top-6 bg-white rounded-full shadow-lg shadow-black/10 px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold text-brand-ink animate-fade-in-down delay-100">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            Verified Providers
          </div>
        </div>
      </div>
    </div>
  );
}
