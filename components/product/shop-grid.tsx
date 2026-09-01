import Link from "next/link";
import { LookVisual } from "@/components/looks/look-visual";
import { products } from "@/data/products";

export function ShopGrid() {
  return (
    <div className="shop-grid" aria-label="All BLUR looks">
      {products.map((product, index) => (
        <Link key={product.id} href={`/product/${product.slug}`} className="shop-card" aria-label={`Open ${product.name}`}>
          <LookVisual product={product} sizes="(max-width: 860px) 46vw, 22vw" />
          <span className="shop-card-number">look {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
          <span className="shop-card-name">{product.name}</span>
        </Link>
      ))}
    </div>
  );
}
