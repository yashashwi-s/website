import assert from "node:assert/strict";
import test from "node:test";
import fallback from "../data/arras-product.json" with { type: "json" };
import { ARRAS_PRODUCT_METADATA_URL, getArrasProductResolution } from "../lib/arras-product-resolver.mjs";
import { validateArrasProduct } from "../lib/arras-product-schema.mjs";
import { arrasFaqs as faqData } from "../lib/arras-faqs.mjs";
import { getArrasInstallation, getArrasAppStoreOffer } from "../lib/arras-installation.mjs";
import { hasRetiredArrasTrustCopy } from "./lib/arras-trust-copy.mjs";
import { releasedArrasProduct } from "./lib/arras-product.mjs";

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

test("ad-hoc installs retain accurate legacy macOS confirmation", () => {
  const product = structuredClone(fallback);
  product.publicRelease.signing = "ad-hoc";
  product.publicRelease.notarized = false;
  const installation = getArrasInstallation(product);
  assert.match(installation.verification, /not notarized by Apple/);
  assert.match(installation.verification, /rather than reporting that malware was detected/);
  assert.match(installation.approval, /password or Touch ID if requested/);
  assert.match(installation.approval, /password is not shared with the app/);

  assert.equal(hasRetiredArrasTrustCopy(installation.faqAnswer.join(" ")), false);
});

test("reviewed install FAQ and signing facts match the verified distribution", () => {
  const installation = getArrasInstallation(fallback);
  const faq = faqData.find(faq => faq.id === "gatekeeper");
  assert.equal(fallback.publicRelease.signing, "developer-id");
  assert.equal(fallback.publicRelease.notarized, true);
  assert.equal(faq.question, installation.faqQuestion);
  assert.deepEqual(faq.answer, installation.faqAnswer);
});

test("updated distribution facts remove obsolete approval and telemetry claims", () => {
  const product = structuredClone(fallback);
  product.publicRelease.notarized = true;
  product.publicRelease.signing = "developer-id";
  product.telemetry = true;
  const installation = getArrasInstallation(product);
  const publicText = [installation.signingSummary, installation.helpLabel, installation.faqQuestion, installation.approval, ...installation.faqAnswer, ...installation.steps.map(step => step.text)].join(" ");
  assert.match(publicText, /notarized by Apple/);
  assert.match(installation.signingSummary, /Developer ID certificate/);
  assert.doesNotMatch(installation.helpLabel, /message/);
  assert.doesNotMatch(installation.faqQuestion, /cannot verify/);
  assert.doesNotMatch(publicText, /not notarized|Open Anyway|no analytics or telemetry|free from malware/);
});

test("notarized metadata requires Developer ID signing", () => {
  for (const signing of ["ad-hoc", "unsigned"]) {
    const product = structuredClone(fallback);
    product.publicRelease.notarized = true;
    product.publicRelease.signing = signing;
    assert.throws(() => validateArrasProduct(product), /requires Developer ID signing/);
  }
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


test("a stale remote contract cannot replace this website release", async () => {
  const previous = structuredClone(fallback);
  delete previous.publicRelease.version;
  previous.telemetry = false;
  const result = await getArrasProductResolution({ fetchImpl: async () => response(previous) });
  assert.equal(result.source, "fallback");
  assert.equal(result.product.publicRelease.version, "2.5.0");
  assert.equal(result.product.telemetry, true);
});

test("older 2.4.9 metadata cannot downgrade reviewed 2.5.0 facts", async () => {
  const previous = structuredClone(fallback);
  previous.publicRelease.version = "2.4.9";
  previous.telemetry = false;
  const result = await getArrasProductResolution({ fetchImpl: async () => response(previous) });
  assert.equal(result.source, "fallback");
  assert.equal(result.product.publicRelease.version, "2.5.0");
  assert.equal(result.product.telemetry, true);
});

test("a different release cannot replace the reviewed website metadata", async () => {
  const future = structuredClone(fallback);
  future.publicRelease.version = "2.6.0";
  future.telemetry = true;
  const result = await getArrasProductResolution({ fetchImpl: async () => response(future) });
  assert.equal(result.source, "fallback");
  assert.equal(result.product.publicRelease.version, "2.5.0");
  assert.equal(result.product.telemetry, true);
});

test("stable-tag sync preserves canonical website URLs and the reviewed feature scope", () => {
  const legacy = structuredClone(fallback);
  legacy.schemaVersion = 1;
  legacy.publisher = { name: "PureMac", url: "https://puremac.yashashwi.me/" };
  legacy.shortDescription = "Legacy description";
  legacy.documentation.faqUrl = "https://arras.yashashwi.me/faqs";
  legacy.homebrew = { cask: "arras" };
  const synced = releasedArrasProduct(legacy, fallback, "2.5.0");
  assert.deepEqual(synced, fallback);
  assert.throws(() => releasedArrasProduct(legacy, fallback, "2.4.9"), /content review/);
});

test("released metadata keeps release facts while website URLs move to the new domain", async () => {
  const previous = JSON.parse(JSON.stringify(fallback).replaceAll("https://tryarras.tech/", "https://arras.yashashwi.me/"));
  const result = await getArrasProductResolution({ fetchImpl: async () => response(previous) });
  assert.equal(result.source, "remote");
  assert.equal(result.product.canonicalUrl, "https://tryarras.tech/");
  assert.equal(result.product.documentation.faqUrl, "https://tryarras.tech/faq");
  assert.deepEqual(result.product.publicRelease, previous.publicRelease);
  assert.equal(result.product.telemetry, previous.telemetry);
  assert.equal(previous.canonicalUrl, "https://arras.yashashwi.me/");
});

test("domain migration rejects lookalike origins and unexpected documentation paths", async () => {
  for (const invalid of ["https://arras.yashashwi.me.evil.example/", "https://arras.yashashwi.me/other", "https://user:pass@arras.yashashwi.me/"]) {
    const product = structuredClone(fallback);
    product.canonicalUrl = invalid;
    const result = await getArrasProductResolution({ fetchImpl: async () => response(product) });
    assert.equal(result.source, "fallback", invalid);
  }
  const product = structuredClone(fallback);
  product.documentation.faqUrl = "https://arras.yashashwi.me/unrelated";
  const result = await getArrasProductResolution({ fetchImpl: async () => response(product) });
  assert.equal(result.source, "fallback");
});


test("Store badge stays absent until the listing is approved and publicly live", () => {
  const product = structuredClone(fallback);
  delete product.appStore;
  assert.equal(getArrasAppStoreOffer(validateArrasProduct(product)), null);
  for (const status of ["in-preparation", "in-review", "approved", "unavailable"]) {
    product.appStore = { ...fallback.appStore, status };
    assert.equal(getArrasAppStoreOffer(validateArrasProduct(product)), null, status);
  }
  product.appStore.status = "live";
  assert.deepEqual(getArrasAppStoreOffer(validateArrasProduct(product)), {
    url: "https://apps.apple.com/app/id6824271927", price: "US$4.99",
  });
  assert.equal(product.publicRelease.sourceUrl, "https://github.com/yashashwi-s/Arras/releases/latest");
});

test("Store metadata rejects an incorrect listing or distribution privacy claim", () => {
  for (const change of [{ appleId: "123456789" }, { status: "ready" }, { sandboxed: false }, { telemetry: true }]) {
    const product = structuredClone(fallback);
    Object.assign(product.appStore, change);
    assert.throws(() => validateArrasProduct(product), /appStore|App Store/);
  }
});
