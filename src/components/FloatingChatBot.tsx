"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import RedirectBookingChat from "@/components/RedirectBookingChat";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-brand-red hover:bg-brand-red-dk text-white shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up"
          style={{ height: "min(560px, calc(100vh - 8rem))" }}
        >
          <RedirectBookingChat variant="compact" onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
