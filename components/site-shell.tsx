"use client";

import Link from "next/link";
import { useState } from "react";
import { BlurMark } from "@/components/brand/blur-mark";
import { products } from "@/data/products";
import { useBlurStore } from "@/store/blur-store";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { cartCount } = useBlurStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <nav className="index-nav" aria-label="Main navigation">
          <BlurMark className="nav-mark" />
          <Link href="/cart" className="bag-link">bag <span>{String(cartCount).padStart(2, "0")}</span></Link>
          <div className="nav-links">
            <Link href="/shop">all <span>{String(products.length).padStart(2, "0")}</span></Link>
            <Link href="/about">about</Link>
          </div>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu">menu</button>
        </nav>
        {menuOpen && <div className="mobile-menu" id="mobile-menu">
          <Link href="/shop" onClick={() => setMenuOpen(false)}>all {String(products.length).padStart(2, "0")}</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>bag {String(cartCount).padStart(2, "0")}</Link>
        </div>}
      </header>
      {children}
    </>
  );
}
