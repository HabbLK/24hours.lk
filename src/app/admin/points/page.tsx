"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  booking_confirmed: "Booking Confirmed",
  referral: "Referral Bonus",
  promo_conversion: "Promo Code Generated",
  expiry: "Points Expired",
  admin_adjustment: "Admin Adjustment",
};

export default function AdminPointsPage() {
  const { session, status } = useAdminSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/points")
        .then((res) => res.json())
        .then((data) => {
          setTransactions(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const filtered = transactions.filter(
    (t) =>
      t.userId?.toLowerCase().includes(search.toLowerCase()) ||
      REASON_LABELS[t.reason]?.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-brand-ink">Points Ledger</h1>
        <p className="text-sm text-gray-600 mt-1">All point transactions across the platform</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user ID or reason..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm text-brand-ink font-mono">{tx.userId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{REASON_LABELS[tx.reason] || tx.reason}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${tx.pointsAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.pointsAmount > 0 ? "+" : ""}{tx.pointsAmount}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {tx.expiryDate ? new Date(tx.expiryDate).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No transactions found</div>
        )}
      </div>
    </div>
  );
}
