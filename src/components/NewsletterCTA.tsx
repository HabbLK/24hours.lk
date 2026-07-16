"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setLoading(false);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="bg-gradient-to-br from-brand-night via-brand-ink to-brand-night py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/20 border border-brand-red/30 rounded-full text-brand-red text-sm font-semibold mb-6">
          <Mail className="w-4 h-4" />
          Stay Updated
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
          Never Miss a New Service
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Get notified when we add new services and guides to help you navigate Sri Lanka's digital landscape.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-8 py-4 bg-brand-red hover:bg-brand-red-dk disabled:bg-gray-600 text-white font-bold rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {subscribed ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed!
                </>
              ) : loading ? (
                "Subscribing..."
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
