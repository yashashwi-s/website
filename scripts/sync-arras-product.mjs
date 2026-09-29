import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { serializeArrasProduct, validateArrasProduct } from "./lib/arras-product.mjs";

const SOURCE_URL = "https://raw.githubusercontent.com/yashashwi-s/Arras/main/product-metadata.json";
const FALLBACK_PATH = resolve("data/arras-product.json");
const check = process.argv.slice(2).includes("--check");
if (process.argv.slice(2).some((argument) => argument !== "--check")) throw new Error("Usage: node scripts/sync-arras-product.mjs [--check]");

const response = await fetch(SOURCE_URL, {
  headers: { Accept: "application/json", "User-Agent": "Arras-Website-Metadata-Sync/1.0" },
  signal: AbortSignal.timeout(10_000),
});
if (!response.ok) throw new Error(`Canonical metadata returned HTTP ${response.status}`);
const expected = serializeArrasProduct(validateArrasProduct(await response.json()));
const current = await readFile(FALLBACK_PATH, "utf8").catch((error) => error.code === "ENOENT" ? null : Promise.reject(error));

if (current === expected) {
  console.log("Committed Arras fallback matches canonical metadata.");
} else if (check) {
  console.error("data/arras-product.json differs from canonical metadata.");
  process.exitCode = 1;
} else {
  await writeFile(FALLBACK_PATH, expected);
  console.log(`Updated data/arras-product.json from ${SOURCE_URL}.`);
}
