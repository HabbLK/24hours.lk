"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Ticket, Loader2, Copy, Check, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import AccountAuthGate from "@/components/AccountAuthGate";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle },
  redeemed: { label: "Redeemed", color: "bg-blue-100 text-blue-700", icon: Check },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-500", icon: XCircle },
};

export default function PromoCodesPage() {
  const { data: session, status } = useSession();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/promo-codes")
        .then((res) => res.json())
        .then((data) => {
          setCodes(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (status === "unauthenticated") {
    return <AccountAuthGate message="Sign in to view your promo codes" />;
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
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-brand-red hover:text-brand-red-dk font-medium mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Account
        </Link>
        <h1 className="text-3xl font-heading font-bold text-brand-ink mb-8 animate-fade-in-up">Promo Codes</h1>

        {codes.length > 0 ? (
          <div className="space-y-4">
            {codes.map((promo, idx) => {
              const config = STATUS_CONFIG[promo.status] || STATUS_CONFIG.active;
              const isExpired = new Date(promo.expiresAt) < new Date();
              return (
                <div
                  key={promo._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-brand-red/20 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-brand-red" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        {isExpired ? "Expired" : config.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Expires {new Date(promo.expiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-lg font-mono font-bold text-brand-ink tracking-wider">
                      {promo.code}
                    </code>
                    {promo.status === "active" && !isExpired && (
                      <button
                        onClick={() => copyCode(promo.code)}
                        className="px-4 py-3 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                      >
                        {copied === promo.code ? (
                          <><Check className="w-4 h-4" /> Copied</>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copy</>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-2">Value: {promo.value} points</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in-up">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-ink mb-2">No promo codes yet</h2>
            <p className="text-sm text-gray-600 mb-6">
              Earn points by booking services through 24hours.lk, then convert them into promo codes.
            </p>
            <Link
              href="/account/points"
              className="inline-block px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors"
            >
              View Points Wallet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
