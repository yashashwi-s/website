import PureMacClient from "./puremac-client";
import { latestRelease } from "@/lib/github-release";

export const metadata = {
  title: "PureMac: small, native macOS apps",
  description:
    "PureMac is Yashashwi Singhania's home for small, native macOS apps: Fadeo (automatic workflow audio) and Tableau (photo widgets for your desktop). No subscriptions, open source.",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  openGraph: {
    title: "PureMac: small, native macOS apps",
    description: "Fadeo and Tableau: native, open-source macOS apps. No subscriptions.",
    url: "https://puremac.yashashwi.me",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
  },
};

export default async function PureMacPage() {
  const [fadeo, tableau] = await Promise.all([
    latestRelease("Fadeo"),
    latestRelease("Tableau"),
  ]);

  return <PureMacClient fadeo={fadeo} tableau={tableau} />;
}
