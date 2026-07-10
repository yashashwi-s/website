import FadeoClient from "./fadeo-client";
import { latestRelease } from "@/lib/github-release";
import { promoState } from "@/lib/fadeo-promo";

export const metadata = {
  title: "Fadeo: the right sound for what you're doing",
  description:
    "Fadeo watches your workflow (the app in front, your desktop, whether you're in a meeting) and plays, fades, or switches audio automatically. Every rule is yours to define. Native macOS, open source, pay what you want ($2 minimum).",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  openGraph: {
    title: "Fadeo: the right sound for what you're doing",
    description: "Automatic, fully customizable workflow audio for macOS. Native, open source, pay what you want.",
    url: "https://puremac.yashashwi.me/fadeo",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
  },
};

export default async function FadeoPage() {
  const [release, promo] = await Promise.all([latestRelease("Fadeo"), promoState()]);
  // Real checkout once set; falls back to a mailto stopgap in the client otherwise.
  const paymentLink = process.env.STRIPE_PAYMENT_LINK || null;
  return <FadeoClient release={release} initialPromo={promo} paymentLink={paymentLink} />;
}
