import metadata from "./arras-product.json";

export const arrasProduct = metadata;
export const arrasCanonicalUrl = metadata.canonicalUrl.replace(/\/$/, "");
export const arrasPublisherUrl = metadata.publisher.url.replace(/\/$/, "");

const architectureNames = {
  arm64: "Apple Silicon",
  x86_64: "Intel",
};

export const arrasPublicArchitectures = metadata.publicRelease.architectures.map(
  (architecture) => architectureNames[architecture] ?? architecture
);
export const arrasOperatingSystem = `macOS ${Number.parseFloat(metadata.minimumMacOS)} or later`;
export const arrasArchitectureSummary = `Published download for ${arrasPublicArchitectures.join(
  " and "
)}${metadata.sourceBuild.intelSupported ? "; Intel supported from source" : ""}`;

export function arrasFeatureContractUrl(tag) {
  return `${metadata.repositoryUrl}/blob/${tag ?? "main"}/${metadata.featureContractPath}`;
}
