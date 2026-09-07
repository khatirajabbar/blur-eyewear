"use client";

import { localeOptions } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { useBlurStore } from "@/store/blur-store";

const storefrontCurrencies = ["USD", "AZN"] as const;

export function StorefrontPreferences() {
  const { currency, locale, setCurrency, setLocale } = useBlurStore();
  const { t } = useTranslation();

  return (
    <div className="preference-controls">
      <label>
        <span className="sr-only">{t("preferences.currency")}</span>
        <select value={currency} onChange={(event) => setCurrency(event.target.value as typeof currency)} aria-label={t("preferences.currency")}>
          {storefrontCurrencies.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
      </label>
      <label>
        <span className="sr-only">{t("preferences.language")}</span>
        <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)} aria-label={t("preferences.language")}>
          {localeOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
        </select>
      </label>
    </div>
  );
}
