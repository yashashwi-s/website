import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readAndValidateArrasProduct } from "./lib/arras-product.mjs";

const root = resolve(".");
const metadata = await readAndValidateArrasProduct(resolve(root, "data/arras-product.json"));
const paths = {
  page: "app/puremac/arras/page.jsx",
  client: "app/puremac/arras/arras-client.jsx",
  products: "data/mac-products.js",
  projects: "data/projects.js",
};
const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(paths).map(async ([key, path]) => [key, await readFile(resolve(root, path), "utf8")])
  )
);

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

check(sources.page.includes("arrasProduct.homebrew.commands.map"), "Structured HowTo must render the shared Homebrew command list");
check(sources.client.includes('product.homebrew.commands.join("\\n")'), "Visible installation instructions must render the shared Homebrew command list");
check(sources.client.includes("arrasFeatureContractUrl(release?.tag)"), "Current feature documentation must follow the live stable release tag");
check(!/\/blob\/v\d+\.\d+\.\d+\/FEATURES\.md/.test(sources.client), "Current feature documentation must not pin a historical release tag");

const currentDocumentation = `${sources.page}\n${sources.client}\n${sources.products}\n${sources.projects}`;
check(!currentDocumentation.includes("brew trust --cask"), "Current Arras documentation must not use cask-level Homebrew trust");

for (const [value, label] of [
  [metadata.repositoryUrl, "repository URL"],
  [metadata.canonicalUrl, "canonical URL"],
  [metadata.canonicalUrl.replace(/\/$/, ""), "canonical URL"],
  [metadata.license.url, "license URL"],
  [metadata.bundleIdentifier, "bundle identifier"],
]) {
  for (const [key, source] of Object.entries(sources)) {
    check(!source.includes(JSON.stringify(value)), `${paths[key]} must derive the Arras ${label} from data/arras-product.json`);
  }
}

if (failures.length) {
  console.error("Arras product checks failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Arras product metadata and shared-consumer checks passed.");
