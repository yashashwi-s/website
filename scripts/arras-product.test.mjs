import assert from "node:assert/strict";
import test from "node:test";
import fallback from "../data/arras-product.json" with { type: "json" };
import { ARRAS_PRODUCT_METADATA_URL, getArrasProductResolution } from "../lib/arras-product-resolver.mjs";
import { validateArrasProduct } from "../lib/arras-product-schema.mjs";

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
