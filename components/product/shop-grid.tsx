"use client";

import Link from "next/link";
import { LookVisual } from "@/components/looks/look-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";

export function ShopGrid() {
  const { t } = useTranslation();

  return (
    <div className="shop-grid" aria-label={t("shop.aria")}>
      {products.map((product, index) => (
        <Link key={product.id} href={`/product/${product.slug}`} className="shop-card" aria-label={`${t("shop.open")} ${product.name}`}>
          <LookVisual product={product} sizes="(max-width: 860px) 46vw, 22vw" />
          <span className="shop-card-number"><TextShuffle text={t("home.look")} /> {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
          <TextShuffle text={product.name} className="shop-card-name" />
        </Link>
      ))}
    </div>
  );
}
