import fallback from "../data/arras-product.json" with { type: "json" };
import { validateArrasProduct } from "./arras-product-schema.mjs";

export const ARRAS_PRODUCT_METADATA_URL = "https://raw.githubusercontent.com/yashashwi-s/Arras/main/product-metadata.json";
const TIMEOUT_MS = 3000;

// Released app metadata still names the previous website. Translate only that
// exact HTTPS origin; normal validation still checks every URL and release fact.
function currentWebsiteUrls(metadata) {
  const product = structuredClone(metadata);
  const current = value => typeof value === "string"
    ? value.replace(/^https:\/\/arras\.yashashwi\.me\//, "https://tryarras.tech/")
    : value;
  product.canonicalUrl = current(product.canonicalUrl);
  if (product.documentation && typeof product.documentation === "object") {
    for (const key of ["mainUrl", "installationUrl", "quickStartUrl", "faqUrl", "securityUrl"]) {
      product.documentation[key] = current(product.documentation[key]);
    }
  }
  return product;
}

function fallbackResolution(reason) {
  const message = reason instanceof Error ? reason.message : String(reason);
  console.warn(`[arras-product] using validated committed fallback: ${message}`);
  return { product: validateArrasProduct(fallback), source: "fallback", reason: message };
}

export async function getArrasProductResolution({ fetchImpl = fetch, offline = process.env.ARRAS_METADATA_OFFLINE === "1" } = {}) {
  if (offline) return fallbackResolution("offline mode requested");
  try {
    const response = await fetchImpl(ARRAS_PRODUCT_METADATA_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["arras-product"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`canonical metadata returned HTTP ${response.status}`);
    const product = validateArrasProduct(currentWebsiteUrls(await response.json()));
    // A website release must not silently inherit an older or different feature contract.
    if (fallback.publicRelease.version && product.publicRelease.version !== fallback.publicRelease.version) {
      throw new Error("remote metadata belongs to a different website release");
    }
    // Store availability changes independently of an app build. Keep the
    // website's reviewed listing state instead of a build's older review state.
    return {
      product: validateArrasProduct({ ...product, shortDescription: fallback.shortDescription, appStore: fallback.appStore }),
      source: "remote",
      reason: null,
    };
  } catch (error) {
    return fallbackResolution(error);
  }
}

export async function getArrasProduct(options) {
  return (await getArrasProductResolution(options)).product;
}
