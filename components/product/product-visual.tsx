import type { CSSProperties } from "react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductVisualProps = {
  product: Product;
  className?: string;
  label?: boolean;
  size?: "small" | "medium" | "large";
};

export function ProductVisual({ product, className, label = false, size = "medium" }: ProductVisualProps) {
  const style = {
    "--frame-color": product.frameColor.includes("black") ? "#16181d" : product.accentColor,
    "--lens-color": product.backgroundColor,
    "--product-bg": product.backgroundColor,
  } as CSSProperties;

  return (
    <div className={cn("product-visual", `visual-${size}`, className)} style={style} aria-label={`${product.code} ${product.name} temporary sculptural eyewear visual`} role="img">
      <div className={cn("eyewear", `eyewear-${product.silhouette}`)}>
        <span className="lens lens-left" />
        <span className="bridge" />
        <span className="lens lens-right" />
        <span className="temple temple-left" />
        <span className="temple temple-right" />
        <span className="light-slice" />
      </div>
      {label && <span className="visual-caption">TEMPORARY OBJECT STUDY</span>}
    </div>
  );
}
