"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Star, Award, Search, Loader2, ExternalLink } from "lucide-react";

const TIER_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  basic: { label: "Basic", color: "bg-gray-100 text-gray-700", icon: Shield },
  verified: { label: "Verified", color: "bg-blue-100 text-blue-700", icon: Award },
  featured: { label: "Featured", color: "bg-amber-100 text-amber-700", icon: Star },
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function AdminPartnersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/services")
        .then((res) => res.json())
        .then((data) => {
          setServices(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const updateTier = async (serviceId: string, tier: string) => {
    setUpdating(serviceId);
    try {
      const res = await fetch(`/api/admin/tiers/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          tierStatus: "active",
          badgeFlag: tier === "basic" ? null : tier.charAt(0).toUpperCase() + tier.slice(1),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setServices((prev) => prev.map((s) => (s._id === serviceId ? updated : s)));
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "all" || s.tier === filterTier;
    return matchSearch && matchTier;
  });

  const tierStats = {
    basic: services.filter((s) => s.tier === "basic").length,
    verified: services.filter((s) => s.tier === "verified").length,
    featured: services.filter((s) => s.tier === "featured").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Partner Tiers</h1>
          <p className="text-sm text-gray-600 mt-1">Manage partner tiers, badges, and billing status</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(tierStats).map(([tier, count]) => {
          const info = TIER_LABELS[tier];
          const Icon = info.icon;
          return (
            <div key={tier} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">{info.label}</span>
              </div>
              <p className="text-2xl font-bold text-brand-ink">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            />
          </div>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          >
            <option value="all">All Tiers</option>
            <option value="basic">Basic</option>
            <option value="verified">Verified</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => {
              const tierInfo = TIER_LABELS[service.tier] || TIER_LABELS.basic;
              const isGovt = service.category === "government";
              return (
                <tr key={service._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm text-brand-ink">{service.name}</span>
                      <a href={service.externalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{service.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierInfo.color}`}>
                      {tierInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[service.tierStatus] || STATUS_COLORS.active}`}>
                      {service.tierStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isGovt ? (
                      <span className="text-xs text-gray-400 italic">Government — locked to Basic</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {updating === service._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            {service.tier !== "verified" && (
                              <button
                                onClick={() => updateTier(service._id, "verified")}
                                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                              >
                                Set Verified
                              </button>
                            )}
                            {service.tier !== "featured" && (
                              <button
                                onClick={() => updateTier(service._id, "featured")}
                                className="text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                              >
                                Set Featured
                              </button>
                            )}
                            {service.tier !== "basic" && (
                              <button
                                onClick={() => updateTier(service._id, "basic")}
                                className="text-xs px-3 py-1 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                              >
                                Downgrade
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No services found</div>
        )}
      </div>
    </div>
  );
}
