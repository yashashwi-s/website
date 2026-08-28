import { Bricolage_Grotesque } from "next/font/google";
import ArrasClient from "./arras-client";
import { FaqJsonLd } from "../faq-section";
import { arrasFaqs } from "../faq-data";
import { latestRelease, totalDownloads } from "@/lib/github-release";

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

const SITE_URL = "https://puremac.yashashwi.me";
const ARRAS_URL = `${SITE_URL}/arras`;
const CONTENT_UPDATED_AT = "2026-08-28";
const TITLE = "macOS Desktop Photo Widget: Arras, Free Native App";
const DESCRIPTION =
  "macOS desktop photo widget Arras preserves every image's true aspect ratio. Free, native, open source, about 20 MB, and near-zero idle CPU.";
const OG_IMAGE = "/puremac/arras/demo-poster.jpg";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
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
    url: ARRAS_URL,
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

function ArrasJsonLd({ release, downloads, dateModified }) {
  const downloadUrl = release?.dmg ?? release?.zip ?? "https://github.com/yashashwi-s/Arras/releases/latest";
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${ARRAS_URL}#page`,
      url: ARRAS_URL,
      name: TITLE,
      description: DESCRIPTION,
      dateModified,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${ARRAS_URL}#software` },
      breadcrumb: { "@id": `${ARRAS_URL}#breadcrumb` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "PureMac",
      publisher: { "@id": `${SITE_URL}/#publisher` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#publisher`,
      name: "PureMac",
      url: `${SITE_URL}/`,
      founder: { "@id": "https://yashashwi.me/#person" },
      sameAs: ["https://github.com/yashashwi-s"],
    },
    {
      "@type": "Person",
      "@id": "https://yashashwi.me/#person",
      name: "Yashashwi Singhania",
      url: "https://yashashwi.me/",
      sameAs: ["https://github.com/yashashwi-s"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${ARRAS_URL}#software`,
      name: "Arras",
      alternateName: ["Tableau", "Photo Widget OSX"],
      description: DESCRIPTION,
      url: ARRAS_URL,
      downloadUrl,
      softwareVersion: release?.tag ?? undefined,
      releaseNotes: release?.url ?? "https://github.com/yashashwi-s/Arras/releases",
      dateModified,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: "macOS desktop photo widget",
      operatingSystem: "macOS 14 or later on Apple Silicon",
      fileSize: "2.4 MB",
      memoryRequirements: "Approximately 20 MB while idle",
      isAccessibleForFree: true,
      license: "https://github.com/yashashwi-s/Arras/blob/main/LICENSE",
      codeRepository: "https://github.com/yashashwi-s/Arras",
      screenshot: `${SITE_URL}${OG_IMAGE}`,
      image: `${SITE_URL}/puremac/arras-icon.png`,
      author: { "@id": "https://yashashwi.me/#person" },
      publisher: { "@id": `${SITE_URL}/#publisher` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: downloadUrl,
      },
      featureList: [
        "Preserves each image's source aspect ratio",
        "Pastes, imports, captures, and rotates desktop photos",
        "Layers photos around desktop icons, widgets, and applications",
        "Uses effectively zero CPU while idle",
        "Requires no account and collects no telemetry",
      ],
      ...(downloads?.total > 0
        ? {
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/DownloadAction",
              userInteractionCount: downloads.total,
            },
          }
        : {}),
    },
    {
      "@type": "HowTo",
      "@id": `${ARRAS_URL}#install-howto`,
      name: "How to install Arras on a Mac with Homebrew",
      description: "Install the free Arras desktop photo widget and clear macOS quarantine for its ad-hoc signed build.",
      totalTime: "PT2M",
      supply: [{ "@type": "HowToSupply", name: "Apple Silicon Mac running macOS 14 or later" }],
      tool: [{ "@type": "HowToTool", name: "Homebrew" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add the Arras Homebrew tap",
          text: "Run brew tap yashashwi-s/tap in Terminal.",
          url: `${ARRAS_URL}#install`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Install the Arras cask",
          text: "Run brew install --cask arras in Terminal.",
          url: `${ARRAS_URL}#install`,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Clear the quarantine attribute",
          text: "Run xattr -dr com.apple.quarantine /Applications/Arras.app, then open Arras.",
          url: `${ARRAS_URL}#install`,
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ARRAS_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "PureMac",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Arras",
          item: ARRAS_URL,
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
          /</g,
          "\\u003c"
        ),
      }}
    />
  );
}

export default async function ArrasPage() {
  // Renamed from Tableau in v2.3.1. GitHub redirects the old API path, but
  // asking for the current name keeps this working if that ever stops.
  const [release, downloads] = await Promise.all([
    latestRelease("Arras"),
    totalDownloads("Arras"),
  ]);
  const dateModified = new Date(
    Math.max(Date.parse(CONTENT_UPDATED_AT), Date.parse(release?.publishedAt ?? "1970-01-01"))
  ).toISOString().slice(0, 10);

  return (
    <>
      <ArrasJsonLd release={release} downloads={downloads} dateModified={dateModified} />
      <FaqJsonLd faqs={arrasFaqs} />
      <ArrasClient
        release={release}
        downloads={downloads}
        dateModified={dateModified}
        faqs={arrasFaqs}
        fontClass={display.variable}
      />
    </>
  );
}
