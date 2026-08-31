import Image from "next/image";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductVisualProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductVisual({ product, className, priority = false }: ProductVisualProps) {
  return (
    <div className={cn("product-visual", className)}>
      <Image
        src={product.primaryImage}
        alt={`${product.name} sunglasses`}
        fill
        priority={priority}
        sizes="(max-width: 700px) 43vw, (max-width: 1200px) 17vw, 12vw"
        className="product-visual-image"
      />
    </div>
  );
}
