"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { ProductVisual } from "@/components/product/product-visual";
import { useBlurStore } from "@/store/blur-store";

export function ShopGrid() {
  const { currency } = useBlurStore();
  return <div className="shop-grid">
    {products.map((product) => (
      <Link key={product.id} href={`/product/${product.slug}`} className="shop-card" data-cursor-label="VIEW">
        <ProductVisual product={product} size="small" />
        <div className="shop-card-meta"><span>{product.code} <b>{product.name}</b></span><span>{formatCurrency(product.priceUSD, currency)}</span></div>
        <span className="color-chip" style={{ backgroundColor: product.backgroundColor }} aria-hidden="true" />
      </Link>
    ))}
  </div>;
}
