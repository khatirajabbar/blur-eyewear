import Link from "next/link";
import { TextShuffle } from "@/components/ui/text-shuffle";

export default function NotFound() {
  return (
    <main className="page-shell not-found-page">
      <p className="eyebrow">ERROR / 404</p>
      <h1>OUT OF<br />FOCUS.</h1>
      <p>That page is not part of the current collection.</p>
      <Link href="/shop" className="editorial-link"><TextShuffle text="view all frames" /> <span>↗</span></Link>
    </main>
  );
}
