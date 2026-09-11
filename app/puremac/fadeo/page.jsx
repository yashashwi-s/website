import { Space_Grotesk } from "next/font/google";
import FadeoClient from "./fadeo-client";
import { macProducts } from "@/data/mac-products";
import { FaqJsonLd } from "../faq-section";
import { fadeoFaqs } from "../faq-data";
import { latestRelease } from "@/lib/github-release";
import { promoState } from "@/lib/fadeo-promo";

/* Each PureMac page gets its own face so the three read as separate products
   rather than one template. Arras uses Bricolage Grotesque, the index uses
   Instrument Serif, and Fadeo gets Space Grotesk — squarer and more instrument-
   panel, which suits an app that is mostly rules and numbers. */
const fadeoDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-fadeo",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Fadeo: the right sound for what you're doing",
  description:
    "Fadeo watches your workflow (the app in front, your desktop, whether you're in a meeting) and plays, fades, or switches audio automatically. Every rule is yours to define. Native macOS, open source, pay what you want ($2 minimum).",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  alternates: { canonical: "/fadeo" },
  twitter: {
    card: "summary_large_image",
    images: ["https://puremac.yashashwi.me/puremac/fadeo/screenshot-workspaces.png"],
    title: "Fadeo: automatic workflow audio for Mac",
    description: "Set your own rules for audio that follows your apps, Spaces, and meetings. Native macOS software, free to use with an optional lifetime license.",
  },
  openGraph: {
    title: "Fadeo: the right sound for what you're doing",
    description: "Automatic, fully customizable workflow audio for macOS. Native, open source, pay what you want.",
    url: "https://puremac.yashashwi.me/fadeo",
    siteName: "PureMac",
    locale: "en_US",
    type: "website",
    images: [{ url: "/puremac/fadeo/screenshot-workspaces.png", width: 1800, height: 1264, alt: "Fadeo workspace settings on macOS" }],
  },
};

export default async function FadeoPage() {
  const [release, promo] = await Promise.all([latestRelease("Fadeo"), promoState()]);
  // Real checkout once either is set; falls back to a mailto stopgap in the client
  // otherwise. Gumroad checked first since it's the active provider; Stripe stays wired
  // for whenever/if that becomes available.
  const paymentLink = process.env.GUMROAD_PRODUCT_URL || process.env.STRIPE_PAYMENT_LINK || null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication", "@id": `${macProducts.fadeo.url}#software`,
        name: "Fadeo", url: macProducts.fadeo.url, applicationCategory: "MultimediaApplication", operatingSystem: macProducts.fadeo.operatingSystem,
        description: "Native, rule-driven workflow audio for macOS. Free to use with an optional lifetime license.",
        isAccessibleForFree: true, license: macProducts.fadeo.licenseUrl, codeRepository: macProducts.fadeo.repo,
        softwareVersion: release?.tag, downloadUrl: release?.dmg ?? release?.zip ?? `${macProducts.fadeo.repo}/releases/latest`,
        author: { "@type": "Person", "@id": "https://yashashwi.me/#person", name: "Yashashwi Singhania", url: "https://yashashwi.me/" },
        publisher: { "@type": "Organization", "@id": "https://puremac.yashashwi.me/#publisher", name: "PureMac", url: "https://puremac.yashashwi.me/" },
      }).replace(/</g, "\\u003c") }} />
      <FaqJsonLd faqs={fadeoFaqs} />
      <FadeoClient
        release={release}
        initialPromo={promo}
        paymentLink={paymentLink}
        faqs={fadeoFaqs}
        fontClass={fadeoDisplay.variable}
      />
    </>
  );
}
