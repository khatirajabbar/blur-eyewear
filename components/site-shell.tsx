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
            <Link href="/#objects">objects</Link>
            <Link href="/campaign">campaign</Link>
            <Link href="/about">about</Link>
          </div>
          <label className="currency-select">
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} aria-label="Select currency">
              {currencies.map((option) => <option key={option.code} value={option.code}>{option.code.toLowerCase()}</option>)}
            </select>
          </label>
          <Link href="/cart" className="bag-link">bag <span>{cartCount}</span></Link>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu">menu</button>
        </nav>
        {menuOpen && (
          <div className="mobile-menu glass-panel" id="mobile-menu">
            <Link href="/#objects" onClick={() => setMenuOpen(false)}>objects</Link>
            <Link href="/campaign" onClick={() => setMenuOpen(false)}>campaign</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
            <label className="mobile-currency">currency
              <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
                {currencies.map((option) => <option key={option.code} value={option.code}>{option.code.toLowerCase()} — {option.label}</option>)}
              </select>
            </label>
          </div>
        )}
      </header>
      {children}
    </>
  );
}
