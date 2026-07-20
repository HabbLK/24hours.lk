"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ExternalLink, Star, Shield } from "lucide-react";
import IconRenderer from "./IconRenderer";
import AuthModal from "./AuthModal";

const TIER_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  verified: { label: "Verified", className: "bg-blue-500 text-white", icon: Shield },
  featured: { label: "Featured", className: "bg-amber-500 text-white", icon: Star },
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
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-ink">Popular services</h2>
          <p className="text-sm text-gray-500 mt-1">Most accessed by our users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((service) => {
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
              className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all relative"
            >
              {tierConfig && (
                <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tierConfig.className}`}>
                  <TierIcon className="w-3 h-3" />
                  {tierConfig.label}
                </div>
              )}

              <div className="absolute top-4 right-4 text-gray-300 group-hover:text-brand-red transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>

              <div className="w-11 h-11 bg-brand-red/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red/12 transition-colors">
                <IconRenderer iconName={service.icon} className="w-5 h-5 text-brand-red" />
              </div>

              <h3 className="font-bold text-sm text-brand-ink mb-1 group-hover:text-brand-red transition-colors leading-snug">
                {service.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{service.description}</p>
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
