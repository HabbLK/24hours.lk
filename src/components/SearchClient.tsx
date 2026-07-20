"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import FeaturedServices from "@/components/FeaturedServices";
import TaskGuides from "@/components/TaskGuides";
import { Search as SearchIcon, AlertCircle } from "lucide-react";

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
        .then(data => { setResults(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink mb-2">
          Search services & guides
        </h1>
        <p className="text-gray-500 text-sm">Find exactly what you need, when you need it</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mb-10">
        <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md shadow-black/5">
          <div className="pl-4 flex items-center">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="e.g. renew driving licence, book doctor..."
            className="flex-1 px-3 py-4 text-sm text-brand-ink placeholder:text-gray-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-4 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Searching for &ldquo;{q}&rdquo;...</p>
        </div>
      ) : (
        <>
          {results.guides.length === 0 && results.services.length === 0 && q ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-brand-ink mb-1">No results for &ldquo;{q}&rdquo;</h2>
              <p className="text-sm text-gray-500 mb-6">Try different keywords or explore our categories.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/" className="px-5 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm rounded-lg transition-colors">
                  Go Home
                </Link>
                <Link href="/search" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-lg transition-colors">
                  Clear Search
                </Link>
              </div>
            </div>
          ) : q ? (
            <div className="space-y-14">
              <p className="text-sm text-gray-500">
                Found {results.guides.length + results.services.length} result{results.guides.length + results.services.length !== 1 ? "s" : ""} for <span className="font-bold text-brand-ink">&ldquo;{q}&rdquo;</span>
              </p>

              {results.guides.length > 0 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-brand-ink mb-4">Guides</h2>
                  <TaskGuides guides={results.guides} />
                </div>
              )}

              {results.services.length > 0 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-brand-ink mb-4">Services</h2>
                  <FeaturedServices services={results.services} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-7 h-7 text-brand-red" />
              </div>
              <h2 className="text-xl font-bold text-brand-ink mb-1">Start your search</h2>
              <p className="text-sm text-gray-500">Enter a keyword or service name to find what you need</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
