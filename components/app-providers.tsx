"use client";

import { BlurStoreProvider } from "@/store/blur-store";
import { SiteShell } from "@/components/site-shell";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartToast } from "@/components/cart/cart-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <BlurStoreProvider><AuthProvider><SiteShell>{children}</SiteShell><CartToast /></AuthProvider></BlurStoreProvider>;
}
