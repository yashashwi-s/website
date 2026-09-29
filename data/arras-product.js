import metadata from "./arras-product.json";
import { validateArrasProduct } from "../lib/arras-product-schema.mjs";

export const arrasProduct = validateArrasProduct(metadata);
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
)}${metadata.sourceBuild.intelSupported && !metadata.publicRelease.architectures.includes("x86_64") ? "; Intel supported from source" : ""}`;

export function summarizeArrasProduct(product = arrasProduct) {
  const publicArchitectures = product.publicRelease.architectures.map(
    (architecture) => architectureNames[architecture] ?? architecture
  );
  return {
    operatingSystem: `macOS ${Number.parseFloat(product.minimumMacOS)} or later`,
    publicArchitectures,
    architecture: `Published download for ${publicArchitectures.join(" and ")}${
      product.sourceBuild.intelSupported && !product.publicRelease.architectures.includes("x86_64")
        ? "; Intel supported from source"
        : ""
    }`,
  };
}

export function arrasFeatureContractUrl() {
  return metadata.documentation.featureContractUrl;
}
