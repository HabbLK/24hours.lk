"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight, Sparkles, BookOpen, ShieldCheck } from "lucide-react";

const perks = [
  { icon: Sparkles, text: "New services, first" },
  { icon: BookOpen, text: "Fresh how-to guides" },
  { icon: ShieldCheck, text: "No spam, ever" },
];

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
    <section className="bg-gradient-to-br from-brand-night via-[#1a0a0a] to-brand-night py-20 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-8 items-center">
        {/* Left: content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/20 border border-brand-red/30 rounded-full text-brand-red text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" />
            Stay Updated
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
            Never Miss a New Service
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
            Get notified when we add new services and guides to help you navigate Sri Lanka.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
            {perks.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-brand-gold" />
                {text}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-4 animate-fade-in">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto lg:mx-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-red/30 via-brand-gold/30 to-brand-red/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-5 pr-16 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-xl shadow-black/20 focus:outline-none focus:ring-2 focus:ring-brand-red border-0"
                />
                <button
                  type="submit"
                  disabled={loading || subscribed}
                  aria-label={subscribed ? "Subscribed" : "Subscribe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg bg-brand-red hover:bg-brand-red-dk disabled:bg-gray-600 text-white transition-all hover:shadow-lg hover:shadow-brand-red/30 disabled:cursor-not-allowed"
                >
                  {subscribed ? (
                    <Check className="w-5 h-5" />
                  ) : loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Right: illustration */}
        <div className="relative hidden lg:block h-[380px] animate-fade-in">
          <img
            src="/illustrations/newsletter-illustration.svg"
            alt="Person receiving a notification about new services"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Floating subscriber count card */}
          <div className="absolute left-0 bottom-4 bg-white rounded-2xl shadow-xl shadow-black/20 px-4 py-3 flex items-center gap-3 animate-fade-in-up">
            <div className="w-9 h-9 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-brand-red" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-ink leading-none">12,000+</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Subscribers</p>
            </div>
          </div>

          {/* Floating no-spam badge */}
          <div className="absolute right-0 top-2 bg-white rounded-full shadow-lg shadow-black/20 px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold text-brand-ink animate-fade-in-down delay-100">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            Spam-free
          </div>
        </div>
      </div>
    </section>
  );
}
