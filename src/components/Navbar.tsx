"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-brand-red">24</span>hours.lk
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories?.slice(0, 5).map((category: any) => (
              <Link 
                key={category._id.toString()} 
                href={`/category/${category.slug}`} 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            ))}
            <Link 
              href="/search" 
              className="px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg text-sm font-bold transition-all hover:scale-105"
            >
              Search
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-96" : "max-h-0"
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-brand-night/98 border-t border-gray-800">
          {categories?.map((category: any) => (
            <Link 
              key={category._id.toString()} 
              href={`/category/${category.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {category.icon} {category.name}
            </Link>
          ))}
          <Link 
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg text-sm font-bold text-center transition-colors"
          >
            Search Services
          </Link>
        </div>
      </div>
    </nav>
  );
}
