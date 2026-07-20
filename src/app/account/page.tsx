"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, Mail, Calendar, Edit, Loader2, Wallet, Ticket, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import AccountAuthGate from "@/components/AccountAuthGate";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          setName(data.name || "");
          setPhone(data.phone || "");
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile. Please try again.");
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "unauthenticated") {
    return <AccountAuthGate message="Sign in to view your account" />;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setEditing(false);
        setMessage("Profile updated successfully");
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mist">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-brand-mist">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold text-brand-ink mb-8 animate-fade-in-up">My Account</h1>

        {message && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 animate-fade-in">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-ink">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-sm text-brand-red hover:text-brand-red-dk font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dk text-white flex items-center justify-center text-xl font-bold ring-4 ring-brand-red/10 shrink-0">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  (profile?.name || "U")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                <p className="text-sm font-medium text-brand-ink">{memberSince}</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(profile?.name || "");
                      setPhone(profile?.phone || "");
                    }}
                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-brand-ink">{profile?.name || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-brand-ink">{profile?.email || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Joined {memberSince}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/account/points"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-brand-red/20 hover:-translate-y-0.5 transition-all animate-fade-in-up delay-100"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-brand-red/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5 text-brand-red" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-brand-ink mb-1">Points Wallet</h3>
            <p className="text-sm text-gray-600">View your balance and history</p>
          </Link>
          <Link
            href="/account/promo-codes"
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-brand-red/20 hover:-translate-y-0.5 transition-all animate-fade-in-up delay-200"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5 text-brand-gold" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-brand-ink mb-1">Promo Codes</h3>
            <p className="text-sm text-gray-600">Manage your promo codes</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
