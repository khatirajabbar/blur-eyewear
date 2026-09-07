"use client";

import Link from "next/link";
import { useEffect } from "react";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { useBlurStore } from "@/store/blur-store";

export function CartToast() {
  const { toast, dismissToast } = useBlurStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(dismissToast, 4200);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toast]);

  if (!toast) return null;

  const product = toast.productId ? products.find((item) => item.id === toast.productId) : undefined;
  const message = product ? `${product.name} · ${t("toast.added")}` : toast.messageKey ? t(toast.messageKey) : "";

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      <p>{message}</p>
      <Link href="/cart" onClick={dismissToast}>{t("toast.viewCart")} ↗</Link>
      <button type="button" onClick={dismissToast} aria-label={t("toast.close")}>×</button>
    </div>
  );
}
