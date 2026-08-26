import Link from "next/link";

export const metadata = { title: "Order confirmed — BLUR" };

export default function CheckoutSuccessPage() {
  return <main className="success-page"><p className="eyebrow">CHECKOUT / PLACEHOLDER</p><h1>YOU ARE NOW<br />SLIGHTLY <i>BLURRED.</i></h1><p>The final Stripe test-mode confirmation experience will live here in Milestone 2.</p><Link href="/shop" className="editorial-link">RETURN TO OBJECTS <span>↗</span></Link></main>;
}
