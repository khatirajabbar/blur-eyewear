import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://blur-eyewear.vercel.app"),
  title: "BLUR — Collection 01",
  description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "BLUR — Collection 01",
    description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
    images: [{
      url: "/share-card.png",
      width: 3840,
      height: 2160,
      alt: "BLUR Collection 01 — eyewear characters",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLUR — Collection 01",
    description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
    images: ["/share-card.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth"><body><AppProviders>{children}</AppProviders></body></html>;
}
