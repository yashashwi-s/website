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
  faqs: "app/puremac/arras/faqs/page.jsx",
  security: "app/puremac/arras/security/page.jsx",
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

check(sources.page.includes("How to install Arras from the official GitHub release"), "Structured HowTo must describe the official GitHub release download");
check(sources.client.includes("releases/latest/download/Arras.dmg"), "Visible download CTAs must use the stable official GitHub DMG URL");
check(sources.faqs.includes("arrasFeatureContractUrl(release?.tag)"), "Current feature documentation must follow the live stable release tag");
check(!/\/blob\/v\d+\.\d+\.\d+\/FEATURES\.md/.test(sources.faqs), "Current feature documentation must not pin a historical release tag");

const currentDocumentation = Object.values(sources).join("\n");
check(!/homebrew|brew tap|brew install|brew trust/i.test(currentDocumentation), "Current Arras documentation must not present retired Homebrew distribution");

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
