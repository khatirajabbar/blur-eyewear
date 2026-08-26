"use client";

import Link from "next/link";
import { useState } from "react";
import { BlurMark } from "@/components/brand/blur-mark";
import { currencies, type CurrencyCode } from "@/lib/currency";
import { useBlurStore } from "@/store/blur-store";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { currency, setCurrency, cartCount } = useBlurStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <nav className="glass-nav" aria-label="Main navigation">
          <BlurMark className="nav-mark" />
          <div className="nav-links">
            <Link href="/#objects">OBJECTS</Link>
            <Link href="/campaign">CAMPAIGN</Link>
            <Link href="/about">ABOUT</Link>
          </div>
          <label className="currency-select">
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} aria-label="Select currency">
              {currencies.map((option) => <option key={option.code} value={option.code}>{option.code}</option>)}
            </select>
          </label>
          <Link href="/cart" className="bag-link">BAG <span>({cartCount})</span></Link>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu">MENU</button>
        </nav>
        {menuOpen && (
          <div className="mobile-menu glass-panel" id="mobile-menu">
            <Link href="/#objects" onClick={() => setMenuOpen(false)}>OBJECTS</Link>
            <Link href="/campaign" onClick={() => setMenuOpen(false)}>CAMPAIGN</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
            <label className="mobile-currency">CURRENCY
              <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
                {currencies.map((option) => <option key={option.code} value={option.code}>{option.code} — {option.label}</option>)}
              </select>
            </label>
          </div>
        )}
      </header>
      {children}
    </>
  );
}
