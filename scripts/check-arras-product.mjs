import { arrasFaqs } from "../lib/arras-faqs.mjs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readAndValidateArrasProduct } from "./lib/arras-product.mjs";
import { getArrasInstallation } from "../lib/arras-installation.mjs";
import { hasRetiredArrasTrustCopy } from "./lib/arras-trust-copy.mjs";

const root = resolve(".");
const metadata = await readAndValidateArrasProduct(resolve(root, "data/arras-product.json"));
const paths = {
  page: "app/puremac/arras/page.jsx",
  client: "app/puremac/arras/arras-client.jsx",
  products: "data/mac-products.js",
  projects: "data/projects.js",
  faqs: "app/puremac/arras/faqs/page.jsx",
  security: "app/puremac/arras/security/page.jsx",
  faqData: "app/puremac/arras-faqs.json",
  sharedFaqs: "app/puremac/faq-data.js",
  llms: "app/puremac/arras/llms.txt/route.js",
  sharedLlms: "app/puremac/llms.txt/route.js",
  press: "public/puremac/press.md",
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

check(sources.client.includes("ArrasDownloadLink") && sources.client.includes("links.download"), "Visible download CTAs must use the local Arras download route");
check(!/\/blob\/v\d+\.\d+\.\d+\/FEATURES\.md/.test(`${sources.faqs} ${sources.faqData}`), "Current feature documentation must not pin a historical release tag");

const faqData = arrasFaqs;
check(faqData.length === 10, "The evidence importer and rendered page must keep exactly ten FAQs");
check(JSON.stringify(faqData.find(faq => faq.id === "gatekeeper")?.answer) === JSON.stringify(getArrasInstallation(metadata).faqAnswer), "Committed Gatekeeper FAQ must match the shared explanation for fallback metadata");
check(new Set(faqData.map(faq => faq.id)).size === faqData.length, "FAQ identifiers must be unique");
check(new Set(faqData.map(faq => faq.question)).size === faqData.length, "FAQ questions must be unique");
for (const faq of faqData) {
  check(["getting-started", "personalize", "controls-and-limits", "first-launch", "photo-workflows"].includes(faq.group), `FAQ ${faq.id} has no rendered group`);
  for (const source of faq.sources ?? []) {
    const url = new URL(source.href);
    check(url.protocol === "https:" && !url.username && !url.password, `FAQ ${faq.id} has an unsafe source`);
    if (url.pathname.endsWith("/FEATURES.md")) check(source.href === metadata.documentation.featureContractUrl, `FAQ ${faq.id} must cite the current feature contract`);
  }
}
check(sources.sharedLlms.includes("summarizeArrasProduct"), "Shared AI summary must derive Arras compatibility from the product contract");
check(sources.press.includes("Apple Silicon and Intel") && sources.press.includes("2.5.0"), "Arras press compatibility must describe the reviewed universal 2.5.0 artifacts");
check(sources.press.includes("/faq#how-to-use") && sources.sharedLlms.includes("https://tryarras.tech/faq"), "Shared Arras links must point to the canonical FAQ page");
for (const [name, text] of [["FAQ", sources.faqData], ["Security", sources.security],
  ["Privacy policy", await readFile(resolve(root, "app/puremac/arras/telemetry-details.jsx"), "utf8")]]) {
  check(text.includes("2.5.0") && /weekly|seven-day/i.test(text), `${name} must disclose 2.5.0 weekly statistics`);
}
const currentDocumentation = ["page", "client", "faqs", "security", "faqData", "llms", "sharedFaqs", "sharedLlms", "press"].map(key => sources[key]).join("\n");
const arrasConsumerCopy = ["page", "client", "faqs", "security", "faqData", "llms"].map(key => sources[key]).join("\n");
check(!hasRetiredArrasTrustCopy(arrasConsumerCopy), "Current public Arras copy contains retired trust disclaimers");
for (const key of ["page", "client", "faqs", "security", "llms"]) {
  check(sources[key].includes("getArrasInstallation(product)"), `${paths[key]} must use the shared first-launch explanation`);
}
check(!/homebrew|brew tap|brew install|brew trust/i.test(currentDocumentation), "Current Arras documentation must not present retired Homebrew distribution");
check(metadata.publicRelease.version === "2.5.0" && metadata.telemetry === true, "The prepared website must describe Arras 2.5.0 and its statistics contract");
check(JSON.stringify(metadata.publicRelease.architectures) === JSON.stringify(["arm64", "x86_64"]), "The reviewed official download supports Apple Silicon and Intel");
for (const phrase of ["Try an Example", "Create Collage", "Copy Appearance", "Reference Tools", "Photos album", "Finder folder", "desktop setups", "muted local video"]) {
  check(currentDocumentation.includes(phrase), `The reviewed 2.5.0 copy must cover ${phrase}`);
}

for (const [value, label] of [
  [metadata.repositoryUrl, "repository URL"],
  [metadata.canonicalUrl, "canonical URL"],
  [metadata.canonicalUrl.replace(/\/$/, ""), "canonical URL"],
  [metadata.license.url, "license URL"],
  [metadata.bundleIdentifier, "bundle identifier"],
]) {
  for (const [key, source] of Object.entries(sources).filter(([key]) => !["faqData", "sharedFaqs", "llms", "sharedLlms", "press"].includes(key))) {
    check(!source.includes(JSON.stringify(value)), `${paths[key]} must derive the Arras ${label} from data/arras-product.json`);
  }
}

if (failures.length) {
  console.error("Arras product checks failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Arras product metadata and shared-consumer checks passed.");
