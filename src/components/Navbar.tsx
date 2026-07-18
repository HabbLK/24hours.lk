"use client";

import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Guides", href: "/guides" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Navbar() {
  const { data: session } = useSession();
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
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      scrolled
        ? "bg-brand-night/95 backdrop-blur-md shadow-lg shadow-black/10"
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
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-gray-700 mx-1" />

            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-gray-500 hover:text-gray-300 px-2 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-gray-700 mx-2" />

            {session?.user ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-white bg-brand-red hover:bg-brand-red-dk px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-brand-red/25"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {session?.user ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-white bg-brand-red px-3 py-1.5 rounded-lg"
              >
                Sign In
              </Link>
            )}
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="flex items-center gap-4 px-4 py-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg text-sm font-bold transition-colors"
          >
            <Search className="w-4 h-4" />
            Search All Services
          </Link>
        </div>
      </div>
    </nav>
  );
}
