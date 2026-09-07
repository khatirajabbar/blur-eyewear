import type { Metadata } from "next";
import { FilmPage } from "@/components/campaign/film-page";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Film 01 — BLUR",
  description: "Watch BLUR Collection 01 in motion.",
};

export default function FilmRoute() {
  const embedUrl = getYouTubeEmbedUrl(process.env.NEXT_PUBLIC_CAMPAIGN_YOUTUBE_URL);
  return <FilmPage embedUrl={embedUrl} />;
}
