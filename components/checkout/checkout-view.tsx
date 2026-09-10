"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { BlurMark } from "@/components/brand/blur-mark";
import { ProductVisual } from "@/components/product/product-visual";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { products } from "@/data/products";
import { useTranslation } from "@/hooks/use-translation";
import { getCheckoutContent, policyIds, type PolicyId } from "@/lib/checkout-content";
import { formatCurrency } from "@/lib/currency";
import { useBlurStore } from "@/store/blur-store";

type CheckoutResponse = {
  url?: unknown;
  message?: unknown;
};

function PolicyLinks() {
  const { locale } = useTranslation();
  const content = getCheckoutContent(locale);
  const [activePolicy, setActivePolicy] = useState<PolicyId | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closePolicy = () => {
    setActivePolicy(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!activePolicy) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePolicy();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePolicy]);

  const policy = activePolicy ? content.policies[activePolicy] : null;

  return (
    <>
      <footer className="checkout-policy-links">
        <span>{content.checkout.policiesHint}</span>
        {policyIds.map((policyId) => (
          <button
            className="policy-link"
            key={policyId}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActivePolicy(policyId);
            }}
            type="button"
          >
            {content.policies[policyId].label}
          </button>
        ))}
      </footer>

      {policy && (
        <div
          className="policy-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closePolicy();
          }}
        >
          <section aria-labelledby="policy-title" aria-modal="true" className="policy-sheet" role="dialog">
            <header className="policy-sheet-header">
              <div>
                <p className="eyebrow">{content.checkout.demoEyebrow}</p>
                <h2 id="policy-title">{policy.title}</h2>
              </div>
              <button aria-label={content.checkout.close} autoFocus className="policy-close" onClick={closePolicy} type="button">×</button>
            </header>
            <p className="policy-lead">{policy.lead}</p>
            <div className="policy-sections">
              {policy.sections.map((section) => (
                <div key={section.label}>
                  <h3>{section.label}</h3>
                  <p>{section.copy}</p>
                </div>
              ))}
            </div>
            <p className="policy-notice">{content.checkout.demoNotice}</p>
          </section>
        </div>
      )}
    </>
  );
}

function CheckoutHeader({ backLabel }: { backLabel: string }) {
  return (
    <header className="checkout-header">
      <BlurMark className="checkout-mark" />
      <Link className="checkout-back" href="/cart">← {backLabel}</Link>
    </header>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const { cart, cartCount, currency } = useBlurStore();
  const { configured, ready, user } = useAuth();
  const { locale, t } = useTranslation();
  const content = getCheckoutContent(locale).checkout;
  const [isOpeningPayment, setIsOpeningPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const cartProducts = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((total, item) => total + item.product.priceUSD * item.quantity, 0);

  const openPayment = async () => {
    setCheckoutError("");

    if (!configured) {
      setCheckoutError(content.accountUnavailable);
      return;
    }

    if (!ready) return;

    if (!user) {
      router.push("/account?next=/checkout");
      return;
    }

    setIsOpeningPayment(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const result = await response.json().catch(() => null) as CheckoutResponse | null;

      if (!response.ok || typeof result?.url !== "string") {
        throw new Error(typeof result?.message === "string" ? result.message : t("cart.checkoutError"));
      }

      window.location.assign(result.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : t("cart.checkoutError"));
      setIsOpeningPayment(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <main className="checkout-page">
        <CheckoutHeader backLabel={content.backToCart} />
        <section className="checkout-empty">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.empty}</h1>
          <p>{content.emptyCopy}</p>
          <Link className="checkout-secondary" href="/shop"><TextShuffle text={content.returnToShop} /> ↗</Link>
        </section>
        <PolicyLinks />
      </main>
    );
  }

  const paymentLabel = isOpeningPayment
    ? content.paymentLoading
    : !ready
      ? content.accountLoading
      : !configured
        ? content.accountUnavailable
        : !user
          ? content.signIn
          : content.paymentButton;

  return (
    <main className="checkout-page">
      <CheckoutHeader backLabel={content.backToCart} />

      <section className="checkout-intro">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </section>

      <div className="checkout-layout">
        <section className="checkout-steps" aria-label={content.title}>
          <section className="checkout-step">
            <div className="checkout-step-heading"><span>01</span><h2>{content.account}</h2></div>
            {!ready ? (
              <p className="checkout-state">{content.accountLoading}</p>
            ) : user ? (
              <div className="checkout-account">
                <p><span>{content.signedInAs}</span>{user.email ?? "—"}</p>
                <Link className="text-link" href="/account">{content.changeAccount} ↗</Link>
              </div>
            ) : configured ? (
              <div>
                <p className="checkout-copy">{content.accountCopy}</p>
                <Link className="checkout-secondary" href="/account?next=/checkout">{content.signIn} ↗</Link>
              </div>
            ) : (
              <p className="checkout-copy">{content.accountUnavailable}</p>
            )}
          </section>

          <section className="checkout-step">
            <div className="checkout-step-heading"><span>02</span><h2>{content.delivery}</h2></div>
            <p className="checkout-copy">{content.deliveryCopy}</p>
          </section>

          <section className="checkout-step">
            <div className="checkout-step-heading"><span>03</span><h2>{content.payment}</h2></div>
            <p className="checkout-copy">{content.paymentCopy}</p>
            <p className="checkout-note">{content.paymentNote}</p>
            {checkoutError && <p className="form-error checkout-form-error" role="alert">{checkoutError}</p>}
            <button className="checkout-action" disabled={!configured || !ready || isOpeningPayment} onClick={openPayment} type="button">
              <TextShuffle text={paymentLabel} />
            </button>
          </section>
        </section>

        <aside className="checkout-summary">
          <div className="checkout-summary-heading">
            <p className="eyebrow">{content.order}</p>
            <span>{String(cartCount).padStart(2, "0")}</span>
          </div>
          <div className="checkout-items">
            {cartProducts.map(({ product, quantity }) => (
              <article className="checkout-item" key={product.id}>
                <div className="checkout-item-visual">
                  <ProductVisual product={product} />
                  <span>{quantity}</span>
                </div>
                <div>
                  <p className="eyebrow">{product.code}</p>
                  <h2>{product.name}</h2>
                  <p>{quantity} × {formatCurrency(product.priceUSD, currency)}</p>
                </div>
                <p className="checkout-item-price">{formatCurrency(product.priceUSD * quantity, currency)}</p>
              </article>
            ))}
          </div>
          <dl className="checkout-totals">
            <div><dt>{content.subtotal}</dt><dd>{formatCurrency(subtotal, currency)}</dd></div>
            <div><dt>{content.shipping}</dt><dd>{content.shippingValue}</dd></div>
            <div><dt>{content.total}</dt><dd>{formatCurrency(subtotal, currency)}</dd></div>
          </dl>
          <p className="checkout-currency-note">{t("cart.currencyNote")}</p>
        </aside>
      </div>

      <PolicyLinks />
    </main>
  );
}
