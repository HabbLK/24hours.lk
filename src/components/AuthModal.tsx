"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { X, Loader2, Mail, Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  callbackUrl?: string;
}

export default function AuthModal({
  open,
  onClose,
  message = "Sign up to earn points on this booking",
  callbackUrl = "/",
}: AuthModalProps) {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || session?.user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to create account");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (mode === "signup") {
          setError("Account created but sign-in failed. Please try logging in.");
        } else {
          setError("Invalid email or password");
        }
      } else {
        onClose();
        window.location.replace(callbackUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-black/20 p-8 relative animate-fade-in-up border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-red/10 rounded-2xl mb-3">
            <Lock className="w-6 h-6 text-brand-red" />
          </div>
          <h2 className="text-xl font-heading font-bold text-brand-ink">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-brand-red font-medium">{message}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                placeholder="Full name"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              placeholder="Password (min 8 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-red/25"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="font-medium text-brand-red hover:text-brand-red-dk">
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="font-medium text-brand-red hover:text-brand-red-dk">
                Sign up
              </button>
            </>
          )}
        </div>

        <div className="mt-3 text-center">
          <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-brand-red">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
