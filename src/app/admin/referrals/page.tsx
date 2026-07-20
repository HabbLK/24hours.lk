"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Clock, Search } from "lucide-react";

export default function AdminReferralsPage() {
  const { session, status } = useAdminSession();
  const router = useRouter();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/referrals")
        .then((res) => res.json())
        .then((data) => {
          setReferrals(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleConfirm = async (id: string) => {
    setConfirming(id);
    try {
      const res = await fetch(`/api/admin/referrals/${id}/confirm`, { method: "PUT" });
      if (res.ok) {
        setReferrals((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, confirmed: true, confirmedAt: new Date().toISOString() }
              : r
          )
        );
      }
    } finally {
      setConfirming(null);
    }
  };

  const filtered = referrals.filter(
    (r) =>
      r.serviceSlug?.toLowerCase().includes(search.toLowerCase()) ||
      r.clickToken?.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-brand-ink">Referral Tracking</h1>
        <p className="text-sm text-gray-600 mt-1">View and confirm user referrals to award points</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service or token..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ref) => (
              <tr key={ref._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm text-brand-ink">{ref.userId || "Anonymous"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ref.serviceSlug}</td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(ref.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {ref.confirmed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" /> Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!ref.confirmed && (
                    <button
                      onClick={() => handleConfirm(ref._id)}
                      disabled={confirming === ref._id}
                      className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                    >
                      {confirming === ref._id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Confirm & Award Points"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No referrals found</div>
        )}
      </div>
    </div>
  );
}
