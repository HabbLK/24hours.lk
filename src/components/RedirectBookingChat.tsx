"use client";

import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import { FLOWS, detectIntent, extractEntities, SlotDef } from "@/lib/flowConfigs";
import { buildDeepLink } from "@/lib/deepLinks";
import { matchTown } from "@/lib/matchTown";
import { matchFromList } from "@/lib/matchList";
import { SPECIALIZATIONS, HOSPITALS } from "@/lib/doctorData";

interface Msg { id: string; role: "bot" | "user"; text: string; }
interface Provider { _id: string; slug: string; name: string; externalUrl: string; icon?: string; }

let idc = 1;
const nid = () => `m${idc++}`;

// Slot keys that represent a place name and should be run through
// town fuzzy-matching.
const TOWN_SLOT_KEYS = new Set(["origin", "destination"]);

export default function RedirectBookingChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "bot", text: "What would you like to book? e.g. \"book a flight to Chennai\"" },
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, providers]);

  function say(text: string) {
    setMessages((m) => [...m, { id: nid(), role: "bot", text }]);
  }
  function userSay(text: string) {
    setMessages((m) => [...m, { id: nid(), role: "user", text }]);
  }

  function currentFlow() {
    return flowKey ? FLOWS[flowKey] : null;
  }
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

  // Resolves a raw slot value against the right known list depending on
  // the slot key — towns for origin/destination, specialization list for
  // "specialty", hospital list for "hospital". "any"/"" pass through
  // untouched (user explicitly didn't want to narrow that field).
  function resolveIfNeeded(key: string, rawValue: string): { value: string; corrected: boolean } {
    const trimmed = rawValue.trim();
    if (trimmed.toLowerCase() === "any" || !trimmed) return { value: rawValue, corrected: false };

    if (TOWN_SLOT_KEYS.has(key)) {
      const match = matchTown(trimmed);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
      return { value: rawValue, corrected: false };
    }

    if (key === "specialty") {
      const match = matchFromList(trimmed, SPECIALIZATIONS);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
      return { value: rawValue, corrected: false };
    }

    if (key === "hospital") {
      const match = matchFromList(trimmed, HOSPITALS);
      if (match) return { value: match.matched, corrected: match.matched.toLowerCase() !== trimmed.toLowerCase() };
      return { value: rawValue, corrected: false };
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

    if (corrections.length) {
      say(`Got it — ${corrections.join(", ")}`);
    }

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

    if (corrected) {
      say(`Got it — ${value}`);
    }

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
    say("Let me find real providers for that...");
    const tags = FLOWS[flow].matchTags.join(",");
    const res = await fetch(`/api/chat/providers?tags=${encodeURIComponent(tags)}`);
    const data = await res.json();
    setLoading(false);

    if (!data.services?.length) {
      say("I don't have a provider listed for that yet. Try browsing categories instead.");
      return;
    }
    setProviders(data.services);
    say(`Here are ${data.services.length} option${data.services.length > 1 ? "s" : ""} — pick one to continue:`);
  }

  async function handlePickProvider(provider: Provider) {
    let fallbackReason: string | null = null;
    const link = buildDeepLink(provider.slug, provider.externalUrl, slots, (reason) => {
      fallbackReason = reason;
    });

    userSay(`Continue with ${provider.name}`);
    say(`Opening ${provider.name} with your details. Complete the booking there.`);

    fetch("/api/booking-intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flowKey,
        slots,
        serviceSlug: provider.slug,
        serviceName: provider.name,
        redirectUrl: link,
        deepLinkFallbackReason: fallbackReason,
      }),
    }).catch(() => {});

    window.open(link, "_blank", "noopener,noreferrer");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (inputRef.current) inputRef.current.value = "";

    if (!flowKey) {
      handleInitialMessage(value);
    } else {
      handleSlotAnswer(value);
    }
  }

  const slotDef = currentSlotDef();
  const showInput = !providers && !loading;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      <div className="bg-brand-night text-white px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">24hours.lk Assistant</p>
          <p className="text-xs text-gray-300 leading-tight">Book flights, buses, hotels & more</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "bot" ? "flex" : "flex justify-end"}>
            <div className={
              m.role === "bot"
                ? "bg-brand-mist text-brand-ink rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]"
                : "bg-brand-red text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]"
            }>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {providers && (
          <div className="space-y-2">
            {providers.map((p) => (
              <button
                key={p._id}
                onClick={() => handlePickProvider(p)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-red/50 hover:shadow-sm transition-all flex items-center gap-3"
              >
                <span className="text-2xl">{p.icon}</span>
                <span className="font-bold text-brand-ink">{p.name}</span>
              </button>
            ))}
          </div>
        )}

        {!providers && !loading && slotDef?.widget === "select" && (
          <div className="flex gap-3">
            {slotDef.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSlotAnswer(opt.value, opt.label)}
                className="flex-1 bg-brand-mist rounded-xl py-3 font-medium hover:bg-gray-200 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showInput && slotDef?.widget !== "select" && (
        <form onSubmit={handleSubmit} className="p-4 flex gap-2 border-t border-gray-100">
          <input
            ref={inputRef}
            type={
              slotDef?.widget === "date" ? "date" :
              slotDef?.widget === "number" ? "number" : "text"
            }
            min={slotDef?.widget === "number" ? slotDef.min : undefined}
            max={slotDef?.widget === "number" ? slotDef.max : undefined}
            placeholder={!flowKey ? "e.g. book a flight to Chennai" : ""}
            className="flex-1 bg-brand-mist rounded-full px-4 py-2 focus:outline-none"
          />
          <button type="submit" className="bg-brand-red text-white px-6 py-2 rounded-full font-bold">Send</button>
        </form>
      )}
    </div>
  );
}