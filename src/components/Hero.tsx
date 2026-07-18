"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
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
    <div className="relative bg-gradient-to-b from-brand-night via-[#1a0a0a] to-brand-night pt-28 pb-20 sm:pt-36 sm:pb-28 text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[100px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>
      
      <div className="relative max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Sri Lanka&apos;s #1 Service Directory
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-5 leading-[1.1]">
          {headline}
        </h1>
        
        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-red/20 via-brand-gold/20 to-brand-red/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex bg-white rounded-xl shadow-xl shadow-black/10 overflow-hidden">
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
        <div className="mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 font-medium uppercase tracking-wider">Popular searches</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {quickSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item);
                  router.push(`/search?q=${encodeURIComponent(item)}`);
                }}
                className="group px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 hover:bg-brand-red text-gray-300 hover:text-white rounded-full text-xs sm:text-sm font-medium transition-all border border-white/10 hover:border-brand-red hover:shadow-lg hover:shadow-brand-red/20 flex items-center gap-2"
              >
                {item}
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 text-gray-500 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
            <span><strong className="text-white font-bold">500+</strong> Services</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span><strong className="text-white font-bold">24/7</strong> Access</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
            <span><strong className="text-white font-bold">100%</strong> Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
