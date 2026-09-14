import {
  arrasArchitectureSummary,
  arrasOperatingSystem,
  arrasProduct,
} from "./arras-product";

// Shared reader-facing facts, separate from live release metadata.
export const macProducts = {
  arras: {
    name: arrasProduct.name,
    url: arrasProduct.canonicalUrl,
    repo: arrasProduct.repositoryUrl,
    publisher: arrasProduct.publisher,
    operatingSystem: arrasOperatingSystem,
    architecture: arrasArchitectureSummary,
    minimumMacOS: arrasProduct.minimumMacOS,
    price: "Free",
    license: arrasProduct.license.spdx,
    licenseUrl: arrasProduct.license.url,
    bundleIdentifier: arrasProduct.bundleIdentifier,
    historicalNames: arrasProduct.historicalNames,
    publicRelease: arrasProduct.publicRelease,
    sourceBuild: arrasProduct.sourceBuild,
    telemetry: arrasProduct.telemetry,
    homebrew: arrasProduct.homebrew,
  },
  fadeo: { name: "Fadeo", url: "https://puremac.yashashwi.me/fadeo", operatingSystem: "macOS 14 or later", price: "Free to use; optional pay-what-you-want lifetime license", license: "GPLv3", licenseUrl: "https://github.com/yashashwi-s/Fadeo/blob/main/LICENSE", repo: "https://github.com/yashashwi-s/Fadeo" },
};
// Reviewed against these published releases, never an unreleased branch.
export const releaseHighlights = {
  arras: { version: "v2.4.6", date: "2026-08-31", title: "Updates and durable backups", text: "Daily verified updates and safer portable backups. Layout imports validate media before replacement, and replacing a Space image survives relaunch. Settings also improve accessible labels and keyboard access.", url: "https://github.com/yashashwi-s/Arras/releases/tag/v2.4.6" },
  fadeo: { version: "v0.4.0", date: "2026-07-17", title: "Playback that resumes reliably", text: "Play order and repeat mode survive switching and resuming. Paused playback keeps its position across quitting, and an End Session control clears the bookmark and pauses automation. Schedule boundaries crossed during sleep are handled on wake.", url: "https://github.com/yashashwi-s/Fadeo/releases/tag/v0.4.0" },
};
