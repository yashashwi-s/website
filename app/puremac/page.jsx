import PureMacClient from "./puremac-client";
import { FaqJsonLd } from "./faq-section";
import { pureMacFaqs } from "./faq-data";
import { latestRelease, totalDownloads } from "@/lib/github-release";


export const metadata = {
  title: "PureMac: small, native macOS apps",
  description:
    "PureMac is Yashashwi Singhania's home for small, native macOS apps: Fadeo (automatic workflow audio) and Arras (photo widgets for your desktop). No subscriptions, open source.",
  metadataBase: new URL("https://puremac.yashashwi.me"),
  alternates: { canonical: "/" },
  twitter: {
    card: "summary",
    title: "PureMac: small, native macOS apps",
    description: "Discover Arras photo widgets and Fadeo workflow audio. Native, open-source Mac apps without subscriptions.",
  },
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
  // GitHub asset downloads are not unique users or installations.
  const [fadeo, arras, fadeoDl, arrasDl] = await Promise.all([
    latestRelease("Fadeo"),
    latestRelease("Arras"),
    totalDownloads("Fadeo"),
    totalDownloads("Arras"),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "@id": "https://puremac.yashashwi.me/#publisher", name: "PureMac", url: "https://puremac.yashashwi.me/", logo: "https://puremac.yashashwi.me/puremac/mark.svg", founder: { "@id": "https://yashashwi.me/#person" }, sameAs: ["https://github.com/yashashwi-s"] },
          { "@type": "Person", "@id": "https://yashashwi.me/#person", name: "Yashashwi Singhania", url: "https://yashashwi.me/" },
          { "@type": "WebSite", "@id": "https://puremac.yashashwi.me/#website", name: "PureMac", url: "https://puremac.yashashwi.me/", publisher: { "@id": "https://puremac.yashashwi.me/#publisher" } },
          { "@type": "CollectionPage", "@id": "https://puremac.yashashwi.me/#page", name: "PureMac apps", url: "https://puremac.yashashwi.me/", isPartOf: { "@id": "https://puremac.yashashwi.me/#website" }, mainEntity: { "@type": "ItemList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Arras", url: "https://arras.yashashwi.me/" },
            { "@type": "ListItem", position: 2, name: "Fadeo", url: "https://puremac.yashashwi.me/fadeo" },
          ] } },
        ],
      }).replace(/</g, "\\u003c") }} />
      <FaqJsonLd faqs={pureMacFaqs} />
      <PureMacClient
        fadeo={fadeo}
        arras={arras}
        downloads={{ fadeo: fadeoDl, arras: arrasDl }}
        faqs={pureMacFaqs}
      />
    </>
  );
}
