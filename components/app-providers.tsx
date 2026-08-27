"use client";

import { BlurStoreProvider } from "@/store/blur-store";
import { SiteShell } from "@/components/site-shell";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <BlurStoreProvider><SiteShell>{children}</SiteShell></BlurStoreProvider>;
}
