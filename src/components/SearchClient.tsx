"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import FeaturedServices from "@/components/FeaturedServices";
import TaskGuides from "@/components/TaskGuides";
import { Search as SearchIcon } from "lucide-react";

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
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center bg-white rounded-full p-2 shadow-sm border border-gray-200 focus-within:border-brand-red/50 transition-all">
          <div className="pl-4">
            <SearchIcon className="w-6 h-6 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="E.g. Renew driving licence..." 
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

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {results.guides.length === 0 && results.services.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found for "{q}"</h2>
              <p className="text-gray-500 mb-6">Try searching for something else or explore our categories.</p>
              <Link href="/" className="text-brand-red font-medium hover:underline">
                Go back home
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {results.guides.length > 0 && (
                <div>
                  <div className="mb-6">
                    <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">Guided Flow</span>
                    <h2 className="text-2xl font-heading font-bold text-brand-ink">Here's how to complete this</h2>
                  </div>
                  <TaskGuides guides={results.guides} />
                </div>
              )}

              {results.services.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-brand-ink">Relevant Services</h2>
                  <FeaturedServices services={results.services} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
