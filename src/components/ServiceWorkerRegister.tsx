"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Register immediately — by the time this effect runs, the window "load"
    // event has usually already fired, so waiting for it here means the
    // listener never triggers and the service worker never registers.
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
