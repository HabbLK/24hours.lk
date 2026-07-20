"use client";

import Link from "next/link";
import { Menu, X, Search, Home, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Guides", href: "/guides", icon: BookOpen },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 bg-brand-night ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="font-heading font-bold text-lg tracking-tight text-white flex items-center hover:opacity-85 transition-opacity">
            <span className="text-brand-red">24</span>hours<span className="text-brand-red">.lk</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold px-3.5 py-2 rounded-full transition-colors ${
                    active ? "text-white bg-white/15" : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="w-px h-4 bg-white/15 mx-2" />
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-gray-400 hover:text-gray-200 px-2 py-2 transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-white/15 mx-2" />
            {session?.user ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-white bg-brand-red hover:bg-brand-red-dk px-5 py-2 rounded-full transition-all hover:scale-105 shadow-md shadow-brand-red/25"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {session?.user ? (
              <UserMenu />
            ) : (
              <Link href="/login" className="text-xs font-bold text-white bg-brand-red px-3.5 py-1.5 rounded-full">
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                mobileMenuOpen ? "bg-brand-red border-brand-red text-white" : "bg-white/8 border-white/15 text-white hover:bg-white/15"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — full screen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-brand-night transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-dvh">
          {/* Overlay header — mirrors the navbar row so the close button lines up with the hamburger */}
          <div className="px-4 sm:px-6 shrink-0">
            <div className="flex justify-between h-16 items-center">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-heading font-bold text-lg tracking-tight text-white flex items-center hover:opacity-85 transition-opacity"
              >
                <span className="text-brand-red">24</span>hours<span className="text-brand-red">.lk</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg border bg-brand-red border-brand-red text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ transitionDelay: mobileMenuOpen ? `${i * 40}ms` : "0ms" }}
                    className={`flex items-center gap-4 px-4 py-4 text-2xl font-heading font-bold rounded-2xl transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                    } ${active ? "text-white bg-white/12" : "text-gray-300 active:bg-white/8"}`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-brand-red" : "text-gray-500"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-6 px-4 py-4 bg-brand-red active:bg-brand-red-dk text-white rounded-2xl text-base font-bold shadow-md shadow-brand-red/20"
            >
              <Search className="w-4 h-4" />
              Search All Services
            </Link>

            {!session?.user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mt-3 px-4 py-4 border border-white/20 text-white rounded-2xl text-base font-bold"
              >
                Sign In
              </Link>
            )}

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <div className="flex gap-5">
                {LEGAL_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-xs text-gray-500">
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} HABB Global Pvt Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
