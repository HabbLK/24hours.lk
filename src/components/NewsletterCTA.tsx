"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setLoading(false);
    setEmail("");

    setTimeout(() => setSubscribed(false), 3000);
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/20 border border-brand-red/30 rounded-full text-brand-red text-sm font-semibold mb-6">
          <Mail className="w-4 h-4" />
          Stay Updated
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
          Never Miss a New Service
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto">
          Get notified when we add new services and guides to help you navigate Sri Lanka.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red border-0"
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-6 py-4 bg-brand-red hover:bg-brand-red-dk disabled:bg-gray-600 text-white font-bold rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-all hover:shadow-lg hover:shadow-brand-red/30 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {subscribed ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed!
                </>
              ) : loading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
