"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import FeaturedServices from "@/components/FeaturedServices";
import TaskGuides from "@/components/TaskGuides";
import { Search as SearchIcon, Sparkles, AlertCircle } from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const router = useRouter();
  
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<{ services: any[]; guides: any[] }>({ services: [], guides: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-ink mb-2">
          Search Services & Guides
        </h1>
        <p className="text-gray-600">Find exactly what you need, when you need it</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-200 focus-within:border-brand-red/50 transition-all hover:shadow-xl">
          <div className="pl-4 sm:pl-6 py-3 sm:py-0 flex items-center">
            <SearchIcon className="w-6 h-6 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="E.g. Renew driving licence, book doctor appointment..." 
            className="flex-1 bg-transparent border-none text-gray-900 px-4 py-3 focus:outline-none text-base sm:text-lg placeholder:text-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-brand-red hover:bg-brand-red-dk text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-full font-bold transition-all hover:scale-105 active:scale-95 m-1 flex items-center justify-center gap-2"
          >
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-32 animate-fade-in">
          <div className="inline-block w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Searching for "{q}"...</p>
        </div>
      ) : (
        <>
          {results.guides.length === 0 && results.services.length === 0 && q ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found for "{q}"</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or explore our categories to find what you need.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg transition-all hover:scale-105"
                >
                  Go Home
                </Link>
                <Link 
                  href="/search" 
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all hover:scale-105"
                >
                  Clear Search
                </Link>
              </div>
            </div>
          ) : q ? (
            <div className="space-y-16">
              {/* Search results header */}
              <div className="flex items-center gap-2 text-gray-600 animate-fade-in">
                <Sparkles className="w-5 h-5 text-brand-red" />
                <p>Found {results.guides.length + results.services.length} result(s) for <span className="font-bold text-brand-ink">"{q}"</span></p>
              </div>

              {results.guides.length > 0 && (
                <div className="animate-fade-in-up">
                  <div className="mb-6">
                    <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                      Step-by-Step Guides
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-ink">
                      Here's how to complete this task
                    </h2>
                  </div>
                  <TaskGuides guides={results.guides} />
                </div>
              )}

              {results.services.length > 0 && (
                <div className="animate-fade-in-up delay-200">
                  <div className="mb-6">
                    <span className="inline-block bg-brand-gold/10 text-brand-gold text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                      Direct Services
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-ink">
                      Relevant services you can access
                    </h2>
                  </div>
                  <FeaturedServices services={results.services} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
                <SearchIcon className="w-8 h-8 text-brand-red" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Start your search</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Enter a keyword or service name to find what you're looking for
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
