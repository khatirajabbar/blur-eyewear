"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { ProductVisual } from "@/components/product/product-visual";
import { useBlurStore } from "@/store/blur-store";

export function CartView() {
  const { cart, currency, setQuantity, removeFromCart } = useBlurStore();
  const cartProducts = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((total, item) => total + item.product.priceUSD * item.quantity, 0);

  return <main className="cart-page page-shell"><header className="route-header"><p className="eyebrow">SELECTED OBJECTS</p><h1>YOUR BAG <span>({cartProducts.length})</span></h1></header>
    {cartProducts.length === 0 ? <div className="empty-bag glass-panel"><p>Nothing is asking to be seen yet.</p><Link href="/shop" className="editorial-link">ENTER THE SHOP <span>↗</span></Link></div> : <div className="cart-layout">
      <div className="cart-lines">{cartProducts.map(({ product, quantity }) => <article className="cart-line" key={product.id}>
        <ProductVisual product={product} size="small" />
        <div><p className="eyebrow">{product.code}</p><h2>{product.name}</h2><p>{formatCurrency(product.priceUSD, currency)}</p></div>
        <div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button onClick={() => setQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>−</button><span>{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}>+</button></div>
        <button className="remove-button" onClick={() => removeFromCart(product.id)}>REMOVE</button>
      </article>)}</div>
      <aside className="bag-summary glass-panel"><p className="eyebrow">SUBTOTAL / {currency}</p><p className="summary-price">{formatCurrency(subtotal, currency)}</p><p>Taxes and shipping are calculated at checkout.</p><button className="add-button checkout-disabled" disabled>CHECKOUT ARRIVES IN MILESTONE 2</button></aside>
    </div>}</main>;
}
