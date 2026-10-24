import { readFile } from "node:fs/promises";
export { serializeArrasProduct, validateArrasProduct } from "../../lib/arras-product-schema.mjs";
import { validateArrasProduct } from "../../lib/arras-product-schema.mjs";

export async function readAndValidateArrasProduct(path) {
  const source = await readFile(path, "utf8");
  let metadata;
  try {
    metadata = JSON.parse(source);
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
  return validateArrasProduct(metadata);
}

// Older release tags use schema 1 and the former catalog publisher. Keep
// reviewed website copy/URLs while syncing platform facts from the stable tag.
export function releasedArrasProduct(released, website, version) {
  if (![1, 2].includes(released?.schemaVersion)) throw new Error("Unsupported released metadata schema");
  if (version !== website.publicRelease.version) throw new Error("A different app release requires a website content review");
  if (released.publicRelease?.version && released.publicRelease.version !== version) throw new Error("Tagged metadata version does not match its release");
  const metadata = {
    ...website,
    ...released,
    schemaVersion: 2,
    publisher: website.publisher,
    shortDescription: website.shortDescription,
    documentation: website.documentation,
    appStore: website.appStore,
    publicRelease: { ...website.publicRelease, ...released.publicRelease, version },
    sourceBuild: { ...website.sourceBuild, ...released.sourceBuild },
  };
  delete metadata.homebrew;
  return validateArrasProduct(metadata);
}
