"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthState = {
  configured: boolean;
  ready: boolean;
  user: User | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);

  const refreshUser = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setUser(null);
      setReady(true);
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    setUser(error ? null : data.user);
    setReady(true);
  };

  useEffect(() => {
    if (!configured) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;

    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      setUser(error ? null : data.user);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo<AuthState>(() => ({
    configured,
    ready,
    user,
    refreshUser,
    signOut: async () => {
      const supabase = getSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
      setUser(null);
    },
  }), [configured, ready, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error("useAuth must be used within AuthProvider");
  return state;
}
