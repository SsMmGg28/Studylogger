"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
      setState({ user: demoUser, profile: DEMO_PROFILE, loading: false });
      return;
    }
    // auth may be undefined at runtime if Firebase is not configured
    const a = auth as typeof auth | undefined;
    if (!a) {
      setState({ user: null, profile: null, loading: false });
      return;
    }
    const unsub = onAuthStateChanged(a, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setState({ user, profile, loading: false });
        } catch {
          setState({ user, profile: null, loading: false });
        }
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });
    return () => unsub();
  }, []);

  return state;
}
