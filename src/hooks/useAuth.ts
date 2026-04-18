"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { clearClientSessionHint, setClientSessionHint } from "@/lib/auth";
import { getUserProfile, type UserProfile } from "@/lib/db";
import { DEMO_UID, DEMO_PROFILE } from "@/lib/demo-data";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    // Demo mode
    if (typeof window !== "undefined" && localStorage.getItem("demo-mode") === "true") {
      const demoUser = { uid: DEMO_UID, email: "demo@studylogger.app", displayName: "Demo Kullanıcı" } as unknown as User;
      queueMicrotask(() => {
        setState({ user: demoUser, profile: DEMO_PROFILE, loading: false });
      });
      return;
    }
    // auth may be undefined at runtime if Firebase is not configured
    const a = auth as typeof auth | undefined;
    if (!a) {
      queueMicrotask(() => {
        setState({ user: null, profile: null, loading: false });
      });
      return;
    }
    const unsub = onAuthStateChanged(a, async (user) => {
      if (user) {
        setClientSessionHint();
        try {
          const profile = await getUserProfile(user.uid);
          setState({ user, profile, loading: false });
          // Sync session cookie
          user.getIdToken().then(idToken => {
            fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            }).catch(err => console.error("Session sync failed:", err));
          });
        } catch {
          setState({ user, profile: null, loading: false });
        }
      } else {
        setState({ user: null, profile: null, loading: false });
        clearClientSessionHint();
        // Clear session cookie
        fetch("/api/auth/session", { method: "DELETE" }).catch(err => console.error("Session clear failed:", err));
      }
    });
    return () => unsub();
  }, []);

  return state;
}
