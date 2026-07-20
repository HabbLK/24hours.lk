"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero({ headline, subtext }: { headline: string; subtext: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const quickSearches = ["Renew License", "Book Doctor", "Bus Tickets"];

  return (
    <section className="relative flex flex-col justify-end min-h-dvh overflow-hidden">
      <img
        src="/images/hero/hero-main.jpg"
        alt="Person using the 24hours.lk app on the street in Colombo"
        className="absolute inset-0 w-full h-full object-cover object-[center_22%] sm:object-[center_30%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(15,8,6,0.96) 0%, rgba(17,9,7,0.9) 30%, rgba(19,10,8,0.62) 55%, rgba(22,11,8,0.28) 78%, rgba(28,12,8,0.08) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-multiply opacity-25"
        style={{ background: "linear-gradient(115deg, rgba(228,50,43,0.5) 0%, transparent 40%)" }}
      />

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-8 sm:pb-14 lg:pb-16">
        <div className="max-w-xl">
          <p className="text-brand-gold text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-3 sm:mb-4">
            Sri Lanka&apos;s service directory
          </p>

          <h1 className="text-[2.1rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-6xl font-heading font-extrabold text-white tracking-tight sm:leading-[1.05] mb-3 sm:mb-5 text-balance">
            {headline}
          </h1>

          <p className="text-white/80 text-sm sm:text-lg max-w-lg leading-relaxed mb-5 sm:mb-8">
            {subtext}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mb-4 sm:mb-6">
            <div className="flex bg-white rounded-xl overflow-hidden shadow-2xl shadow-black/40">
              <input
                suppressHydrationWarning
                type="text"
                placeholder="What do you need to get done?"
                className="flex-1 min-w-0 px-4 sm:px-5 py-3.5 sm:py-4 text-brand-ink text-sm placeholder:text-gray-400 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 sm:px-6 py-3.5 sm:py-4 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs text-white/60 font-medium mr-1">Popular:</span>
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => router.push(`/search?q=${encodeURIComponent(item)}`)}
                className="text-[11px] sm:text-xs font-medium text-white bg-white/10 border border-white/15 hover:bg-brand-red hover:border-brand-red px-3 sm:px-3.5 py-1.5 rounded-full transition-colors backdrop-blur-sm"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-white/70">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full shrink-0" />
              <strong className="text-white font-bold">500+</strong> Services
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
              <strong className="text-white font-bold">24/7</strong> Access
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
              <strong className="text-white font-bold">Free</strong> to use
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
