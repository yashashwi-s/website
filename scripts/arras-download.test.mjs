import test from "node:test";
import assert from "node:assert/strict";
import { ARRAS_SOURCE_KEY, normalizeArrasSource, arrasEntrySource, rememberArrasSource, arrasDownloadHref } from "../lib/arras-attribution.mjs";
import { ARRAS_DMG_URL, handleArrasDownload } from "../lib/arras-download.mjs";
import { repositoryStars } from "../lib/github-release.js";

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function request(path = "", headers = {}, method = "GET") {
  return new Request(`https://tryarras.tech/download${path}`, { headers, method });
}

test("source normalization keeps a hostname or label and excludes private URL details", () => {
  assert.equal(normalizeArrasSource("https://www.Reddit.com/r/macapps?token=private#post"), "reddit.com");
  assert.equal(normalizeArrasSource("ChatGPT"), "chatgpt");
  assert.equal(normalizeArrasSource("https://arras.yashashwi.me/security"), "same-site");
  for (const value of ["person@example.com", "javascript:alert(1)", "https://secret@reddit.com/", "https://127.0.0.1/", "https://[::1]/", "x".repeat(70), "bad\nsource", "a..b"]) {
    assert.equal(normalizeArrasSource(value), null, value);
  }
});

test("first touch prefers utm_source and survives internal FAQ/Security navigation", () => {
  const store = storage();
  const first = rememberArrasSource({ url: "https://tryarras.tech/faq?utm_source=reddit", referrer: "https://google.com/search?q=private", storage: store });
  assert.equal(first, "reddit");
  assert.equal(rememberArrasSource({ url: "https://tryarras.tech/security?utm_source=other", referrer: "https://tryarras.tech/faq", storage: store }), "reddit");
  assert.equal(store.getItem(ARRAS_SOURCE_KEY), "reddit");
  assert.equal(arrasDownloadHref("/download", first), "/download?ref=reddit");
  assert.equal(arrasDownloadHref("/puremac/arras/download", first), "/puremac/arras/download?ref=reddit");
});

test("referrer-only, direct and blocked storage entries still produce working links", () => {
  const blocked = { getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); } };
  assert.equal(rememberArrasSource({ url: "https://tryarras.tech/", referrer: "https://chatgpt.com/c/private", storage: blocked }), "chatgpt.com");
  assert.equal(rememberArrasSource({ url: "https://tryarras.tech/?utm_source=google", referrer: "", storage: null }), "google");
  assert.equal(arrasEntrySource("https://tryarras.tech/", ""), "direct");
  assert.equal(arrasEntrySource("https://tryarras.tech/?utm_source=person%40example.com", "https://google.com/"), "google.com");
  assert.equal(arrasDownloadHref("/download", "bad\nsource"), "/download?ref=direct");
});

test("independent session stores keep sources separate and replace invalid stored data", () => {
  const first = storage(), second = storage();
  first.setItem(ARRAS_SOURCE_KEY, "reddit");
  assert.equal(rememberArrasSource({ url: "https://tryarras.tech/", referrer: "", storage: second }), "direct");
  first.setItem(ARRAS_SOURCE_KEY, "https://user:secret@example.com/private");
  assert.equal(rememberArrasSource({ url: "https://tryarras.tech/", referrer: "https://google.com/search", storage: first }), "google.com");
});

test("download always redirects to the fixed official DMG, without caching or private referrer leakage", () => {
  const events = [];
  const res = handleArrasDownload(request("?ref=reddit&url=https://evil.example", { referer: "https://tryarras.tech/?email=private", "user-agent": "Mozilla/5.0 Chrome/150.0.1", "sec-fetch-user": "?1" }), { log: message => events.push(JSON.parse(message)) });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), ARRAS_DMG_URL);
  assert.equal(ARRAS_DMG_URL, "https://github.com/yashashwi-s/Arras/releases/latest/download/Arras.dmg");
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(res.headers.get("referrer-policy"), "origin");
  assert.match(res.headers.get("x-robots-tag"), /noindex/);
  assert.deepEqual(events, [{ event: "arras_download_request", source: "reddit", referrer: "same-site", agent: "chrome", userInitiated: true }]);
  assert.doesNotMatch(JSON.stringify(events), /private|150\.0|Mozilla|email/);
});

test("script-free downloads use available request referrers; untrusted ref values cannot inject logs", () => {
  const events = [];
  handleArrasDownload(request("?ref=person%40example.com", { referer: "https://www.google.com/search?q=private" }), { log: message => events.push(JSON.parse(message)) });
  handleArrasDownload(request("?ref=%0Afake_event", { "user-agent": "Googlebot" }), { log: message => events.push(JSON.parse(message)) });
  assert.equal(events[0].source, "google.com");
  assert.equal(events[1].source, "direct");
  assert.equal(events[1].agent, "automated");
  assert.equal(events[1].userInitiated, false);
});

test("HEAD and browser/framework prefetches keep working without inflating logs", () => {
  const cases = [request("", {}, "HEAD"), request("", { purpose: "prefetch" }), request("", { "sec-purpose": "prefetch;prerender" }), request("", { "next-router-prefetch": "1" }), request("", { "x-moz": "prefetch" })];
  for (const req of cases) {
    const events = [];
    const res = handleArrasDownload(req, { log: value => events.push(value) });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), ARRAS_DMG_URL);
    assert.equal(events.length, 0);
  }
});

test("a logging failure cannot interrupt a download", () => {
  const res = handleArrasDownload(request(), { log() { throw Error("logger unavailable"); } });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), ARRAS_DMG_URL);
});

test("the GitHub star count is cached server-side and a real zero is retained", async () => {
  let options;
  assert.equal(await repositoryStars("Arras", { fetchImpl: async (url, init) => {
    assert.equal(url, "https://api.github.com/repos/yashashwi-s/Arras"); options = init;
    return { ok: true, json: async () => ({ stargazers_count: 0 }) };
  } }), 0);
  assert.equal(options.next.revalidate, 3600);
  assert.ok(options.signal instanceof AbortSignal);
});

test("GitHub rate limits, malformed counts and network failures omit the count", async () => {
  for (const value of [-1, "5", null, 1.5, undefined]) {
    assert.equal(await repositoryStars("Arras", { fetchImpl: async () => ({ ok: true, json: async () => ({ stargazers_count: value }) }) }), null);
  }
  assert.equal(await repositoryStars("Arras", { fetchImpl: async () => ({ ok: false, status: 429 }) }), null);
  assert.equal(await repositoryStars("Arras", { fetchImpl: async () => { throw Error("offline"); } }), null);
});
