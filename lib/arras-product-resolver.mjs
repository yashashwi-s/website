import fallback from "../data/arras-product.json" with { type: "json" };
import { validateArrasProduct } from "./arras-product-schema.mjs";

export const ARRAS_PRODUCT_METADATA_URL = "https://raw.githubusercontent.com/yashashwi-s/Arras/main/product-metadata.json";
const TIMEOUT_MS = 3000;

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
    return { product: validateArrasProduct(await response.json()), source: "remote", reason: null };
  } catch (error) {
    return fallbackResolution(error);
  }
}

export async function getArrasProduct(options) {
  return (await getArrasProductResolution(options)).product;
}
