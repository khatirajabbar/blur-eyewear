"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CurrencyCode } from "@/lib/currency";

export type CartItem = { productId: string; quantity: number };

type BlurStore = {
  cart: CartItem[];
  currency: CurrencyCode;
  hydrated: boolean;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
  cartCount: number;
};

const BlurStoreContext = createContext<BlurStore | null>(null);
const storageKey = "blur-store-v1";

export function BlurStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<Pick<BlurStore, "cart" | "currency">>;
          if (Array.isArray(parsed.cart)) setCart(parsed.cart);
          if (parsed.currency) setCurrency(parsed.currency);
        }
      } catch {
        // A visual storefront should still work when browser storage is unavailable.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify({ cart, currency }));
  }, [cart, currency, hydrated]);

  const value = useMemo<BlurStore>(() => ({
    cart,
    currency,
    hydrated,
    addToCart: (productId) => setCart((current) => {
      const found = current.find((item) => item.productId === productId);
      return found
        ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { productId, quantity: 1 }];
    }),
    removeFromCart: (productId) => setCart((current) => current.filter((item) => item.productId !== productId)),
    setQuantity: (productId, quantity) => setCart((current) => quantity <= 0
      ? current.filter((item) => item.productId !== productId)
      : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    setCurrency,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  }), [cart, currency, hydrated]);

  return <BlurStoreContext.Provider value={value}>{children}</BlurStoreContext.Provider>;
}

export function useBlurStore() {
  const store = useContext(BlurStoreContext);
  if (!store) throw new Error("useBlurStore must be used within BlurStoreProvider");
  return store;
}
