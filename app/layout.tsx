import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "BLUR — Objects for perception",
  description: "BLUR is a fictional experimental eyewear project. Sculptural objects for the space between seeing and being seen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth"><body><AppProviders>{children}</AppProviders></body></html>;
}
