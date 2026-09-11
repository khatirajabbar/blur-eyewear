"use client";

import Link from "next/link";
import { useState } from "react";
import { LookVisual } from "@/components/looks/look-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { getProductDescription } from "@/lib/i18n";

const pad = (value: number) => String(value).padStart(2, "0");

export function HomeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { locale, t } = useTranslation();
  const activeProduct = products[activeIndex];

  const selectLook = (index: number) => setActiveIndex(index);
  const stepLook = (direction: number) => setActiveIndex((index) => (index + direction + products.length) % products.length);

  return (
    <main className="looks-home" id="collection">
      <section className="look-stage" aria-labelledby="look-title">
        <div className="look-stage-copy">
          <p className="eyebrow">{t("home.collection")}</p>
          <p className="look-position">{t("home.look")} {pad(activeIndex + 1)} / {pad(products.length)}</p>
          <h1 id="look-title">{activeProduct.name}</h1>
          <p className="look-description">{getProductDescription(activeProduct.id, activeProduct.description, locale)}</p>
          <dl className="look-facts">
            <div><dt>{t("product.frame")}</dt><dd>{activeProduct.frameColor}</dd></div>
            <div><dt>{t("product.lens")}</dt><dd>{activeProduct.lensColor}</dd></div>
            <div><dt>{t("product.fit")}</dt><dd>{activeProduct.fit}</dd></div>
          </dl>
          <Link href={`/product/${activeProduct.slug}`} className="look-discover"><TextShuffle text={t("home.viewFrame")} /> <span>↗</span></Link>
        </div>

        <Link href={`/product/${activeProduct.slug}`} className="active-look" aria-label={t("home.viewProduct").replace("{name}", activeProduct.name)}>
          <LookVisual product={activeProduct} priority sizes="(max-width: 860px) 86vw, 52vw" />
          <span className="active-look-hint"><TextShuffle text={t("home.tapToEnter")} /></span>
        </Link>

        <nav className="look-selector" aria-label={t("home.selectLook")}>
          <div className="look-selector-heading"><span>{t("home.allLooks")}</span><span>{pad(products.length)}</span></div>
          <div className="look-selector-list">
            {products.map((product, index) => (
              <button
                type="button"
                key={product.id}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => selectLook(index)}
                aria-pressed={index === activeIndex}
              >
                <span>{pad(index + 1)}</span>
                <b><TextShuffle text={product.name} /></b>
              </button>
            ))}
          </div>
        </nav>

        <div className="look-stage-controls">
          <button type="button" onClick={() => stepLook(-1)} aria-label={t("home.previous")}>←</button>
          <span>{pad(activeIndex + 1)} / {pad(products.length)}</span>
          <button type="button" onClick={() => stepLook(1)} aria-label={t("home.next")}>→</button>
        </div>

        <Link href="/shop" className="look-all-link"><span className="look-all-count">{products.length}</span> <TextShuffle text={t("home.frames")} /> <TextShuffle text={t("home.seeCollection")} /></Link>
      </section>

      <section className="collection-statement" aria-labelledby="collection-statement-title">
        <p className="eyebrow">BLUR / 2026</p>
        <h2 id="collection-statement-title">{t("home.statement")}</h2>
        <p>{t("home.statementCopy")}</p>
      </section>
    </main>
  );
}
