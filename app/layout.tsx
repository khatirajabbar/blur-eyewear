import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://blur-eyewear-git-main-khatira.vercel.app"),
  title: "BLUR — Collection 01",
  description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
  openGraph: {
    title: "BLUR — Collection 01",
    description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "BLUR Collection 01" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLUR — Collection 01",
    description: "Eleven optical characters. Sculptural eyewear seen through a series of full-body looks.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth"><body><AppProviders>{children}</AppProviders></body></html>;
}
