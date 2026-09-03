import Image from "next/image";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type LookVisualProps = {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function LookVisual({
  product,
  className,
  priority = false,
  sizes = "(max-width: 860px) 76vw, 48vw",
}: LookVisualProps) {
  return (
    <div className={cn("look-visual", className)} data-look={product.slug}>
      <Image
        src={product.lookImage}
        alt={`${product.name} campaign look`}
        fill
        priority={priority}
        unoptimized={product.slug === "polar-static"}
        sizes={sizes}
        className="look-visual-image"
      />
    </div>
  );
}
