import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Search 500+ services in one place",
  "Step-by-step guides for every task",
  "Earn points and unlock promo codes",
];

export default function AuthLayout({
  heading,
  description,
  children,
}: {
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-brand-mist">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] relative overflow-hidden bg-gradient-to-br from-brand-night via-[#1a0a0a] to-brand-night flex-col justify-between p-12 xl:p-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-brand-red/15 rounded-full blur-[110px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <Link href="/" className="relative font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-brand-red">24</span>hours.lk
        </Link>

        <div className="relative animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Sri Lanka&apos;s #1 Service Directory
          </div>
          <h2 className="text-3xl xl:text-4xl font-heading font-bold text-white leading-tight mb-4">
            Get things done, any hour of the day.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join thousands of Sri Lankans who use 24hours.lk to find and complete essential services without the hassle.
          </p>
          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-gray-600">&copy; {new Date().getFullYear()} HABB Global Pvt Ltd. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Link href="/" className="lg:hidden mb-8 font-heading font-extrabold text-3xl tracking-tight text-brand-ink">
          <span className="text-brand-red">24</span>hours.lk
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink">{heading}</h1>
            <p className="mt-1.5 text-sm text-gray-600">{description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.03] border border-gray-100 p-6 sm:p-8 animate-fade-in-up delay-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
