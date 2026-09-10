"use client";

import Link from "next/link";
import { ProductVisual } from "@/components/product/product-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/currency";
import { useBlurStore } from "@/store/blur-store";

export function CartView() {
  const { cart, cartCount, currency, setQuantity, removeFromCart } = useBlurStore();
  const { t } = useTranslation();
  const cartProducts = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((total, item) => total + item.product.priceUSD * item.quantity, 0);

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
            <Link href="/checkout" className="add-button"><TextShuffle text={t("cart.checkout")} /></Link>
          </aside>
        </div>
      )}
    </main>
  );
}
