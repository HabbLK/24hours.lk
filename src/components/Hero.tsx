"use client";

import { useState } from "react";
import { Search, TrendingUp, Clock, MapPin } from "lucide-react";
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
    { icon: <TrendingUp className="w-4 h-4" />, text: "Renew License" },
    { icon: <Clock className="w-4 h-4" />, text: "Book Doctor" },
    { icon: <MapPin className="w-4 h-4" />, text: "Bus Tickets" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-brand-night via-brand-night to-brand-ink pt-32 pb-28 text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-brand-red/5 to-transparent" />
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-sm font-semibold mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
          Sri Lanka's Unified Service Hub
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight animate-fade-in-up">
          {headline}
        </h1>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans animate-fade-in-up delay-200">
          {subtext}
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8 animate-fade-in-up delay-400">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full p-2 shadow-2xl border-2 border-brand-red/20 focus-within:border-brand-red/50 transition-all hover:shadow-brand-red/20">
            <div className="pl-4 sm:pl-6 py-3 sm:py-0 flex items-center">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for any service... E.g. Renew driving licence" 
              className="flex-1 bg-transparent border-none text-gray-900 px-4 py-3 focus:outline-none text-base sm:text-lg placeholder:text-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-brand-red hover:bg-brand-red-dk text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl m-1"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-600">
          <span className="text-sm text-gray-400 font-medium">Popular:</span>
          {quickSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.text);
                router.push(`/search?q=${encodeURIComponent(item.text)}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all hover:scale-105 backdrop-blur-sm"
            >
              {item.icon}
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
