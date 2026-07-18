"use client";

import { useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function FooterInstallCTA() {
  const { canInstall, hasNativePrompt, isIOS, promptInstall } = usePwaInstall();
  const [installing, setInstalling] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (hasNativePrompt) {
      setInstalling(true);
      try {
        await promptInstall();
      } finally {
        setInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSSteps((prev) => !prev);
    }
  };

  return (
    <div className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-brand-red/15 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-brand-red" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Get the 24hours.lk app</p>
          <p className="text-xs text-gray-500 mt-0.5">Install for faster, app-like access — even offline.</p>
        </div>
        <button
          onClick={handleClick}
          disabled={installing}
          className="shrink-0 px-4 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white text-xs sm:text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-brand-red/25 disabled:opacity-50"
        >
          {installing ? "Installing..." : "Install"}
        </button>
      </div>

      {showIOSSteps && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-gray-400 animate-fade-in">
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 text-gray-300">1</span>
            Tap the Share icon <Share className="w-3.5 h-3.5 inline mx-0.5" /> in Safari
          </p>
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 text-gray-300">2</span>
            Select <SquarePlus className="w-3.5 h-3.5 inline mx-0.5" /> "Add to Home Screen"
          </p>
        </div>
      )}
    </div>
  );
}
