"use client";

import Link from "next/link";
import { useState } from "react";
import { LookVisual } from "@/components/looks/look-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";

const pad = (value: number) => String(value).padStart(2, "0");

export function HomeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  const selectLook = (index: number) => setActiveIndex(index);
  const stepLook = (direction: number) => setActiveIndex((index) => (index + direction + products.length) % products.length);

  return (
    <main className="looks-home" id="collection">
      <section className="look-stage" aria-labelledby="look-title">
        <div className="look-stage-copy">
          <p className="eyebrow">collection 01 / 01</p>
          <p className="look-position">look {pad(activeIndex + 1)} / {pad(products.length)}</p>
          <h1 id="look-title">{activeProduct.name}</h1>
          <p className="look-description">{activeProduct.description}</p>
          <dl className="look-facts">
            <div><dt>frame</dt><dd>{activeProduct.frameColor}</dd></div>
            <div><dt>lens</dt><dd>{activeProduct.lensColor}</dd></div>
            <div><dt>fit</dt><dd>{activeProduct.fit}</dd></div>
          </dl>
          <Link href={`/product/${activeProduct.slug}`} className="look-discover"><TextShuffle text="view frame" /> <span>↗</span></Link>
        </div>

        <Link href={`/product/${activeProduct.slug}`} className="active-look" aria-label={`View ${activeProduct.name} sunglasses`}>
          <LookVisual product={activeProduct} priority sizes="(max-width: 860px) 86vw, 52vw" />
          <span className="active-look-hint"><TextShuffle text="tap to enter" /></span>
        </Link>

        <nav className="look-selector" aria-label="Select a collection look">
          <div className="look-selector-heading"><span>all looks</span><span>{pad(products.length)}</span></div>
          <div className="look-selector-list">
            {products.map((product, index) => (
              <button
                type="button"
                key={product.id}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => selectLook(index)}
                onMouseEnter={() => selectLook(index)}
                onFocus={() => selectLook(index)}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span>{pad(index + 1)}</span>
                <b><TextShuffle text={product.name} /></b>
              </button>
            ))}
          </div>
        </nav>

        <div className="look-stage-controls">
          <button type="button" onClick={() => stepLook(-1)} aria-label="Previous look">←</button>
          <span>{pad(activeIndex + 1)} / {pad(products.length)}</span>
          <button type="button" onClick={() => stepLook(1)} aria-label="Next look">→</button>
        </div>

        <Link href="/shop" className="look-all-link"><span>{products.length}</span> <TextShuffle text="frames" /> <TextShuffle text="see collection" /></Link>
      </section>

      <section className="collection-statement" aria-labelledby="collection-statement-title">
        <p className="eyebrow">BLUR / 2026</p>
        <h2 id="collection-statement-title">Objects made for the moment before you are recognised.</h2>
        <p>Eleven silhouettes. Eleven optical characters. Choose a look, then see the frame from every angle.</p>
      </section>
    </main>
  );
}
