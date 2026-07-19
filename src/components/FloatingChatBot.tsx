"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hi! I can help you find services. What do you need?" },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMinimized(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const quickActions = [
    { label: "Renew License", query: "renew driving licence" },
    { label: "Book Doctor", query: "book a doctor" },
    { label: "Bus Tickets", query: "bus tickets" },
    { label: "Find Hotel", query: "find a hotel" },
  ];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Let me open the full assistant for you with better options." },
      ]);
    }, 500);
  }

  function handleQuickAction(query: string) {
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Opening the assistant to find results for you..." },
      ]);
    }, 400);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-red hover:bg-brand-red-dk text-white shadow-2xl shadow-brand-red/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group ${
          open ? "rotate-0" : ""
        }`}
        aria-label="Open chat assistant"
      >
        {open ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-brand-red animate-ping opacity-20" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up"
        >
          {/* Header */}
          <div className="bg-brand-night px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">24hours.lk Assistant</h3>
                <p className="text-xs text-gray-400">Find services instantly</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-gray-100 text-brand-ink rounded-bl-sm"
                      : "bg-brand-red text-white rounded-br-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-brand-red hover:text-white text-gray-700 rounded-full transition-all font-medium"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input + Full assistant link */}
          <div className="border-t border-gray-100 p-3 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your request..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 transition-all"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-brand-red hover:bg-brand-red-dk text-white rounded-full flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <Link
              href="/assistant"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-night hover:bg-brand-ink text-white text-sm font-bold rounded-xl transition-colors"
            >
              Open Full Assistant
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
