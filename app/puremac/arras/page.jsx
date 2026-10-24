import ArrasClient from "./arras-client";
import { getImageProps } from "next/image";
import {
  arrasCanonicalUrl,
  arrasProduct,
  summarizeArrasProduct,
} from "@/data/arras-product";
import { getArrasProduct } from "@/lib/arras-product";
import { getArrasLinks } from "./arras-links";
import { latestRelease, totalDownloads, repositoryStars } from "@/lib/github-release";
import { getArrasInstallation, getArrasAppStoreOffer } from "@/lib/arras-installation.mjs";
import { ARRAS_SUPPORT_EMAIL } from "@/lib/arras-support.mjs";

const SITE_URL = arrasCanonicalUrl;
const ARRAS_URL = SITE_URL;
const OFFICIAL_DMG_URL = `${arrasProduct.repositoryUrl}/releases/latest/download/Arras.dmg`;
const CONTENT_UPDATED_AT = "2026-10-24";
const TITLE = "Arras Widgets — Mac Photo Widgets & Desktop Collages";
const DESCRIPTION =
  "Arras Widgets for Mac: photo widgets, editable collages and slideshows. Get it on the Mac App Store, or choose the free, open-source direct download.";
const OG_IMAGE = "/puremac/arras/launch-2.5.0-poster.jpg";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
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
  keywords: [
    "Arras",
    "Arras Widgets",
    "Mac desktop photo widget without cropping",
    "single photo widget for Mac",
    "true aspect ratio desktop photos",
    "Polaroid and Gallery photo frames",
    "transparent PNG desktop widget",
    "animated GIF and APNG widgets",
    "floating screenshot and PDF reference overlay",
    "multi-photo Space slideshow",
    "editable desktop photo collages",
    "linked Photos albums and folders",
    "muted video desktop widgets",
    "saved desktop setups",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: ARRAS_URL,
    siteName: arrasProduct.name,
    locale: "en_US",
    type: "website",
    images: [{ url: `${SITE_URL}${OG_IMAGE}`, width: 1470, height: 956, alt: "Arras widgets on a macOS desktop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${SITE_URL}${OG_IMAGE}`, alt: "Arras photo widgets arranged on a macOS desktop" }],
  },
};

function ArrasJsonLd({ release, downloads, dateModified, product }) {
  const summary = summarizeArrasProduct(product);
  const installation = getArrasInstallation(product);
  const storeOffer = getArrasAppStoreOffer(product);
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
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: ARRAS_SUPPORT_EMAIL, url: `${ARRAS_URL}/support` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${ARRAS_URL}#software`,
      name: product.name,
      alternateName: [...product.historicalNames, ...(storeOffer ? [product.appStore.listingName] : [])],
      identifier: {
        "@type": "PropertyValue",
        propertyID: "macOS bundle identifier",
        value: product.bundleIdentifier,
      },
      sameAs: [product.repositoryUrl, ...(storeOffer ? [storeOffer.url] : [])],
      softwareHelp: { "@type": "CreativeWork", url: `${ARRAS_URL}/support`, name: "Arras Widgets support" },
      description: DESCRIPTION,
      url: ARRAS_URL,
      downloadUrl,
      softwareVersion: product.publicRelease.version,
      releaseNotes: `${product.repositoryUrl}/releases`,
      dateModified,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: product.category,
      processorRequirements: summary.publicArchitectures.join(" or "),
      operatingSystem: summary.operatingSystem,
      isAccessibleForFree: true,
      license: product.license.url,
      screenshot: `${SITE_URL}/puremac/arras/features/collages.webp`,
      image: `${SITE_URL}/puremac/arras-icon.png`,
      author: { "@id": "https://yashashwi.me/#person" },
      publisher: { "@id": "https://yashashwi.me/#person" },
      offers: [{
        "@type": "Offer",
        name: "Free direct download",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${ARRAS_URL}/#install`,
      }, ...(storeOffer ? [{
        "@type": "Offer",
        name: "Arras Widgets — Mac App Store edition (US storefront)",
        price: product.appStore.price.amount,
        priceCurrency: product.appStore.price.currency,
        availability: "https://schema.org/InStock",
        url: storeOffer.url,
      }] : [])],
      featureList: [
        "Uncropped desktop photos at their true aspect ratio",
        "Single photo widgets without creating Apple Photos albums",
        "Editable collages with independent member movement and resizing, captions and labels",
        "Polaroid and Gallery looks with custom mats, borders, shapes and shadows",
        "Copy Appearance without replacing photo content or placement",
        "Transparent PNG, animated GIF/APNG and muted local video widgets",
        "Linked Photos albums and Finder folders with managed local snapshots",
        "Multi-photo Space slideshows with timed or on-click rotation",
        "Behind Icons, On Desktop, Above Widgets and Floating depth levels",
        "Reference Tools for non-destructive crop, rotation, flips, grayscale, notes and source links",
        "Saved desktop setups, arrangement undo/redo and removal recovery",
        "Explicit .arras layout backups with stored media",
        "No account; photo content stays local"
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
      "@type": "VideoObject",
      "@id": `${ARRAS_URL}#launch-film`,
      name: "Arras 2.5.0 — Your own world",
      description: "Arrange photos into a collage, lock the layout, and see different real Arras desktop setups.",
      thumbnailUrl: [`${SITE_URL}${OG_IMAGE}`],
      contentUrl: `${SITE_URL}/puremac/arras/launch-2.5.0.mp4`,
      uploadDate: "2026-10-18T00:00:00+05:30",
      duration: "PT10.4S",
      isFamilyFriendly: true,
      publisher: { "@id": "https://yashashwi.me/#person" },
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
  const [release, downloads, stars, links, product] = await Promise.all([
    latestRelease("Arras"),
    totalDownloads("Arras"),
    repositoryStars("Arras"),
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
        stars={stars}
        links={links}
        posterProps={posterProps}
        product={{ ...product, ...summarizeArrasProduct(product) }}
      />
    </>
  );
}
