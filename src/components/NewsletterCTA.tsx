"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe");
      }
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-brand-night py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-red/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <p className="text-brand-red text-xs font-bold uppercase tracking-[0.15em] mb-4">
          Stay in the loop
        </p>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
          Never miss a new service
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
          Get notified when we add new services and guides to help you get things done.
        </p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
          <div className="flex gap-2">
            <input
              suppressHydrationWarning
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-5 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {subscribed ? <Check className="w-4 h-4" /> : loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-600">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
