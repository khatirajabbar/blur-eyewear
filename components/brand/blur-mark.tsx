import Link from "next/link";
import { cn } from "@/lib/utils";

export function BlurMark({ className, href = true }: { className?: string; href?: boolean }) {
  const mark = <span className={cn("blur-mark", className)} aria-label="BLUR">BLUR</span>;
  return href ? <Link href="/" className="mark-link">{mark}</Link> : mark;
}
