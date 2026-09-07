"use client";

import { useTranslation } from "@/hooks/use-translation";

export function AboutContent() {
  const { t } = useTranslation();

  return (
    <main className="about-page">
      <section className="about-intro">
        <p className="eyebrow">{t("about.eyebrow")}</p>
        <h1>{t("about.title")}</h1>
        <p className="about-lede">{t("about.lede")}</p>
      </section>

      <section className="about-grid" aria-label={t("about.aria")}>
        <div>
          <p className="eyebrow">01 / {t("about.object")}</p>
          <p>{t("about.objectCopy")}</p>
        </div>
        <div>
          <p className="eyebrow">02 / {t("about.collection")}</p>
          <p>{t("about.collectionCopy")}</p>
        </div>
        <div>
          <p className="eyebrow">03 / {t("about.signal")}</p>
          <p>{t("about.signalCopy")}</p>
        </div>
      </section>

      <footer className="minimal-footer">
        <span>BLUR / 2026</span>
        <span>{t("about.footer")}</span>
      </footer>
    </main>
  );
}
