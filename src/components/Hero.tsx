"use client";

import { useState } from "react";
import { Search, Clock, MapPin } from "lucide-react";
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
    <div className="relative bg-gradient-to-br from-brand-night via-brand-night to-brand-ink pt-24 pb-16 sm:pt-32 sm:pb-24 text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-3xl mx-auto">
        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-4 leading-tight">
          {headline}
        </h1>
        
        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
        
        {/* Simplified Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input 
              suppressHydrationWarning
              type="text" 
              placeholder="Search services..." 
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none bg-white text-brand-ink text-sm sm:text-base font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red border-2 border-brand-red/20 focus:border-brand-red transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-all hover:shadow-lg hover:shadow-brand-red/40 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        {quickSearches.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm text-gray-400 mb-3 font-medium">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-brand-red hover:text-white text-gray-300 rounded-lg text-xs sm:text-sm font-medium transition-all border border-white/10 hover:border-brand-red"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Minimal Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold">500+</span>
            <span>Services</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-red" />
            <span>24/7 Access</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>All Sri Lanka</span>
          </div>
        </div>
      </div>
    </div>
  );
}
