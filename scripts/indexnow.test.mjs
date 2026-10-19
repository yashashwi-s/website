import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { arrasUrls, changedProductUrls, productUrls } from "../lib/indexnow.mjs";

const arrasPages = ["https://tryarras.tech/", "https://tryarras.tech/faq", "https://tryarras.tech/security"];
const sorted = values => [...values].sort();

test("full submissions include all canonical Arras pages, without redirects or assets", () => {
  assert.deepEqual(arrasUrls, arrasPages);
  assert.deepEqual(productUrls.filter(url => new URL(url).host === "tryarras.tech"), arrasPages);
  assert.equal(new Set(productUrls).size, productUrls.length);
});

test("Arras FAQ, privacy and shared release updates notify every affected public page", () => {
  for (const file of ["app/puremac/arras/faq/page.js", "app/puremac/arras/security/page.js", "app/puremac/arras-faqs.json", "data/arras-product.js", "data/arras-product.json", "lib/arras-faqs.mjs"]) {
    const urls = changedProductUrls([file]);
    assert.deepEqual(urls.filter(url => new URL(url).host === "tryarras.tech"), arrasPages, file);
    assert.ok(!urls.includes("https://puremac.yashashwi.me/fadeo"), file);
  }
});

test("shared routing and metadata changes notify all product pages without duplicates", () => {
  assert.deepEqual(sorted(changedProductUrls(["proxy.js", "app/layout.js", "data/arras-product.json"])), sorted(productUrls));
});

test("Fadeo notifications and its legal-page exclusion remain scoped", () => {
  assert.deepEqual(sorted(changedProductUrls(["app/puremac/fadeo/page.js"])), ["https://puremac.yashashwi.me/", "https://puremac.yashashwi.me/fadeo"]);
  assert.deepEqual(changedProductUrls(["app/puremac/fadeo/privacy/page.js"]), []);
});

test("backend, documentation and indexing configuration alone do not claim page content changed", () => {
  assert.deepEqual(changedProductUrls(["app/api/telemetry/route.js", "docs/arras-distribution-plan.md", "lib/indexnow.mjs", "scripts/notify-indexnow.mjs"]), []);
});


test("manual Arras-only submission cannot notify the other product host", () => {
  const result = spawnSync(process.execPath, ["scripts/notify-indexnow.mjs", "--all", "--host=tryarras.tech", "--dry-run"], { cwd: new URL("..", import.meta.url), encoding: "utf8", timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
  for (const url of arrasPages) assert.ok(result.stdout.includes(url), url);
  assert.ok(!result.stdout.includes("puremac.yashashwi.me"));
});

test("unknown notification hosts are rejected before any submission", () => {
  for (const host of ["example.com", ""]) {
    const result = spawnSync(process.execPath, ["scripts/notify-indexnow.mjs", "--all", `--host=${host}`, "--dry-run"], { cwd: new URL("..", import.meta.url), encoding: "utf8", timeout: 5000 });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown product host/);
  }
});
