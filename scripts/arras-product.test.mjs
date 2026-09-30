import assert from "node:assert/strict";
import test from "node:test";
import fallback from "../data/arras-product.json" with { type: "json" };
import { ARRAS_PRODUCT_METADATA_URL, getArrasProductResolution } from "../lib/arras-product-resolver.mjs";
import { validateArrasProduct } from "../lib/arras-product-schema.mjs";
import faqData from "../app/puremac/arras-faqs.json" with { type: "json" };
import { getArrasInstallation } from "../lib/arras-installation.mjs";
import { hasRetiredArrasTrustCopy } from "./lib/arras-trust-copy.mjs";

function response(body, { ok = true, status = 200 } = {}) {
  return { ok, status, async json() { return structuredClone(body); } };
}

test("accepts valid canonical remote metadata", async () => {
  let requested;
  const result = await getArrasProductResolution({ fetchImpl: async (url, options) => {
    requested = { url, options };
    return response(fallback);
  }});
  assert.equal(result.source, "remote");
  assert.deepEqual(result.product.publicRelease.architectures, ["arm64", "x86_64"]);
  assert.equal(requested.url, ARRAS_PRODUCT_METADATA_URL);
  assert.equal(requested.options.next.revalidate, 3600);
});

test("uses the validated fallback on an HTTP error", async () => {
  const result = await getArrasProductResolution({ fetchImpl: async () => response(null, { ok: false, status: 503 }) });
  assert.equal(result.source, "fallback");
  assert.equal(result.product.publisher.name, "Yashashwi Singhania");
  assert.match(result.reason, /HTTP 503/);
});

test("rejects malformed remote facts and uses fallback", async () => {
  const malformed = structuredClone(fallback);
  malformed.publicRelease.architectures = ["armv7"];
  const result = await getArrasProductResolution({ fetchImpl: async () => response(malformed) });
  assert.equal(result.source, "fallback");
  assert.deepEqual(result.product.publicRelease.architectures, ["arm64", "x86_64"]);
  assert.match(result.reason, /unsupported/);
});

test("rejects unsafe or lookalike authoritative URLs", () => {
  for (const unsafe of [
    "http://github.com/yashashwi-s/Arras/releases/latest",
    "https://github.com.evil.example/yashashwi-s/Arras/releases/latest",
    "https://user:pass@github.com/yashashwi-s/Arras/releases/latest",
  ]) {
    const product = structuredClone(fallback);
    product.publicRelease.sourceUrl = unsafe;
    assert.throws(() => validateArrasProduct(product), /publicRelease.sourceUrl/);
  }
});

test("offline mode never calls the network", async () => {
  const result = await getArrasProductResolution({ offline: true, fetchImpl: async () => { throw new Error("network called"); } });
  assert.equal(result.source, "fallback");
});

test("current official install explains verification and macOS confirmation", () => {
  const installation = getArrasInstallation(fallback);
  assert.match(installation.verification, /not notarized by Apple/);
  assert.match(installation.verification, /rather than reporting that malware was detected/);
  assert.match(installation.approval, /password or Touch ID if requested/);
  assert.match(installation.approval, /password is not shared with the app/);
  assert.deepEqual(faqData.find(faq => faq.id === "gatekeeper").answer, installation.faqAnswer);
  assert.equal(hasRetiredArrasTrustCopy(installation.faqAnswer.join(" ")), false);
});

test("updated distribution facts remove obsolete approval and telemetry claims", () => {
  const product = structuredClone(fallback);
  product.publicRelease.notarized = true;
  product.publicRelease.signing = "developer-id";
  product.telemetry = true;
  const installation = getArrasInstallation(product);
  const publicText = [...installation.faqAnswer, ...installation.steps.map(step => step.text)].join(" ");
  assert.match(publicText, /notarized by Apple/);
  assert.doesNotMatch(publicText, /not notarized|Open Anyway|no analytics or telemetry|free from malware/);
});

test("trust regression guard catches wrapped disclaimers but permits technical facts", () => {
  for (const phrase of [
    "does not establish that a download is safe",
    "does not establish\nwhether an app is safe",
    "A matching checksum verifies bytes, not safety",
    "only proceed if you trust the official download",
    "If you trust that download",
    "Do not bypass a warning about detected malware or a damaged app",
    "material distribution limitation",
  ]) assert.equal(hasRetiredArrasTrustCopy(phrase), true, phrase);
  for (const phrase of [
    "The updater checks SHA-256 and removes quarantine from the validated replacement.",
    "The app does not verify a Developer ID signature.",
    "Apple is not able to verify that it is free from malware",
  ]) assert.equal(hasRetiredArrasTrustCopy(phrase), false, phrase);
});
