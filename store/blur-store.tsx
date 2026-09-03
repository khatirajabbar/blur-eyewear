"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import { currencies, type CurrencyCode } from "@/lib/currency";

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
const productById = new Map(products.map((product) => [product.id, product]));

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isCurrencyCode = (value: unknown): value is CurrencyCode => typeof value === "string" && currencies.some((currency) => currency.code === value);

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const quantities = new Map<string, number>();

  for (const candidate of value) {
    if (!isRecord(candidate)) continue;

    const { productId, quantity } = candidate;
    if (typeof productId !== "string" || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity <= 0) continue;

    const product = productById.get(productId);
    if (!product) continue;

    const currentQuantity = quantities.get(productId) ?? 0;
    quantities.set(productId, Math.min(currentQuantity + quantity, product.inventory));
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity })).filter((item) => item.quantity > 0);
}

export function BlurStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isRecord(parsed)) {
            setCart(normalizeCart(parsed.cart));
            if (isCurrencyCode(parsed.currency)) setCurrency(parsed.currency);
          }
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
    if (!hydrated) return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ cart, currency }));
    } catch {
      // Keep the current session usable if the browser refuses to write storage.
    }
  }, [cart, currency, hydrated]);

  const value = useMemo<BlurStore>(() => ({
    cart,
    currency,
    hydrated,
    addToCart: (productId) => setCart((current) => {
      const product = productById.get(productId);
      if (!product || product.inventory <= 0) return current;

      const found = current.find((item) => item.productId === productId);
      if (!found) return [...current, { productId, quantity: 1 }];

      const nextQuantity = Math.min(found.quantity + 1, product.inventory);
      return nextQuantity === found.quantity
        ? current
        : current.map((item) => item.productId === productId ? { ...item, quantity: nextQuantity } : item);
    }),
    removeFromCart: (productId) => setCart((current) => current.filter((item) => item.productId !== productId)),
    setQuantity: (productId, quantity) => setCart((current) => {
      const product = productById.get(productId);
      if (!product) return current.filter((item) => item.productId !== productId);

      const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
      const nextQuantity = Math.min(Math.max(safeQuantity, 0), product.inventory);

      return nextQuantity === 0
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) => item.productId === productId ? { ...item, quantity: nextQuantity } : item);
    }),
    setCurrency,
    // The bag badge counts distinct frames; each line still keeps its own quantity.
    cartCount: cart.length,
  }), [cart, currency, hydrated]);

  return <BlurStoreContext.Provider value={value}>{children}</BlurStoreContext.Provider>;
}

export function useBlurStore() {
  const store = useContext(BlurStoreContext);
  if (!store) throw new Error("useBlurStore must be used within BlurStoreProvider");
  return store;
}
