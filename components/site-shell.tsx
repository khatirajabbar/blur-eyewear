"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BlurMark } from "@/components/brand/blur-mark";
import { useAuth } from "@/components/auth/auth-provider";
import { StorefrontPreferences } from "@/components/storefront-preferences";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { useBlurStore } from "@/store/blur-store";

function CartIcon() {
  return (
    <svg className="cart-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M3.1 5.5h9.8l-.7 8H3.8l-.7-8Z" />
      <path d="M5.6 5.5V4.1a2.4 2.4 0 0 1 4.8 0v1.4" />
    </svg>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { cartCount } = useBlurStore();
  const { user, ready } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [menuOpenedFor, setMenuOpenedFor] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuOpen = menuOpenedFor === pathname;
  const closeMenu = () => setMenuOpenedFor(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpenedFor(null);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpenedFor(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <nav className="index-nav" aria-label="Main navigation">
          <BlurMark className="nav-mark" onClick={closeMenu} />
          <Link href="/cart" className="bag-link" onClick={closeMenu}>
            <TextShuffle text={t("nav.cart")} />
            <CartIcon />
            <span className="cart-count">{String(cartCount).padStart(2, "0")}</span>
          </Link>
          <div className="nav-links">
            <Link href="/shop" onClick={closeMenu}><TextShuffle text={t("nav.all")} /> <span>{String(products.length).padStart(2, "0")}</span></Link>
            <Link href="/film" onClick={closeMenu}><TextShuffle text={t("nav.film")} /></Link>
            <Link href="/about" onClick={closeMenu}><TextShuffle text={t("nav.info")} /></Link>
            <Link href="/account" onClick={closeMenu}><TextShuffle text={ready && user ? t("nav.account") : t("nav.signIn")} /></Link>
          </div>
          <div className="nav-preferences"><StorefrontPreferences /></div>
          <button className="menu-toggle" ref={menuButtonRef} type="button" onClick={() => setMenuOpenedFor(menuOpen ? null : pathname)} aria-expanded={menuOpen} aria-controls="mobile-menu"><TextShuffle text={t("nav.menu")} /></button>
        </nav>
        {menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
          <Link href="/shop" onClick={closeMenu}><TextShuffle text={t("nav.all")} /> {String(products.length).padStart(2, "0")}</Link>
          <Link href="/film" onClick={closeMenu}><TextShuffle text={t("nav.film")} /></Link>
          <Link href="/about" onClick={closeMenu}><TextShuffle text={t("nav.info")} /></Link>
          <Link href="/account" onClick={closeMenu}><TextShuffle text={ready && user ? t("nav.account") : t("nav.signIn")} /></Link>
          <Link href="/cart" className="mobile-cart-link" onClick={closeMenu}>
            <TextShuffle text={t("nav.cart")} />
            <CartIcon />
            <span className="mobile-cart-count">{String(cartCount).padStart(2, "0")}</span>
          </Link>
          <div className="mobile-preferences"><StorefrontPreferences /></div>
        </nav>}
      </header>
      {children}
    </>
  );
}
