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
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] bg-brand-night relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <Link href="/" className="relative font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-brand-red">24</span>hours.lk
        </Link>

        <div className="relative">
          <h2 className="text-3xl xl:text-4xl font-heading font-bold text-white leading-tight mb-4">
            Get things done, any hour of the day.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            Join thousands of Sri Lankans who use 24hours.lk to find and complete essential services without the hassle.
          </p>
          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
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
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink">{heading}</h1>
            <p className="mt-1.5 text-sm text-gray-600">{description}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
