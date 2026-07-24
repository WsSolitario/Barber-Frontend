"use client";

import { useEffect } from "react";

import { refreshSession } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function SessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    refreshSession().then((session) => setAccessToken(session.accessToken)).catch(() => undefined).finally(setHydrated);
  }, [setAccessToken, setHydrated]);

  return children;
}
