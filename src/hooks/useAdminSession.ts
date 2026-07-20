"use client";

import { useState, useEffect, useCallback } from "react";

interface AdminSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const fetchSession = useCallback(() => {
    setStatus("loading");
    fetch("/api/admin/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setSession(data as AdminSession);
          setStatus("authenticated");
        } else {
          setSession(null);
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        setSession(null);
        setStatus("unauthenticated");
      });
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Some browsers restore a page from the back/forward cache (bfcache) without
  // re-running middleware or refetching data, which can briefly show stale admin
  // UI after sign-out if the user hits Back. Force a re-check whenever the page
  // is restored this way.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) fetchSession();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [fetchSession]);

  return { session, status, refresh: fetchSession };
}
