"use client";

import type { ChangeEvent } from "react";
import { localeOptions } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { useBlurStore } from "@/store/blur-store";

const storefrontCurrencies = ["USD", "AZN"] as const;

export function StorefrontPreferences() {
  const { currency, locale, setCurrency, setLocale } = useBlurStore();
  const { t } = useTranslation();

  const changeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
    const select = event.currentTarget;
    setCurrency(select.value as typeof currency);
    select.blur();
  };

  const changeLocale = (event: ChangeEvent<HTMLSelectElement>) => {
    const select = event.currentTarget;
    setLocale(select.value as typeof locale);
    select.blur();
  };

  return (
    <div className="preference-controls">
      <label>
        <span className="sr-only">{t("preferences.currency")}</span>
        <select value={currency} onChange={changeCurrency} aria-label={t("preferences.currency")}>
          {storefrontCurrencies.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
      </label>
      <label>
        <span className="sr-only">{t("preferences.language")}</span>
        <select value={locale} onChange={changeLocale} aria-label={t("preferences.language")}>
          {localeOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
        </select>
      </label>
    </div>
  );
}
