"use client";

import Link from "next/link";
import { Menu, X, Search, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import IconRenderer from "./IconRenderer";

export default function Navbar({ categories }: { categories: any[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-brand-night/95 backdrop-blur-md shadow-lg" 
        : "bg-brand-night"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-brand-red">24</span>hours.lk
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories?.slice(0, 5).map((category: any) => (
              <Link 
                key={category._id} 
                href={`/category/${category.slug}`} 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            ))}
            <Link 
              href="/assistant"
              title="Ask 24hours.lk — book services by chatting with our assistant"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-red hover:bg-brand-red-dk transition-colors"
            >
              <Bot className="w-5 h-5 text-white" />
              <span className="sr-only">Ask 24hours.lk — book services by chatting with our assistant</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link 
              href="/assistant"
              title="Ask 24hours.lk"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red hover:bg-brand-red-dk transition-colors"
            >
              <Bot className="w-5 h-5 text-white" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-[80vh]" : "max-h-0"
      }`}>
        <div className="px-3 pt-2 pb-4 space-y-1 bg-brand-night/98 border-t border-gray-800 max-h-[calc(80vh-4rem)] overflow-y-auto">
          {categories?.map((category: any) => (
            <Link 
              key={category._id} 
              href={`/category/${category.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {category.icon && <IconRenderer iconName={category.icon} className="w-5 h-5" style={{ color: category.color }} />}
              <span>{category.name}</span>
            </Link>
          ))}
          <Link 
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg text-sm font-bold transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Services
          </Link>
        </div>
      </div>
    </nav>
  );
}
