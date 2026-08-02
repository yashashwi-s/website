import { Instrument_Serif } from "next/font/google";
import PureMacClient from "./puremac-client";
import { latestRelease } from "@/lib/github-release";

/* The index is the only page in the set set in a serif, and the only light one.
   Both product pages are dark grotesques, so this keeps the catalogue distinct
   from the things it catalogues. */
const indexDisplay = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-index",
  display: "swap",
  weight: "400",
});

export const metadata = {
  title: "PureMac: small, native macOS apps",
  description:
    "PureMac is Yashashwi Singhania's home for small, native macOS apps: Fadeo (automatic workflow audio) and Arras (photo widgets for your desktop). No subscriptions, open source.",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  openGraph: {
    title: "PureMac: small, native macOS apps",
    description: "Fadeo and Arras: native, open-source macOS apps. No subscriptions.",
    url: "https://puremac.yashashwi.me",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
  },
};

export default async function PureMacPage() {
  const [fadeo, arras] = await Promise.all([
    latestRelease("Fadeo"),
    latestRelease("Arras"),
  ]);

  return <PureMacClient fadeo={fadeo} arras={arras} fontClass={indexDisplay.variable} />;
}
