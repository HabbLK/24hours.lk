"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout heading="Check your email" description="We've sent you a password reset link">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            If an account exists with <strong className="text-brand-ink">{email}</strong>, we&apos;ve sent a password reset link.
          </p>
          <Link
            href="/login"
            className="inline-block w-full px-6 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-brand-red/25"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout heading="Forgot your password?" description="Enter your email and we'll send you a reset link">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-ink mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-red/25"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send Reset Link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-brand-red hover:text-brand-red-dk">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
