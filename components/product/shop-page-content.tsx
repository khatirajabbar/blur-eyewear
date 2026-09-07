"use client";

import { ShopGrid } from "@/components/product/shop-grid";
import { useTranslation } from "@/hooks/use-translation";

type ShopPageContentProps = {
  productCount: number;
};

export function ShopPageContent({ productCount }: ShopPageContentProps) {
  const { t } = useTranslation();

  return (
    <main className="collection-page">
      <header className="collection-page-header">
        <p>{t("shop.collection")}</p>
        <h1>{t("shop.allLooks")}</h1>
        <span>{productCount}</span>
      </header>
      <ShopGrid />
    </main>
  );
}
