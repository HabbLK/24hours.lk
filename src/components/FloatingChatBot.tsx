"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ArrowUpRight, Loader2, ExternalLink } from "lucide-react";
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
    if (intent) {
      const flowMap: Record<string, string> = { flight: "flight,airline", bus: "bus", train: "train,railway", hotel: "hotel,accommodation", taxi: "taxi,ride", doctor: "doctor,channeling" };
      const tags = flowMap[intent];
      if (tags) {
        setMessages((prev) => [...prev, { role: "bot", text: `Looking up ${intent} services...` }]);
        searchProviders(tags);
        return;
      }
    }
    setMessages((prev) => [...prev, { role: "bot", text: "I can help with flights, buses, trains, hotels, taxis, and doctors. Try a quick topic below, or open the full assistant for detailed bookings." }]);
  }

  function handleQuickAction(label: string, tags: string) {
    setMessages((prev) => [...prev, { role: "user", text: label }]);
    setMessages((prev) => [...prev, { role: "bot", text: `Searching for ${label.toLowerCase()}...` }]);
    searchProviders(tags);
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 group">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-brand-red hover:bg-brand-red-dk text-white shadow-xl shadow-brand-red/20 hover:shadow-2xl hover:shadow-brand-red/30 transition-all duration-200 active:scale-95 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          {open ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
        {/* Tooltip */}
        {!open && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-brand-night text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Chat with us
            <div className="absolute top-full right-5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-brand-night" />
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-200/60 flex flex-col overflow-hidden animate-fade-in-up"
          style={{ maxHeight: "min(520px, calc(100vh - 8rem))" }}
        >
          {/* Header — compact, branded */}
          <div className="bg-brand-night px-5 py-3.5 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center shrink-0">
              <Bot className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-white text-sm leading-tight">24hours.lk</h3>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Service assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[160px]" style={{ maxHeight: "280px", background: "linear-gradient(180deg, #FAFAF8 0%, #F5F3EE 100%)" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] px-3.5 py-2 text-[13px] leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-white text-brand-ink rounded-xl rounded-tl-sm border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    : "bg-brand-night text-white rounded-xl rounded-tr-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-red" />
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
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3.5 py-3 hover:border-brand-red/25 hover:shadow-[0_2px_8px_rgba(192,24,28,0.06)] transition-all group"
                  >
                    <span className="text-lg shrink-0">{p.icon || "🔗"}</span>
                    <span className="font-semibold text-brand-ink text-[13px] truncate flex-1">{p.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-red transition-colors shrink-0" />
                  </a>
                ))}
                <Link
                  href="/assistant"
                  className="block text-center text-[11px] font-semibold text-brand-red hover:text-brand-red-dk transition-colors pt-1 pb-0.5"
                >
                  Open full assistant →
                </Link>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3.5 py-2.5 flex gap-1.5 overflow-x-auto hide-scrollbar bg-white border-t border-gray-100">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label, action.tags)}
                disabled={loading}
                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-red/30 hover:text-brand-red hover:bg-brand-red/5 transition-all font-medium shrink-0 disabled:opacity-40"
              >
                <span className="text-xs">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3.5 py-3 bg-white shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 mb-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a service..."
                disabled={loading}
                className="flex-1 px-3.5 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red/30 focus:ring-1 focus:ring-brand-red/10 transition-all placeholder:text-gray-400 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 disabled:hover:bg-brand-red"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <Link
              href="/assistant"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-brand-night hover:bg-brand-ink text-white text-[12px] font-bold rounded-lg transition-colors"
            >
              Open Full Assistant
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
