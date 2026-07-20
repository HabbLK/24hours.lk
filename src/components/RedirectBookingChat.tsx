"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight, Loader2 } from "lucide-react";
import { FLOWS, detectIntent, extractEntities, SlotDef } from "@/lib/flowConfigs";
import { buildDeepLink } from "@/lib/deepLinks";
import { matchTown } from "@/lib/matchTown";
import { matchFromList } from "@/lib/matchList";
import { SPECIALIZATIONS, HOSPITALS } from "@/lib/doctorData";

interface Msg { id: string; role: "bot" | "user"; text: string; }
interface Provider { _id: string; slug: string; name: string; externalUrl: string; icon?: string; }

let idc = 1;
const nid = () => `m${idc++}`;
const TOWN_SLOT_KEYS = new Set(["origin", "destination"]);

export default function RedirectBookingChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "bot", text: "What would you like to book? You can describe it naturally — e.g. \"bus tickets to Kandy on Friday\" or \"flight to Chennai\"" },
  ]);
  const [flowKey, setFlowKey] = useState<string | null>(null);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, providers]);

  function say(text: string) { setMessages((m) => [...m, { id: nid(), role: "bot", text }]); }
  function userSay(text: string) { setMessages((m) => [...m, { id: nid(), role: "user", text }]); }

  function currentFlow() { return flowKey ? FLOWS[flowKey] : null; }
  function currentSlotDef(): SlotDef | null {
    const flow = currentFlow();
    if (!flow) return null;
    return flow.slots[slotIndex] || null;
  }

  function nextSlotIndex(slots_: SlotDef[], filled: Record<string, string>, from: number): number {
    for (let i = from; i < slots_.length; i++) {
      const slot = slots_[i];
      if (filled[slot.key]) continue;
      if (slot.showIf && !slot.showIf(filled)) continue;
      return i;
    }
    return -1;
  }

  function resolveIfNeeded(key: string, rawValue: string): { value: string; corrected: boolean } {
    const trimmed = rawValue.trim();
    if (trimmed.toLowerCase() === "any" || !trimmed) return { value: rawValue, corrected: false };
    if (TOWN_SLOT_KEYS.has(key)) {
      const match = matchTown(trimmed);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
    }
    if (key === "specialty") {
      const match = matchFromList(trimmed, SPECIALIZATIONS);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
    }
    if (key === "hospital") {
      const match = matchFromList(trimmed, HOSPITALS);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
    }
    return { value: rawValue, corrected: false };
  }

  function handleInitialMessage(text: string) {
    userSay(text);
    const detected = detectIntent(text);
    if (!detected) {
      say("I couldn't tell what you want to book. Try mentioning flight, bus, train, hotel, taxi, or doctor.");
      return;
    }
    setFlowKey(detected);
    const entities = extractEntities(text);
    const flow = FLOWS[detected];
    const filled: Record<string, string> = {};
    const corrections: string[] = [];

    for (const slot of flow.slots) {
      if (entities[slot.key]) {
        const { value, corrected } = resolveIfNeeded(slot.key, entities[slot.key]!);
        filled[slot.key] = value;
        if (corrected) corrections.push(value);
      }
    }
    setSlots(filled);
    if (corrections.length) say(`Got it — ${corrections.join(", ")}`);

    const firstUnfilled = nextSlotIndex(flow.slots, filled, 0);
    if (firstUnfilled === -1) {
      fetchProviders(detected, filled);
    } else {
      setSlotIndex(firstUnfilled);
      say(flow.slots[firstUnfilled].question);
    }
  }

  function handleSlotAnswer(rawValue: string, displayText?: string) {
    const flow = currentFlow();
    const slot = currentSlotDef();
    if (!flow || !slot) return;
    userSay(displayText ?? rawValue);

    const { value, corrected } = resolveIfNeeded(slot.key, rawValue);
    const updated = { ...slots, [slot.key]: value };
    setSlots(updated);
    if (corrected) say(`Got it — ${value}`);

    const next = nextSlotIndex(flow.slots, updated, slotIndex + 1);
    if (next !== -1) {
      setSlotIndex(next);
      say(flow.slots[next].question);
    } else {
      fetchProviders(flow.flowKey, updated);
    }
  }

  async function fetchProviders(flow: string, finalSlots: Record<string, string>) {
    setLoading(true);
    say("Finding providers for you...");
    const tags = FLOWS[flow].matchTags.join(",");
    const res = await fetch(`/api/chat/providers?tags=${encodeURIComponent(tags)}`);
    const data = await res.json();
    setLoading(false);

    if (!data.services?.length) {
      say("No providers listed for that yet. Try browsing categories instead.");
      return;
    }
    setProviders(data.services);
    say(`Here ${data.services.length === 1 ? "is" : "are"} ${data.services.length} option${data.services.length > 1 ? "s" : ""}:`);
  }

  async function handlePickProvider(provider: Provider) {
    let fallbackReason: string | null = null;
    const link = buildDeepLink(provider.slug, provider.externalUrl, slots, (reason) => { fallbackReason = reason; });

    userSay(provider.name);
    say(`Opening ${provider.name} with your details. Complete the booking on their site.`);

    fetch("/api/booking-intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flowKey, slots, serviceSlug: provider.slug, serviceName: provider.name, redirectUrl: link, deepLinkFallbackReason: fallbackReason }),
    }).catch(() => {});

    window.open(link, "_blank", "noopener,noreferrer");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (inputRef.current) inputRef.current.value = "";
    if (!flowKey) handleInitialMessage(value);
    else handleSlotAnswer(value);
  }

  const slotDef = currentSlotDef();
  const showInput = !providers && !loading;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 flex flex-col overflow-hidden" style={{ height: "min(560px, calc(100vh - 300px))" }}>
      {/* Header */}
      <div className="bg-brand-night px-4 py-3 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
          <span className="text-white text-xs font-bold">24</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-white text-sm leading-tight">Booking Assistant</p>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Flights · Buses · Hotels · Doctors</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-gray-400 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={
              m.role === "bot"
                ? "bg-white text-brand-ink rounded-lg border border-gray-200 px-3.5 py-2 max-w-[78%] text-[13px] leading-relaxed"
                : "bg-brand-night text-white rounded-lg px-3.5 py-2 max-w-[78%] text-[13px] leading-relaxed"
            }>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-brand-red" />
              <span className="text-[13px] text-gray-500">Searching providers</span>
            </div>
          </div>
        )}

        {providers && (
          <div className="space-y-1.5">
            {providers.map((p) => (
              <button
                key={p._id}
                onClick={() => handlePickProvider(p)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg px-3.5 py-3 hover:border-brand-red/30 transition-colors group flex items-center gap-2.5"
              >
                <span className="text-lg shrink-0">{p.icon || "🔗"}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-brand-ink text-[13px] block truncate">{p.name}</span>
                  <span className="text-[11px] text-gray-400">Visit provider</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        )}

        {!providers && !loading && slotDef?.widget === "select" && (
          <div className="flex gap-2">
            {slotDef.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSlotAnswer(opt.value, opt.label)}
                className="flex-1 border border-gray-200 rounded-lg py-2.5 font-medium text-[13px] text-brand-ink hover:border-brand-red/30 hover:text-brand-red transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {showInput && slotDef?.widget !== "select" && (
        <div className="border-t border-gray-100 px-3 py-2.5 bg-white shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type={
                slotDef?.widget === "date" ? "date" :
                slotDef?.widget === "number" ? "number" : "text"
              }
              min={slotDef?.widget === "number" ? slotDef.min : undefined}
              max={slotDef?.widget === "number" ? slotDef.max : undefined}
              placeholder={!flowKey ? "e.g. bus tickets to Kandy" : "Type your answer..."}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-brand-red/30 transition-colors placeholder:text-gray-400"
            />
            <button type="submit" className="bg-brand-red hover:bg-brand-red-dk text-white px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-1.5 transition-colors shrink-0">
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
