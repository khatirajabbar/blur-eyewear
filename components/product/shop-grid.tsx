import Link from "next/link";
import { products } from "@/data/products";
import { ProductVisual } from "@/components/product/product-visual";

export function ShopGrid() {
  return (
    <div className="shop-grid" aria-label="All BLUR frames">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.slug}`} className="shop-card" aria-label={`Open ${product.name}`}>
          <ProductVisual product={product} />
          <span className="shop-card-number">{product.code}</span>
        </Link>
      ))}
    </div>
  );
}
