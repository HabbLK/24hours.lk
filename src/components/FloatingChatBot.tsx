"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { detectIntent } from "@/lib/flowConfigs";

interface Provider {
  _id: string;
  slug: string;
  name: string;
  externalUrl: string;
  icon?: string;
}

const QUICK_ACTIONS = [
  { label: "Renew License", icon: "🪪", tags: "license,driving" },
  { label: "Book Doctor", icon: "🩺", tags: "doctor,channeling" },
  { label: "Bus Tickets", icon: "🚌", tags: "bus" },
  { label: "Find Hotel", icon: "🏨", tags: "hotel,accommodation" },
];

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Need help finding a service? Ask me anything or pick a topic below." },
  ]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, providers]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function searchProviders(tags: string) {
    setLoading(true);
    setProviders([]);
    try {
      const res = await fetch(`/api/chat/providers?tags=${encodeURIComponent(tags)}`);
      const data = await res.json();
      setLoading(false);
      if (data.services?.length) {
        setProviders(data.services);
        setMessages((prev) => [...prev, { role: "bot", text: `Found ${data.services.length} option${data.services.length > 1 ? "s" : ""}. Tap to visit:` }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "No providers found for that yet. Try the full assistant for more options." }]);
      }
    } catch {
      setLoading(false);
      setMessages((prev) => [...prev, { role: "bot", text: "Something went wrong. Please try again." }]);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    const intent = detectIntent(text);
    if (intent?.type === "flow") {
      const flowMap: Record<string, string> = { flight: "flight,airline", bus: "bus", train: "train,railway", hotel: "hotel,accommodation", taxi: "taxi,ride", doctor: "doctor,channeling" };
      const tags = flowMap[intent.flowKey];
      if (tags) {
        setMessages((prev) => [...prev, { role: "bot", text: `Looking up ${intent.flowKey} services...` }]);
        searchProviders(tags);
        return;
      }
    }
    setMessages((prev) => [...prev, { role: "bot", text: "I can help with flights, buses, trains, hotels, taxis, and doctors. Try a quick topic below, or open the full assistant." }]);
  }

  function handleQuickAction(label: string, tags: string) {
    setMessages((prev) => [...prev, { role: "user", text: label }]);
    setMessages((prev) => [...prev, { role: "bot", text: `Searching for ${label.toLowerCase()}...` }]);
    searchProviders(tags);
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-brand-red hover:bg-brand-red-dk text-white shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up"
          style={{ maxHeight: "min(520px, calc(100vh - 8rem))" }}
        >
          {/* Header */}
          <div className="bg-brand-night px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
                <span className="text-white text-xs font-bold">24</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-sm leading-tight">Assistant</h3>
                <p className="text-[10px] text-gray-500">Service helper</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 min-h-[160px] bg-gray-50" style={{ maxHeight: "280px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] px-3 py-2 text-[13px] leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-white text-brand-ink rounded-lg border border-gray-200"
                    : "bg-brand-night text-white rounded-lg"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-brand-red" />
                  <span className="text-[13px] text-gray-500">Searching</span>
                </div>
              </div>
            )}

            {providers.length > 0 && (
              <div className="space-y-1.5">
                {providers.map((p) => (
                  <a
                    key={p._id}
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-brand-red/30 transition-colors group"
                  >
                    <span className="text-base shrink-0">{p.icon || "🔗"}</span>
                    <span className="font-semibold text-brand-ink text-[13px] truncate flex-1">{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-brand-red transition-colors shrink-0" />
                  </a>
                ))}
                <Link href="/assistant" className="block text-center text-[11px] font-semibold text-brand-red hover:text-brand-red-dk transition-colors pt-1">
                  Open full assistant →
                </Link>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto hide-scrollbar bg-white border-t border-gray-100">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label, action.tags)}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-red/30 hover:text-brand-red transition-all font-medium shrink-0 disabled:opacity-40"
              >
                <span className="text-xs">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-2.5 bg-white shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a service..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red/30 transition-colors placeholder:text-gray-400 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg flex items-center justify-center transition-colors shrink-0 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <Link href="/assistant" className="flex items-center justify-center gap-1.5 w-full py-2 bg-brand-night hover:bg-brand-ink text-white text-[12px] font-bold rounded-lg transition-colors">
              Open Full Assistant →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
