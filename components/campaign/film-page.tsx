"use client";

import Link from "next/link";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { useTranslation } from "@/hooks/use-translation";

type FilmPageProps = {
  embedUrl: string | null;
};

export function FilmPage({ embedUrl }: FilmPageProps) {
  const { t } = useTranslation();

  return (
    <main className="film-page">
      <section className="film-intro">
        <p className="eyebrow">{t("film.eyebrow")}</p>
        <h1>{t("film.title")}</h1>
        <p>{t("film.copy")}</p>
      </section>

      <section className="film-player" aria-label="BLUR campaign film">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="BLUR Campaign Film"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="film-waiting" role="status">
            <span>FILM 01</span>
            <div>
              <h2>{t("film.waiting")}</h2>
              <p>{t("film.waitingCopy")}</p>
            </div>
          </div>
        )}
      </section>

      <footer className="film-footer minimal-footer">
        <Link href="/shop"><TextShuffle text={t("film.shop")} /> ↗</Link>
        <span>BLUR / FILM 01</span>
      </footer>
    </main>
  );
}
