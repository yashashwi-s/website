import { Instrument_Serif } from "next/font/google";
import PureMacClient from "./puremac-client";
import { latestRelease, totalDownloads } from "@/lib/github-release";

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
  // Download totals are real numbers off the GitHub releases API, revalidated
  // hourly by the helper. Worth showing: an index of two apps is otherwise a
  // static page, and "how many people actually run this" is the honest stat.
  // Every call degrades to null on failure, so the UI just omits the figure.
  const [fadeo, arras, fadeoDl, arrasDl] = await Promise.all([
    latestRelease("Fadeo"),
    latestRelease("Arras"),
    totalDownloads("Fadeo"),
    totalDownloads("Arras"),
  ]);

  return (
    <PureMacClient
      fadeo={fadeo}
      arras={arras}
      downloads={{ fadeo: fadeoDl, arras: arrasDl }}
      fontClass={indexDisplay.variable}
    />
  );
}
