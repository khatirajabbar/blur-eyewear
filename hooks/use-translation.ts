"use client";

import { getCopy, type CopyKey } from "@/lib/i18n";
import { useBlurStore } from "@/store/blur-store";

export function useTranslation() {
  const { locale } = useBlurStore();

  return {
    locale,
    t: (key: CopyKey) => getCopy(locale, key),
  };
}
