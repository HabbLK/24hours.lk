"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ExternalLink, Star, Shield } from "lucide-react";
import IconRenderer from "./IconRenderer";
import AuthModal from "./AuthModal";

const TIER_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  verified: {
    label: "Verified",
    className: "bg-blue-500 text-white",
    icon: Shield,
  },
  featured: {
    label: "Featured",
    className: "bg-amber-500 text-white",
    icon: Star,
  },
};

export default function FeaturedServices({ services }: { services: any[] }) {
  const { data: session } = useSession();
  const [authModal, setAuthModal] = useState<{ open: boolean; service: any }>({ open: false, service: null });

  if (!services || services.length === 0) return null;

  const tierPriority: Record<string, number> = { featured: 0, verified: 1, basic: 2 };
  const sorted = [...services].sort((a, b) => {
    const tierA = tierPriority[a.tier] ?? 2;
    const tierB = tierPriority[b.tier] ?? 2;
    if (tierA !== tierB) return tierA - tierB;
    return (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name);
  });

  return (
    <section className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-5 sm:mb-7 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink mb-1 sm:mb-2">Popular Services</h2>
          <p className="text-sm sm:text-base text-gray-500">Most accessed services by our users</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {sorted.map((service, idx) => {
          const tierConfig = service.tier && service.tier !== "basic" ? TIER_CONFIG[service.tier] : null;
          const TierIcon = tierConfig?.icon;
          return (
            <a 
              key={service._id} 
              href={session?.user ? service.externalUrl : "#"}
              onClick={(e) => {
                if (!session?.user) {
                  e.preventDefault();
                  setAuthModal({ open: true, service });
                }
              }}
              target={session?.user ? "_blank" : undefined}
              rel={session?.user ? "noopener noreferrer" : undefined}
              className="group block bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Tier badge */}
              {tierConfig && (
                <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tierConfig.className}`}>
                  <TierIcon className="w-3 h-3" />
                  {tierConfig.label}
                </div>
              )}

              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-gold/0 group-hover:from-brand-red/[0.02] group-hover:to-brand-gold/[0.04] transition-all duration-500" />
              
              {/* External link icon */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-300 group-hover:text-brand-red transition-all duration-300 group-hover:scale-110">
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              {/* Icon */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-red/8 to-brand-gold/8 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                <IconRenderer iconName={service.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-brand-red" />
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="font-bold text-base sm:text-lg text-brand-ink mb-1.5 group-hover:text-brand-red transition-colors duration-300 line-clamp-2 leading-tight">{service.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">{service.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      <AuthModal
        open={authModal.open}
        onClose={() => setAuthModal({ open: false, service: null })}
        message={`Sign up to earn points on ${authModal.service?.name || "this booking"}`}
        callbackUrl={authModal.service?.externalUrl || "/"}
      />
    </section>
  );
}
