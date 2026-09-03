import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const lockup = "/brand/blur-lockup-header.png";

export function BlurMark({ className, href = true, onClick }: { className?: string; href?: boolean; onClick?: () => void }) {
  const mark = (
    <span className={cn("blur-mark", className)}>
      <Image alt="blur eyewear" className="blur-lockup-image" height={495} priority src={lockup} width={1200} />
    </span>
  );

  return href ? <Link href="/" className="mark-link" onClick={onClick}>{mark}</Link> : mark;
}

export function BlurLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("blur-mark", "blur-logo", className)}>
      <Image alt="blur eyewear" className="blur-lockup-image" height={495} priority={priority} src={lockup} width={1200} />
    </span>
  );
}
