import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readAndValidateArrasProduct, releasedArrasProduct, serializeArrasProduct } from "./lib/arras-product.mjs";

const FALLBACK_PATH = resolve("data/arras-product.json");
const check = process.argv.slice(2).includes("--check");
if (process.argv.slice(2).some((argument) => argument !== "--check")) throw new Error("Usage: node scripts/sync-arras-product.mjs [--check]");

const website = await readAndValidateArrasProduct(FALLBACK_PATH);
const headers = { Accept: "application/json", "User-Agent": "Arras-Website-Metadata-Sync/1.0" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const releaseResponse = await fetch("https://api.github.com/repos/yashashwi-s/Arras/releases/latest", {
  headers,
  signal: AbortSignal.timeout(10_000),
});
if (!releaseResponse.ok) throw new Error(`GitHub release request returned HTTP ${releaseResponse.status}`);
const release = await releaseResponse.json();
if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name ?? "")) throw new Error("Expected a published stable Arras release");
const version = release.tag_name.slice(1);
if (version !== website.publicRelease.version) {
  console.log(`Arras ${release.tag_name} needs a website content review; keeping the audited ${website.publicRelease.version} contract.`);
  process.exit(check ? 1 : 0);
}
const sourceUrl = `https://raw.githubusercontent.com/yashashwi-s/Arras/${release.tag_name}/product-metadata.json`;
const response = await fetch(sourceUrl, {
  // Only send the API token to api.github.com.
  headers: { Accept: "application/json", "User-Agent": headers["User-Agent"] },
  signal: AbortSignal.timeout(10_000),
});
if (!response.ok) throw new Error(`Canonical metadata returned HTTP ${response.status}`);
const expected = serializeArrasProduct(releasedArrasProduct(await response.json(), website, version));
const current = await readFile(FALLBACK_PATH, "utf8").catch((error) => error.code === "ENOENT" ? null : Promise.reject(error));

if (current === expected) {
  console.log("Committed Arras fallback matches canonical metadata.");
} else if (check) {
  console.error("data/arras-product.json differs from canonical metadata.");
  process.exitCode = 1;
} else {
  await writeFile(FALLBACK_PATH, expected);
  console.log(`Updated data/arras-product.json from ${sourceUrl}.`);
}
