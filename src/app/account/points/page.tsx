"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Wallet, Loader2, ArrowDown, ArrowUp, Ticket } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  booking_confirmed: "Booking Confirmed",
  referral: "Referral Bonus",
  promo_conversion: "Promo Code Generated",
  expiry: "Points Expired",
  admin_adjustment: "Admin Adjustment",
};

export default function PointsWalletPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<{ balance: number; transactions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/points")
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleConvert = async () => {
    setConverting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/points/convert", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        setSuccess(`Promo code ${result.code} created! Expires ${new Date(result.expiresAt).toLocaleDateString()}`);
        fetch("/api/user/points").then((r) => r.json()).then(setData);
      } else {
        setError(result.error || "Failed to convert");
      }
    } catch {
      setError("Failed to convert points");
    } finally {
      setConverting(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mist px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-ink mb-4">Sign in to view your points</h1>
          <Link href="/login" className="inline-block px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mist">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-mist">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/account" className="text-sm text-brand-red hover:text-brand-red-dk font-medium mb-4 inline-block">
          &larr; Back to Account
        </Link>
        <h1 className="text-3xl font-heading font-bold text-brand-ink mb-8">Points Wallet</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{success}</div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-4xl font-bold text-brand-ink">{data?.balance || 0}</p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={converting || (data?.balance || 0) < 500}
            className="w-full py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
            Generate Promo Code (500 points)
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            {(data?.balance || 0) < 500
              ? `You need ${500 - (data?.balance || 0)} more points`
              : "Convert 500 points into a promo code"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-brand-ink mb-4">Points History</h2>
          {data?.transactions && data.transactions.length > 0 ? (
            <div className="space-y-3">
              {data.transactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.pointsAmount > 0 ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {tx.pointsAmount > 0 ? (
                        <ArrowDown className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-ink">{REASON_LABELS[tx.reason] || tx.reason}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.pointsAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.pointsAmount > 0 ? "+" : ""}{tx.pointsAmount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No points yet. Book services to earn points!</p>
          )}
        </div>
      </div>
    </div>
  );
}
