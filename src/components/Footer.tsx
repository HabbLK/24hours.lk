import Link from "next/link";

export default function Footer({ tagline }: { tagline?: string }) {
  return (
    <footer className="bg-brand-night text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
            <span className="text-brand-red">24</span>hours.lk
          </Link>
          <p className="mt-2 text-sm">{tagline || "Sri Lanka's Unified Service Hub"}</p>
        </div>
        <div className="text-sm text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} HABB PVT LTD. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
