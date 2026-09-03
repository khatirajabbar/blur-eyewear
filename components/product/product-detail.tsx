"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LookVisual } from "@/components/looks/look-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { useBlurStore } from "@/store/blur-store";

const viewLabels = ["front", "side", "rear"] as const;
const pad = (value: number) => String(value).padStart(2, "0");
const AUTO_ADVANCE_MS = 2300;

export function ProductDetail({ product }: { product: Product }) {
  const { cart, currency, addToCart } = useBlurStore();
  const [selectedView, setSelectedView] = useState(0);
  const [added, setAdded] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const addedResetRef = useRef<number | null>(null);
  const quantityInBag = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
  const remainingInventory = Math.max(product.inventory - quantityInBag, 0);
  const unavailable = product.inventory === 0;
  const atInventoryLimit = !unavailable && remainingInventory === 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!autoAdvance || interactionPaused || reducedMotion) return;

    const interval = window.setInterval(() => {
      setSelectedView((current) => (current + 1) % product.galleryImages.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [autoAdvance, interactionPaused, product.galleryImages.length, reducedMotion]);

  useEffect(() => () => {
    if (addedResetRef.current !== null) window.clearTimeout(addedResetRef.current);
  }, []);

  const handleAdd = () => {
    if (unavailable || atInventoryLimit) return;

    addToCart(product.id);
    setAdded(true);
    if (addedResetRef.current !== null) window.clearTimeout(addedResetRef.current);
    addedResetRef.current = window.setTimeout(() => {
      setAdded(false);
      addedResetRef.current = null;
    }, 1500);
  };

  const selectView = (index: number) => {
    setSelectedView(index);
    setAutoAdvance(false);
  };

  return (
    <main className="product-page">
      <section className="product-stage" aria-label={`${product.name} product imagery`}>
        <Link href="/shop" className="product-back">← <TextShuffle text="all frames" /></Link>
        <p className="product-view-count">object {pad(selectedView + 1)} / 03</p>

        <div className="product-look-frame">
          <LookVisual product={product} priority sizes="(max-width: 860px) 90vw, 58vw" />
          <span>the {product.name} look</span>
        </div>

        <section
          className="product-angle-carousel"
          aria-roledescription="carousel"
          aria-label={`${product.name} product angles`}
          onMouseEnter={() => setInteractionPaused(true)}
          onMouseLeave={() => setInteractionPaused(false)}
          onFocusCapture={() => setInteractionPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setInteractionPaused(false);
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType === "touch") setInteractionPaused(true);
          }}
          onPointerUp={(event) => {
            if (event.pointerType === "touch") setInteractionPaused(false);
          }}
          onPointerCancel={(event) => {
            if (event.pointerType === "touch") setInteractionPaused(false);
          }}
          onLostPointerCapture={(event) => {
            if (event.pointerType === "touch") setInteractionPaused(false);
          }}
        >
          <div className="product-angle-heading">
            <span>angle scan</span>
            <span aria-hidden="true">{pad(selectedView + 1)} / 03</span>
          </div>
          <div className="product-angle-media" aria-live="off">
            <div className="product-angle-track" style={{ transform: `translateX(-${selectedView * 100}%)` }}>
              {product.galleryImages.map((image, index) => (
                <figure key={image} className="product-angle-slide" aria-hidden={selectedView !== index}>
                  <Image
                    src={image}
                    alt={selectedView === index ? `${product.name}, ${viewLabels[index]} view` : ""}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 860px) 76vw, 43vw"
                    className="product-angle-image"
                  />
                </figure>
              ))}
            </div>
          </div>
          <div className="product-angle-footer">
            <div className="product-angle-controls" aria-label="Choose a product angle">
              {product.galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={selectedView === index ? "is-selected" : ""}
                  onClick={() => selectView(index)}
                  aria-pressed={selectedView === index}
                >
                  <span>{pad(index + 1)}</span>
                  <TextShuffle text={viewLabels[index]} />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="product-angle-toggle"
              onClick={() => setAutoAdvance((playing) => !playing)}
              aria-pressed={autoAdvance}
              disabled={reducedMotion}
              title={reducedMotion ? "Automatic motion is off because reduced motion is enabled" : undefined}
            >
              <TextShuffle text={reducedMotion ? "motion off" : autoAdvance ? "pause" : "play"} />
            </button>
          </div>
        </section>
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
          <div><dt>availability</dt><dd>{unavailable ? "sold out" : remainingInventory <= 5 ? `${remainingInventory} pieces left` : `${remainingInventory} pieces available`}</dd></div>
        </dl>
        <button className="add-button" disabled={unavailable || atInventoryLimit} onClick={handleAdd}><TextShuffle text={unavailable ? "sold out" : atInventoryLimit ? "all in bag" : added ? "added to bag" : "add to bag"} /><span>{formatCurrency(product.priceUSD, currency)}</span></button>
      </aside>
    </main>
  );
}
