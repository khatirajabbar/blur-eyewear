import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout/checkout-success";

export const metadata = { title: "Order confirmed — BLUR" };

export default function CheckoutSuccessPage() {
  return <Suspense fallback={<main className="success-page"><p className="eyebrow">checkout / confirmed</p><p className="success-copy">…</p></main>}><CheckoutSuccess /></Suspense>;
}
