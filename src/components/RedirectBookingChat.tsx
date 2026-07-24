"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, ArrowRight, Loader2 } from "lucide-react";
import { FLOWS, detectIntent, extractEntities, validateSlotInput, SlotDef } from "@/lib/flowConfigs";
import { buildDeepLink } from "@/lib/deepLinks";
import { matchTown } from "@/lib/matchTown";
import { matchFromList } from "@/lib/matchList";
import { SPECIALIZATIONS, HOSPITALS } from "@/lib/doctorData";

interface Msg { id: string; role: "bot" | "user"; text: string; }
interface Provider { _id: string; slug: string; name: string; externalUrl: string; icon?: string; }
interface PendingIntent { _id: string; serviceName: string; flowKey: string; createdAt: string; slots?: Record<string, string>; }

let idc = 1;
const nid = () => `m${idc++}-${Math.random().toString(36).slice(2, 7)}`;

const TOWN_SLOT_KEYS = new Set(["origin", "destination"]);
const STORAGE_KEY = "assistant_chat_state_v1";

export default function RedirectBookingChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "bot", text: "What would you like to book? You can describe it naturally — e.g. \"bus tickets to Kandy on Friday\" or \"flight to Chennai\"" },
  ]);
  const [flowKey, setFlowKey] = useState<string | null>(null);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [loading, setLoading] = useState(false);
  // Populated when detectIntent can't tell which flow the user meant
  // (e.g. "appointments" -> DMT vs Doctor). Cleared once they pick one.
  const [ambiguousOptions, setAmbiguousOptions] = useState<string[] | null>(null);
  // Populated on mount if the user has an old unconfirmed booking click —
  // prompts a "did you actually book this?" Yes/No (Tier 2 self-confirm).
  const [pendingConfirm, setPendingConfirm] = useState<PendingIntent | null>(null);
  // True once a booking has been confirmed/declined and the conversation
  // has reached a natural end — shows a "Start New Chat" button instead
  // of the text input.
  const [chatEnded, setChatEnded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, providers]);

  // Restore the whole conversation (messages + in-progress flow state)
  // from localStorage on mount, so a page refresh OR navigating to
  // another page and back doesn't wipe an unanswered "did you book
  // this?" prompt or mid-flow progress.
  //
  // IMPORTANT: `hydrated` is state, not a ref. If it were a ref set
  // synchronously, the persist effect below could fire in the same
  // commit using the OLD (still-default) closure values — before the
  // setMessages/setFlowKey/etc. calls above it actually take effect —
  // silently overwriting the just-restored data with the defaults.
  // Using state means React batches setHydrated(true) together with
  // the restore calls, so the persist effect only ever sees the
  // restored values, never stale defaults.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.messages?.length) setMessages(saved.messages);
        if (saved.flowKey !== undefined) setFlowKey(saved.flowKey);
        if (saved.slotIndex !== undefined) setSlotIndex(saved.slotIndex);
        if (saved.slots) setSlots(saved.slots);
        if (saved.providers !== undefined) setProviders(saved.providers);
        if (saved.ambiguousOptions !== undefined) setAmbiguousOptions(saved.ambiguousOptions);
        if (saved.chatEnded !== undefined) setChatEnded(saved.chatEnded);
        if (saved.pendingConfirm !== undefined) setPendingConfirm(saved.pendingConfirm);
      }
    } catch {
      // corrupted/old-format storage — ignore and start fresh
    }
    setHydrated(true);
  }, []);

  // Persist on every relevant change. Guarded on `hydrated` so this
  // never runs before restoration above has actually applied — see the
  // comment on the hydration effect for why this must be state, not a ref.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, flowKey, slotIndex, slots, providers, ambiguousOptions, chatEnded, pendingConfirm })
      );
    } catch {
      // storage full/unavailable — non-critical, just skip persisting
    }
  }, [hydrated, messages, flowKey, slotIndex, slots, providers, ambiguousOptions, chatEnded, pendingConfirm]);

  // Checks for an old unconfirmed click. Runs on mount, on a 1-minute
  // fallback interval, AND whenever the browser tab regains focus — the
  // focus trigger is what makes the prompt appear right away when the
  // user comes back from the provider's site, instead of waiting for
  // the next poll tick.
  function checkPending() {
    if (pendingConfirm) return; // don't stack a second prompt on top
    fetch("/api/booking-intents/pending")
      .then((r) => r.json())
      .then((data) => {
        if (data.pending?.length) {
          const p: PendingIntent = data.pending[0];
          setPendingConfirm(p);
          say(`Quick check — did you complete your ${FLOWS[p.flowKey]?.label ?? p.flowKey} booking with ${p.serviceName}?`);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 60 * 1000); // fallback poll
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingConfirm]);

  useEffect(() => {
    function onFocus() { checkPending(); }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingConfirm]);

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

  // Shared by both the direct-match path and the post-disambiguation path.
  // `originalText` is only present on a direct match, so entity extraction
  // (e.g. "to Chennai") only runs then — after picking from a disambiguation
  // button there's no free text to extract from.
  function startFlow(key: string, originalText?: string) {
    setFlowKey(key);
    const flow = FLOWS[key];
    const entities = originalText ? extractEntities(originalText) : {};
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
      fetchProviders(key, filled);
    } else {
      setSlotIndex(firstUnfilled);
      say(flow.slots[firstUnfilled].question);
    }
  }

  function handleInitialMessage(text: string) {
    userSay(text);
    const detected = detectIntent(text);
    if (!detected) {
      say("I couldn't tell what you want to book. Try mentioning flight, bus, train, hotel, taxi, doctor, shopping, jobs, or NIC.");
      return;
    }
    if (detected.type === "ambiguous") {
      setAmbiguousOptions(detected.options);
      say("Did you mean:");
      return;
    }
    startFlow(detected.flowKey, text);
  }

  function handleAmbiguousPick(key: string) {
    userSay(FLOWS[key].label);
    setAmbiguousOptions(null);
    startFlow(key);
  }

  function handleSlotAnswer(rawValue: string, displayText?: string) {
    const flow = currentFlow();
    const slot = currentSlotDef();
    if (!flow || !slot) return;

    // Validate before echoing the answer or advancing — invalid input just
    // gets an inline error and re-asks the same question.
    if (slot.widget === "number" || slot.widget === "date") {
      const result = validateSlotInput(slot, rawValue, slots);
      if (!result.valid) {
        say(result.error!);
        return;
      }
    }

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

    const res = await fetch("/api/booking-intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flowKey, slots, serviceSlug: provider.slug, serviceName: provider.name, redirectUrl: link, deepLinkFallbackReason: fallbackReason }),
    }).catch(() => null);

    const data = res ? await res.json().catch(() => null) : null;
    const intentId: string | undefined = data?.id;

    window.open(link, "_blank", "noopener,noreferrer");

    // Rough "away duration" proxy — records how long until this tab
    // becomes visible again. Also doubles as the trigger for the confirm
    // prompt: as soon as the user comes back, ask directly about THIS
    // booking rather than waiting for the background poll to notice it
    // later.
    //
    // Uses the Page Visibility API rather than the window "focus" event —
    // "focus" is unreliable for detecting a return to a tab that's still
    // in the same browser window (exactly this case: new tab opened,
    // user switches back), so visibilitychange is the correct signal here.
    if (intentId) {
      const leftAt = Date.now();
      const onVisibilityChange = () => {
        if (document.visibilityState !== "visible") return;

        const awayDurationMs = Date.now() - leftAt;
        fetch(`/api/booking-intents/${intentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ awayDurationMs }),
        }).catch(() => {});

        // Only prompt if nothing else is already asking for input right
        // now (e.g. don't interrupt an in-progress question or another
        // pending confirm).
        setPendingConfirm((current) => {
          if (current) return current;
          say(`Welcome back! Did you complete your ${FLOWS[flowKey!]?.label ?? flowKey} booking with ${provider.name}?`);
          return { _id: intentId, serviceName: provider.name, flowKey: flowKey!, createdAt: new Date().toISOString() };
        });

        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
    }
  }

  function handleConfirmBooking(confirmedYes: boolean) {
    if (!pendingConfirm) return;
    userSay(confirmedYes ? "Yes, I booked it" : "Not yet / No");

    const savedFlowKey = pendingConfirm.flowKey;
    const savedSlots = pendingConfirm.slots || {};

    fetch(`/api/booking-intents/${pendingConfirm._id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: confirmedYes }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          // Surface the real reason instead of pretending it worked —
          // e.g. 401 not authenticated, 404 not found, 409 already resolved.
          console.error("Confirm booking failed:", r.status, data);
          say(`Something went wrong confirming that (${data.error || r.status}). Please try again.`);
          setPendingConfirm(null);
          return;
        }

        setPendingConfirm(null);

        if (data.status === "confirmed") {
          say(
            data.pointsAwarded
              ? `Thanks for confirming! You earned ${data.pointsAwarded} points 🎉`
              : "Thanks for confirming — marked as booked!"
          );
          setChatEnded(true);
        } else {
          say("No problem — here are the same options again if you'd like to try:");
          setFlowKey(savedFlowKey);
          setSlots(savedSlots);
          fetchProviders(savedFlowKey, savedSlots);
        }
      })
      .catch((err) => {
        console.error("Confirm booking request failed:", err);
        say("Something went wrong confirming that. Please try again.");
        setPendingConfirm(null);
      });
  }

  // Resets the whole conversation back to the initial greeting — used by
  // the "Start New Chat" button.
  function resetChat() {
    setMessages([
      { id: nid(), role: "bot", text: "What would you like to book? You can describe it naturally — e.g. \"bus tickets to Kandy on Friday\" or \"flight to Chennai\"" },
    ]);
    setFlowKey(null);
    setSlotIndex(0);
    setSlots({});
    setProviders(null);
    setAmbiguousOptions(null);
    setPendingConfirm(null);
    setChatEnded(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    if (inputRef.current) inputRef.current.value = "";

    if (ambiguousOptions) return; // waiting on a button pick, ignore typed input
    if (pendingConfirm) return;   // waiting on the confirm Yes/No, ignore typed input
    if (!flowKey) {
      handleInitialMessage(value);
    } else {
      handleSlotAnswer(value);
    }
  }

  const slotDef = currentSlotDef();
  const showInput = !providers && !loading && !ambiguousOptions && !pendingConfirm && !chatEnded;

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

        {ambiguousOptions && (
          <div className="flex flex-wrap gap-2">
            {ambiguousOptions.map((key) => (
              <button
                key={key}
                onClick={() => handleAmbiguousPick(key)}
                className="bg-brand-mist rounded-xl px-4 py-2 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                {FLOWS[key].label}
              </button>
            ))}
          </div>
        )}

        {pendingConfirm && (
          <div className="flex gap-2">
            <button
              onClick={() => handleConfirmBooking(true)}
              className="flex-1 bg-brand-red text-white rounded-lg py-2.5 font-medium text-[13px] hover:bg-brand-red-dk transition-colors"
            >
              Yes, I booked it
            </button>
            <button
              onClick={() => handleConfirmBooking(false)}
              className="flex-1 border border-gray-200 rounded-lg py-2.5 font-medium text-[13px] text-brand-ink hover:border-brand-red/30 transition-colors"
            >
              Not yet
            </button>
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
            <button
              onClick={resetChat}
              className="w-full text-center text-[12px] text-gray-400 hover:text-brand-red font-medium py-1.5 transition-colors"
            >
              Start New Chat
            </button>
          </div>
        )}

        {chatEnded && (
          <div className="flex justify-center pt-1">
            <button
              onClick={resetChat}
              className="bg-brand-red text-white rounded-lg px-4 py-2.5 font-bold text-[13px] hover:bg-brand-red-dk transition-colors"
            >
              Start New Chat
            </button>
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