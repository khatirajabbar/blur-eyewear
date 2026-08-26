import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BlurMark({ className, href = true }: { className?: string; href?: boolean }) {
  const mark = <span className={cn("blur-mark", className)} aria-label="BLUR">blur</span>;
  return href ? <Link href="/" className="mark-link">{mark}</Link> : mark;
}

export function BlurLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/blur-logo.png"
      alt="BLUR eyewear"
      width={1672}
      height={941}
      priority={priority}
      sizes="(max-width: 760px) 170px, 240px"
      className={cn("blur-logo", className)}
    />
  );
}
