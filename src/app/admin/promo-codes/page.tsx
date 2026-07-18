"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Search, Check } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  redeemed: { label: "Redeemed", color: "bg-blue-100 text-blue-700" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-500" },
};

export default function AdminPromoCodesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/promo-codes")
        .then((res) => res.json())
        .then((data) => {
          setCodes(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleRedeem = async (id: string) => {
    setRedeeming(id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}/redeem`, { method: "PUT" });
      if (res.ok) {
        setCodes((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: "redeemed", redeemedAt: new Date().toISOString() } : c
          )
        );
      }
    } finally {
      setRedeeming(null);
    }
  };

  const filtered = codes.filter(
    (c) =>
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-ink">Promo Codes</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and redeem user promo codes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or user ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((promo) => {
              const config = STATUS_CONFIG[promo.status] || STATUS_CONFIG.active;
              const isExpired = new Date(promo.expiresAt) < new Date();
              return (
                <tr key={promo._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-brand-ink">{promo.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{promo.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{promo.value} pts</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      isExpired ? "bg-gray-100 text-gray-500" : config.color
                    }`}>
                      {isExpired ? "Expired" : config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(promo.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {promo.status === "active" && !isExpired && (
                      <button
                        onClick={() => handleRedeem(promo._id)}
                        disabled={redeeming === promo._id}
                        className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        {redeeming === promo._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Redeem
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No promo codes found</div>
        )}
      </div>
    </div>
  );
}
