"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { openServicePopup } from "@/lib/openServicePopup";

export interface ServiceEmbedTarget {
  url: string;
  name: string;
  slug?: string;
}

interface ServiceEmbedModalProps {
  target: ServiceEmbedTarget | null;
  onClose: () => void;
}

/**
 * Opens the partner booking URL in an on-page iframe overlay.
 * Some providers (Agoda, Booking.com, etc.) send X-Frame-Options / CSP
 * that the browser enforces — we cannot override that. Toolbar buttons
 * remain for a manual window/tab if the frame stays blank.
 */
export default function ServiceEmbedModal({ target, onClose }: ServiceEmbedModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!target) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [target, onClose]);

  if (!mounted || !target) return null;

  function openWindow() {
    openServicePopup(target!.url, target!.slug || target!.name);
  }

  function openTab() {
    window.open(target!.url, "_blank", "noopener,noreferrer");
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center gap-2 bg-brand-night px-3 sm:px-4 py-2.5 shrink-0 border-b border-white/10">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{target.name}</p>
          <p className="text-[10px] text-gray-500 truncate">Complete booking on this page</p>
        </div>
        <button
          type="button"
          onClick={openWindow}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Window
        </button>
        <button
          type="button"
          onClick={openTab}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New tab</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-white relative">
        <iframe
          key={target.url}
          src={target.url}
          title={target.name}
          className="absolute inset-0 w-full h-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          allow="payment *; geolocation *"
        />
      </div>
    </div>,
    document.body
  );
}
