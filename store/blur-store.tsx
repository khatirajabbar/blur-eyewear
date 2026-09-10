"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import { currencies, type CurrencyCode } from "@/lib/currency";
import { locales, type CopyKey, type LocaleCode } from "@/lib/i18n";

export type CartItem = { productId: string; quantity: number };
export type StoreToast = { id: number; productId?: string; messageKey?: CopyKey };

type BlurStore = {
  cart: CartItem[];
  currency: CurrencyCode;
  locale: LocaleCode;
  hydrated: boolean;
  toast: StoreToast | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setLocale: (locale: LocaleCode) => void;
  clearCart: () => void;
  showToast: (messageKey: CopyKey) => void;
  dismissToast: () => void;
  cartCount: number;
};

const BlurStoreContext = createContext<BlurStore | null>(null);
const storageKey = "blur-store-v1";
const productById = new Map(products.map((product) => [product.id, product]));

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isCurrencyCode = (value: unknown): value is CurrencyCode => typeof value === "string" && currencies.some((currency) => currency.code === value);
const isLocaleCode = (value: unknown): value is LocaleCode => typeof value === "string" && locales.some((locale) => locale === value);

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
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<StoreToast | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isRecord(parsed)) {
            setCart(normalizeCart(parsed.cart));
            if (isCurrencyCode(parsed.currency)) setCurrency(parsed.currency);
            if (isLocaleCode(parsed.locale)) setLocale(parsed.locale);
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
      window.localStorage.setItem(storageKey, JSON.stringify({ cart, currency, locale }));
    } catch {
      // Keep the current session usable if the browser refuses to write storage.
    }
  }, [cart, currency, locale, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<BlurStore>(() => ({
    cart,
    currency,
    locale,
    hydrated,
    toast,
    addToCart: (productId) => {
      const product = productById.get(productId);
      const quantityInCart = cart.find((item) => item.productId === productId)?.quantity ?? 0;
      if (!product || product.inventory <= quantityInCart) return;

      setCart((current) => {
        const found = current.find((item) => item.productId === productId);
        if (!found) return [...current, { productId, quantity: 1 }];

        const nextQuantity = Math.min(found.quantity + 1, product.inventory);
        return nextQuantity === found.quantity
          ? current
          : current.map((item) => item.productId === productId ? { ...item, quantity: nextQuantity } : item);
      });
      setToast({ id: Date.now(), productId });
    },
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
    setLocale,
    clearCart: () => setCart([]),
    showToast: (messageKey) => setToast({ id: Date.now(), messageKey }),
    dismissToast: () => setToast(null),
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
  }), [cart, currency, hydrated, locale, toast]);

  return <BlurStoreContext.Provider value={value}>{children}</BlurStoreContext.Provider>;
}

export function useBlurStore() {
  const store = useContext(BlurStoreContext);
  if (!store) throw new Error("useBlurStore must be used within BlurStoreProvider");
  return store;
}
