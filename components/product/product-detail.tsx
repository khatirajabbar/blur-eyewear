"use client";

import { useState, type CSSProperties } from "react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { ProductVisual } from "@/components/product/product-visual";
import { useBlurStore } from "@/store/blur-store";

export function ProductDetail({ product }: { product: Product }) {
  const { currency, addToCart } = useBlurStore();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return <main className="product-page" style={{ "--product-page-bg": product.backgroundColor } as CSSProperties}>
    <div className="product-hero-visual"><ProductVisual product={product} size="large" label /></div>
    <section className="product-info">
      <p className="eyebrow">{product.code} / OPTICAL OBJECT</p>
      <h1>{product.name}</h1>
      <p className="product-price">{formatCurrency(product.priceUSD, currency)}</p>
      <p className="product-description">{product.description}</p>
      <dl className="product-specs">
        <div><dt>FRAME</dt><dd>{product.frameColor}</dd></div>
        <div><dt>LENS</dt><dd>{product.lensColor}</dd></div>
        <div><dt>MATERIAL</dt><dd>{product.material}</dd></div>
        <div><dt>FIT</dt><dd>{product.fit}</dd></div>
        <div><dt>DIMENSIONS</dt><dd>{product.dimensions}</dd></div>
        <div><dt>AVAILABILITY</dt><dd>{product.inventory <= 5 ? `Only ${product.inventory} objects left` : `${product.inventory} objects available`}</dd></div>
      </dl>
      <button className="add-button" onClick={handleAdd}>{added ? "ADDED TO BAG" : "ADD TO BAG"} <span>+</span></button>
      <p className="asset-note">Product renders will replace this temporary object study at <code>{product.primaryImage}</code>.</p>
    </section>
  </main>;
}
