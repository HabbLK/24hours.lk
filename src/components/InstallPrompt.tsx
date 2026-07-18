"use client";

import { useEffect, useState } from "react";
import { X, Download, Share, SquarePlus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";
const SHOW_DELAY_MS = 1800;

function isDismissedThisVisit() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(DISMISS_KEY) === "1";
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissedThisVisit()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIOS()) {
      iosTimer = setTimeout(() => {
        setShowIOSInstructions(true);
        setVisible(true);
      }, SHOW_DELAY_MS);
    }

    const handleInstalled = () => {
      setVisible(false);
      window.sessionStorage.removeItem(DISMISS_KEY);
    };
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      } else {
        dismiss();
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  };

  if (!visible || (!deferredPrompt && !showIOSInstructions)) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 sm:bottom-6 sm:left-6 sm:right-auto sm:inset-x-auto z-[90] px-4 sm:px-0 animate-fade-in-up">
      <div className="relative w-full sm:w-96 bg-brand-night text-white rounded-2xl shadow-2xl shadow-black/30 border border-white/10 p-5 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 font-heading font-extrabold text-lg">
            <span className="text-brand-red">24</span>h
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-sm">Install 24hours.lk</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Add it to your home screen for instant, app-like access — even offline.
            </p>
          </div>
        </div>

        {showIOSInstructions ? (
          <div className="relative mt-4 space-y-2 text-xs text-gray-300">
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">1</span>
              Tap the Share icon <Share className="w-3.5 h-3.5 inline mx-0.5" /> in Safari
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">2</span>
              Select <SquarePlus className="w-3.5 h-3.5 inline mx-0.5" /> "Add to Home Screen"
            </p>
            <button
              onClick={dismiss}
              className="mt-2 w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="relative mt-4 flex gap-2">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-brand-red/25 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {installing ? "Installing..." : "Install App"}
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2.5 border border-white/15 text-gray-300 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors"
            >
              Not now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
