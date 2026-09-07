"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const failed = failedImage === product.lookImage;

  return (
    <div className={cn("look-visual", className)} data-look={product.slug}>
      {failed ? <div className="look-visual-fallback" role="img" aria-label={`${product.name} campaign look unavailable`}><span>BLUR</span><small>{product.name}</small></div> : <Image
          src={product.lookImage}
          alt={`${product.name} campaign look`}
          fill
          priority={priority}
          unoptimized
          sizes={sizes}
          className="look-visual-image"
          onError={() => setFailedImage(product.lookImage)}
        />}
    </div>
  );
}
