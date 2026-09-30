import ArrasClient from "./arras-client";
import { getImageProps } from "next/image";
import {
  arrasCanonicalUrl,
  arrasProduct,
  summarizeArrasProduct,
} from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasLinks } from "./arras-links";
import { latestRelease, totalDownloads } from "@/lib/github-release";
import { getArrasInstallation } from "@/lib/arras-installation.mjs";

const SITE_URL = arrasCanonicalUrl;
const ARRAS_URL = SITE_URL;
const OFFICIAL_DMG_URL = `${arrasProduct.repositoryUrl}/releases/latest/download/Arras.dmg`;
const CONTENT_UPDATED_AT = "2026-09-30";
const TITLE = "Arras — Free Mac Photo Widgets Without Forced Cropping";
const DESCRIPTION =
  "Put photos on your Mac desktop at their original aspect ratio. Arras is a free, native, open-source photo widget with no telemetry.";
const OG_IMAGE = "/puremac/arras/demo-poster.jpg";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    siteName: arrasProduct.name,
    locale: "en_US",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1470, height: 956, alt: "Arras widgets on a macOS desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: "Arras photo widgets arranged on a macOS desktop" }],
  },
};

function ArrasJsonLd({ release, downloads, dateModified, product }) {
  const summary = summarizeArrasProduct(product);
  const installation = getArrasInstallation(product);
  const downloadUrl = OFFICIAL_DMG_URL;
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
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: product.name,
      publisher: { "@id": "https://yashashwi.me/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://yashashwi.me/#person",
      name: product.publisher.name,
      url: product.publisher.url,
      sameAs: ["https://github.com/yashashwi-s"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${ARRAS_URL}#software`,
      name: product.name,
      alternateName: product.historicalNames,
      identifier: {
        "@type": "PropertyValue",
        propertyID: "macOS bundle identifier",
        value: product.bundleIdentifier,
      },
      sameAs: [product.repositoryUrl],
      description: DESCRIPTION,
      url: ARRAS_URL,
      downloadUrl,
      softwareVersion: release?.tag ?? undefined,
      releaseNotes: release?.url ?? `${product.repositoryUrl}/releases`,
      dateModified,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: product.category,
      processorRequirements: summary.publicArchitectures.join(" or "),
      operatingSystem: summary.operatingSystem,
      isAccessibleForFree: true,
      license: product.license.url,
      codeRepository: product.repositoryUrl,
      screenshot: `${SITE_URL}${OG_IMAGE}`,
      image: `${SITE_URL}/puremac/arras-icon.png`,
      author: { "@id": "https://yashashwi.me/#person" },
      publisher: { "@id": "https://yashashwi.me/#person" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${ARRAS_URL}/#install`,
      },
      featureList: [
        "Preserves each image's source aspect ratio",
        "Pastes, imports, captures, and rotates desktop photos",
        "Layers photos around desktop icons, widgets, and applications",
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
      name: "How to install Arras from the official GitHub release",
      description: "Download the free Arras DMG from its official GitHub release, move it to Applications, and confirm the first launch in macOS.",
      supply: [{ "@type": "HowToSupply", name: `${summary.publicArchitectures.join(" and ")} Mac running ${summary.operatingSystem}` }],
      step: installation.steps.map((step, index) => ({
        "@type": "HowToStep", position: index + 1, ...step, url: `${ARRAS_URL}#install`,
      })),
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
  const [release, downloads, links, product] = await Promise.all([
    latestRelease("Arras"),
    totalDownloads("Arras"),
    getArrasLinks(),
    getArrasProduct(),
  ]);
  const dateModified = new Date(
    Math.max(Date.parse(CONTENT_UPDATED_AT), Date.parse(release?.publishedAt ?? "1970-01-01"))
  ).toISOString().slice(0, 10);
  const { props: posterProps } = getImageProps({
    src: OG_IMAGE,
    alt: "",
    width: 1470,
    height: 956,
    sizes: "(max-width: 800px) calc(100vw - 40px), (max-width: 1260px) calc(100vw - 80px), 1180px",
    // The poster enters the initial mobile viewport and is the measured LCP.
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <>
      <ArrasJsonLd release={release} downloads={downloads} dateModified={dateModified} product={product} />
      <ArrasClient
        release={release}
        downloads={downloads}
        links={links}
        posterProps={posterProps}
        product={{ ...product, ...summarizeArrasProduct(product) }}
      />
    </>
  );
}
