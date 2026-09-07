const videoIdPattern = /^[A-Za-z0-9_-]{6,}$/;

/**
 * Turns a normal YouTube share/watch URL into the privacy-enhanced embed URL.
 * Invalid URLs intentionally return null so the film page can keep its graceful
 * "final cut uploading" state instead of rendering an unsafe iframe.
 */
export function getYouTubeEmbedUrl(value?: string | null) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    let videoId: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "www.youtube-nocookie.com"
    ) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0] ?? "")) {
        videoId = parts[1] ?? null;
      } else {
        videoId = url.searchParams.get("v");
      }
    }

    if (!videoId || !videoIdPattern.test(videoId)) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  } catch {
    return null;
  }
}
