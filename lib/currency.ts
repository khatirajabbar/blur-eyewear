export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "AED" | "AZN";

export type Currency = {
  code: CurrencyCode;
  label: string;
  rate: number;
  locale: string;
  fractionDigits?: number;
};

// Deliberately manual demo rates. Update here before any real storefront launch.
export const currencies: Currency[] = [
  { code: "USD", label: "US Dollar", rate: 1, locale: "en-US" },
  { code: "EUR", label: "Euro", rate: 0.92, locale: "de-DE" },
  { code: "GBP", label: "British Pound", rate: 0.79, locale: "en-GB" },
  { code: "CAD", label: "Canadian Dollar", rate: 1.36, locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", rate: 1.51, locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen", rate: 151, locale: "ja-JP", fractionDigits: 0 },
  { code: "AED", label: "UAE Dirham", rate: 3.67, locale: "en-AE" },
  { code: "AZN", label: "Azerbaijani Manat", rate: 1.7, locale: "az-AZ" },
];

export const getCurrency = (code: CurrencyCode) => currencies.find((currency) => currency.code === code) ?? currencies[0];

export function formatCurrency(priceUSD: number, code: CurrencyCode) {
  const currency = getCurrency(code);
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: currency.fractionDigits ?? 2,
  }).format(priceUSD * currency.rate);
}
