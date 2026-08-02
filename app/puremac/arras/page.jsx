import { Bricolage_Grotesque } from "next/font/google";
import ArrasClient from "./arras-client";
import { latestRelease } from "@/lib/github-release";

/* The site-wide face is Nunito, which is rounded and friendly and reads as
   soft at display sizes. This page is carried almost entirely by very large
   type, so it gets a grotesque with actual edges. Scoped to this route only —
   the rest of the portfolio is untouched. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

const TITLE = "Arras — your photos on your desktop, not squares";
const DESCRIPTION =
  "macOS gives desktop widgets four fixed sizes and crops whatever you put in them. Arras gives every photo its own window at its own proportions. Free, native, open source.";
const OG_IMAGE = "/puremac/arras/demo-poster.jpg";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://puremac.yashashwi.me"),
  alternates: { canonical: "/arras" },
  // Two renames deep, so the old names stay searchable.
  keywords: [
    "Arras",
    "Tableau macOS",
    "Photo Widget OSX",
    "macOS desktop photo widget",
    "desktop widget aspect ratio",
    "free mac app",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://puremac.yashashwi.me/arras",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1470, height: 956, alt: "Arras widgets on a macOS desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function ArrasPage() {
  // Renamed from Tableau in v2.3.1. GitHub redirects the old API path, but
  // asking for the current name keeps this working if that ever stops.
  const release = await latestRelease("Arras");
  return <ArrasClient release={release} fontClass={display.variable} />;
}
