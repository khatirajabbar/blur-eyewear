import Link from "next/link";
import { cn } from "@/lib/utils";

export function BlurMark({ className, href = true }: { className?: string; href?: boolean }) {
  const mark = <span className={cn("blur-mark", className)} aria-label="BLUR">blur</span>;
  return href ? <Link href="/" className="mark-link">{mark}</Link> : mark;
}

export function BlurLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  void priority;

  return <span className={cn("blur-logo", className)} aria-label="BLUR eyewear">blur</span>;
}
