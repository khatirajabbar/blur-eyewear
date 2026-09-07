"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { useTranslation } from "@/hooks/use-translation";
import { getCopy } from "@/lib/i18n";
import { useBlurStore } from "@/store/blur-store";

type ConfirmationState =
  | { kind: "loading" }
  | { kind: "paid" }
  | { kind: "pending" }
  | { kind: "missing" }
  | { kind: "error"; message: string };

type CheckoutStatusResponse = {
  paid?: unknown;
  message?: unknown;
};

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart, hydrated } = useBlurStore();
  const { locale, t } = useTranslation();
  const clearedSessionRef = useRef<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ kind: "loading" });

  useEffect(() => {
    if (!sessionId) {
      queueMicrotask(() => setConfirmation({ kind: "missing" }));
      return;
    }

    let active = true;

    void Promise.resolve()
      .then(() => fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" }))
      .then(async (response) => {
        const body = await response.json().catch(() => null) as CheckoutStatusResponse | null;
        if (!active) return;

        if (!response.ok) {
          setConfirmation({
            kind: "error",
            message: typeof body?.message === "string" ? body.message : getCopy(locale, "cart.checkoutError"),
          });
          return;
        }

        setConfirmation(body?.paid === true ? { kind: "paid" } : { kind: "pending" });
      })
      .catch(() => {
        if (active) setConfirmation({ kind: "error", message: getCopy(locale, "cart.checkoutError") });
      });

    return () => {
      active = false;
    };
  }, [locale, sessionId]);

  useEffect(() => {
    if (confirmation.kind !== "paid" || !hydrated || !sessionId || clearedSessionRef.current === sessionId) return;
    clearedSessionRef.current = sessionId;
    queueMicrotask(clearCart);
  }, [clearCart, confirmation.kind, hydrated, sessionId]);

  const message = confirmation.kind === "paid"
    ? t("success.paid")
    : confirmation.kind === "missing"
      ? t("success.missing")
      : confirmation.kind === "error"
        ? confirmation.message
        : t("success.pending");

  return (
    <main className="success-page">
      <p className="eyebrow">{t("success.eyebrow")}</p>
      <h1>{t("success.title")}</h1>
      <p className={confirmation.kind === "error" ? "success-copy form-error" : "success-copy"} role={confirmation.kind === "error" ? "alert" : "status"}>{message}</p>
      <Link href="/shop" className="editorial-link"><TextShuffle text={t("success.return")} /> <span>↗</span></Link>
    </main>
  );
}
