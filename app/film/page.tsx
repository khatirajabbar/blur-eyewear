import type { Metadata } from "next";
import { FilmPage } from "@/components/campaign/film-page";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const defaultCampaignFilm = "https://www.youtube.com/watch?v=Bl-OYCtsvmc";

export const metadata: Metadata = {
  title: "Film 01 — BLUR",
  description: "Watch BLUR Collection 01 in motion.",
};

export default function FilmRoute() {
  // The uploaded campaign film is the live default. An environment value can
  // still replace it later without another source-code change.
  const embedUrl = getYouTubeEmbedUrl(process.env.NEXT_PUBLIC_CAMPAIGN_YOUTUBE_URL ?? defaultCampaignFilm);
  return <FilmPage embedUrl={embedUrl} />;
}
