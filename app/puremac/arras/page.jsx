import ArrasClient from "./arras-client";
import { latestRelease } from "@/lib/github-release";

export const metadata = {
  title: "Arras: any photo, perfectly fitted on your desktop",
  description:
    "Arras places photos directly on your desktop as borderless, always-on overlays that match each image's real aspect ratio. No cropping, no black bars. Native macOS, free and open source.",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  openGraph: {
    title: "Arras: any photo, perfectly fitted on your desktop",
    description: "Borderless desktop photo widgets that keep every image's real aspect ratio. Free, native, open source.",
    url: "https://puremac.yashashwi.me/arras",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
  },
};

export default async function ArrasPage() {
  const release = await latestRelease("Tableau");
  return <ArrasClient release={release} />;
}
