"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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

  return (
    <div className="relative bg-brand-night pt-32 pb-24 text-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-brand-red/10 to-transparent pointer-events-none" />
      </div>
      
      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight">
          {headline}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-sans">
          {subtext}
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl border-4 border-brand-red/20 focus-within:border-brand-red/50 transition-all">
            <div className="pl-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <input 
              suppressHydrationWarning
              type="text" 
              placeholder="E.g. Renew driving licence, book a bus..." 
              className="w-full bg-transparent border-none text-gray-900 px-4 py-3 focus:outline-none text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-brand-red hover:bg-brand-red-dk text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Find
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
