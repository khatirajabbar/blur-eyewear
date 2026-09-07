import { Suspense } from "react";
import { AccountPage } from "@/components/auth/account-page";

export const metadata = { title: "Account — BLUR" };

export default function AccountRoute() {
  return <Suspense fallback={<main className="account-page page-shell"><p className="eyebrow">account / access</p><p className="account-copy">…</p></main>}><AccountPage /></Suspense>;
}
