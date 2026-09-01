"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LookVisual } from "@/components/looks/look-visual";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { useBlurStore } from "@/store/blur-store";

const viewLabels = ["front", "side", "rear"];

export function ProductDetail({ product }: { product: Product }) {
  const { currency, addToCart } = useBlurStore();
  const [selectedView, setSelectedView] = useState(0);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="product-page">
      <section className="product-stage" aria-label={`${product.name} product imagery`}>
        <Link href="/shop" className="product-back">← all frames</Link>
        <p className="product-view-count">object {String(selectedView + 1).padStart(2, "0")} / 03</p>

        <div className="product-look-frame">
          <LookVisual product={product} priority sizes="(max-width: 860px) 90vw, 58vw" />
          <span>the {product.name} look</span>
        </div>

        <div className="product-object-card" aria-live="polite">
          <div className="product-image-frame">
            <Image
              src={product.galleryImages[selectedView]}
              alt={`${product.name}, ${viewLabels[selectedView]} view`}
              fill
              priority
              sizes="(max-width: 860px) 47vw, 25vw"
              className="product-image"
            />
          </div>
          <span>{viewLabels[selectedView]} view</span>
        </div>
        <div className="product-gallery" aria-label="Product views">
          {product.galleryImages.map((image, index) => (
            <button key={image} type="button" className={selectedView === index ? "is-selected" : ""} onClick={() => setSelectedView(index)} aria-label={`Show ${viewLabels[index]} view`}>
              <Image src={image} alt="" fill sizes="88px" />
              <span>{viewLabels[index]}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="product-info">
        <p className="eyebrow">{product.code} / collection 01</p>
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{formatCurrency(product.priceUSD, currency)}</p>
        <dl className="product-specs">
          <div><dt>frame</dt><dd>{product.frameColor}</dd></div>
          <div><dt>lens</dt><dd>{product.lensColor}</dd></div>
          <div><dt>material</dt><dd>{product.material}</dd></div>
          <div><dt>fit</dt><dd>{product.fit}</dd></div>
          <div><dt>dimensions</dt><dd>{product.dimensions}</dd></div>
          <div><dt>availability</dt><dd>{product.inventory <= 5 ? `${product.inventory} pieces left` : `${product.inventory} pieces available`}</dd></div>
        </dl>
        <button className="add-button" onClick={handleAdd}>{added ? "added to bag" : "add to bag"}<span>{formatCurrency(product.priceUSD, currency)}</span></button>
      </aside>
    </main>
  );
}
