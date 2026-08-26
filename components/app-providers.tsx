"use client";

import { BlurStoreProvider } from "@/store/blur-store";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SiteShell } from "@/components/site-shell";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <BlurStoreProvider><SiteShell>{children}</SiteShell><CustomCursor /></BlurStoreProvider>;
}
