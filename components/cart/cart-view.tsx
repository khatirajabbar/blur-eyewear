"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ProductVisual } from "@/components/product/product-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/currency";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useBlurStore } from "@/store/blur-store";

export function CartView() {
  const router = useRouter();
  const { cart, cartCount, currency, setQuantity, removeFromCart } = useBlurStore();
  const { configured, ready, user } = useAuth();
  const { t } = useTranslation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const cartProducts = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((total, item) => total + item.product.priceUSD * item.quantity, 0);

  const startCheckout = async () => {
    setCheckoutError("");

    if (!configured || !isSupabaseConfigured()) {
      setCheckoutError(t("cart.checkoutUnavailable"));
      return;
    }

    if (!ready || !user) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setCheckoutError(t("cart.checkoutUnavailable"));
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/account?next=/cart");
        return;
      }
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok || !result || typeof result !== "object" || !("url" in result) || typeof result.url !== "string") {
        const message = result && typeof result === "object" && "message" in result && typeof result.message === "string"
          ? result.message
          : t("cart.checkoutError");
        throw new Error(message);
      }

      window.location.assign(result.url);
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : t("cart.checkoutError"));
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="cart-page page-shell">
      <header className="route-header">
        <p className="eyebrow">{t("cart.selectedObjects")}</p>
        <h1>{t("cart.yourCart")} <span>({cartCount})</span></h1>
      </header>
      {cartProducts.length === 0 ? (
        <div className="empty-bag glass-panel">
          <p>{t("cart.empty")}</p>
          <Link href="/shop" className="editorial-link"><TextShuffle text={t("cart.enterShop")} /> <span>↗</span></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">{cartProducts.map(({ product, quantity }) => (
            <article className="cart-line" key={product.id}>
              <ProductVisual product={product} />
              <div><p className="eyebrow">{product.code}</p><h2>{product.name}</h2><p>{formatCurrency(product.priceUSD, currency)}</p></div>
              <div className="quantity-control" aria-label={t("cart.quantity").replace("{name}", product.name)}>
                <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label={t("cart.decrease").replace("{name}", product.name)}>−</button>
                <span>{quantity}</span>
                <button disabled={quantity >= product.inventory} onClick={() => setQuantity(product.id, quantity + 1)} aria-label={t("cart.increase").replace("{name}", product.name)} title={quantity >= product.inventory ? t("cart.maxQuantity") : undefined}>+</button>
              </div>
              <button className="remove-button" onClick={() => removeFromCart(product.id)}><TextShuffle text={t("cart.remove")} /></button>
            </article>
          ))}</div>
          <aside className="bag-summary glass-panel">
            <p className="eyebrow">{t("cart.subtotal")} / {currency}</p>
            <p className="summary-price">{formatCurrency(subtotal, currency)}</p>
            <p>{t("cart.shipping")}</p>
            <p className="currency-note">{t("cart.currencyNote")}</p>
            {checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}
            <button className="add-button" disabled={isCheckingOut} onClick={startCheckout}>
              <TextShuffle text={isCheckingOut ? t("cart.checkoutLoading") : t("cart.checkout")} />
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
