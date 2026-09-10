"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LookVisual } from "@/components/looks/look-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { getProductDescription, type CopyKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { useBlurStore } from "@/store/blur-store";

const viewLabels = ["front", "side", "rear"] as const;
const pad = (value: number) => String(value).padStart(2, "0");
const AUTO_ADVANCE_MS = 2300;

export function ProductDetail({ product }: { product: Product }) {
  const { cart, currency, addToCart } = useBlurStore();
  const { locale, t } = useTranslation();
  const [selectedView, setSelectedView] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
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

  const handleAdd = () => {
    if (unavailable || atInventoryLimit) return;

    addToCart(product.id);
  };

  const selectView = (index: number) => {
    setSelectedView(index);
    setAutoAdvance(false);
  };

  return (
    <main className="product-page">
      <section className="product-stage" aria-label={t("product.imagery").replace("{name}", product.name)}>
        <p className="product-view-count">{t("product.object")} {pad(selectedView + 1)} / 03</p>

        <div className="product-look-frame">
          <LookVisual product={product} priority sizes="(max-width: 860px) 90vw, 58vw" />
            <span>{product.name}</span>
        </div>

        <section
          className="product-angle-carousel"
          aria-roledescription="carousel"
          aria-label={t("product.imagery").replace("{name}", product.name)}
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
            <span>{t("product.angleScan")}</span>
            <span aria-hidden="true">{pad(selectedView + 1)} / 03</span>
          </div>
          <div className="product-angle-media" aria-live="off">
            <div className="product-angle-track" style={{ transform: `translateX(-${selectedView * 100}%)` }}>
              {product.galleryImages.map((image, index) => (
                <figure key={image} className="product-angle-slide" aria-hidden={selectedView !== index}>
                  <Image
                    src={image}
                    alt={selectedView === index ? `${product.name}, ${t(`product.${viewLabels[index]}` as CopyKey)} view` : ""}
                    fill
                    priority={index === 0}
                    unoptimized
                    sizes="(max-width: 860px) 76vw, 43vw"
                    className="product-angle-image"
                  />
                </figure>
              ))}
            </div>
          </div>
          <div className="product-angle-footer">
            <div className="product-angle-controls" aria-label={t("product.chooseAngle")}>
              {product.galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={selectedView === index ? "is-selected" : ""}
                  onClick={() => selectView(index)}
                  aria-pressed={selectedView === index}
                >
                  <span>{pad(index + 1)}</span>
                  <TextShuffle text={t(`product.${viewLabels[index]}` as CopyKey)} />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="product-angle-toggle"
              onClick={() => setAutoAdvance((playing) => !playing)}
              aria-pressed={autoAdvance}
              disabled={reducedMotion}
              title={reducedMotion ? t("product.motionReduced") : undefined}
            >
              <TextShuffle text={reducedMotion ? t("product.motionOff") : autoAdvance ? t("product.pause") : t("product.play")} />
            </button>
          </div>
        </section>
      </section>

      <aside className="product-info">
        <p className="eyebrow">{product.code} / collection 01</p>
        <h1>{product.name}</h1>
        <p className="product-description">{getProductDescription(product.id, product.description, locale)}</p>
        <p className="product-price">{formatCurrency(product.priceUSD, currency)}</p>
        <dl className="product-specs">
          <div><dt>{t("product.frame")}</dt><dd>{product.frameColor}</dd></div>
          <div><dt>{t("product.lens")}</dt><dd>{product.lensColor}</dd></div>
          <div><dt>{t("product.material")}</dt><dd>{product.material}</dd></div>
          <div><dt>{t("product.fit")}</dt><dd>{product.fit}</dd></div>
          <div><dt>{t("product.dimensions")}</dt><dd>{product.dimensions}</dd></div>
          <div><dt>{t("product.availability")}</dt><dd>{unavailable ? t("product.soldOut") : remainingInventory <= 5 ? t("product.piecesLeft").replace("{count}", String(remainingInventory)) : t("product.piecesAvailable").replace("{count}", String(remainingInventory))}</dd></div>
        </dl>
        <button className="add-button" disabled={unavailable || atInventoryLimit} onClick={handleAdd}><TextShuffle text={unavailable ? t("product.soldOut") : atInventoryLimit ? t("product.allInCart") : t("product.addToCart")} /><span>{formatCurrency(product.priceUSD, currency)}</span></button>
      </aside>
    </main>
  );
}
