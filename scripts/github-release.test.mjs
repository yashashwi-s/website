import assert from "node:assert/strict";
import test from "node:test";
import { latestRelease, totalDownloads } from "../lib/github-release.js";

function mockFetch(payload, ok = true) {
  return async () => ({ ok, async json() { return structuredClone(payload); } });
}

test("latestRelease accepts official GitHub release and asset URLs", async (context) => {
  context.mock.method(globalThis, "fetch", mockFetch({
    tag_name: "v2.4.9",
    html_url: "https://github.com/yashashwi-s/Arras/releases/tag/v2.4.9",
    published_at: "2026-09-28T10:00:00Z",
    assets: [{ name: "Arras.dmg", browser_download_url: "https://github.com/yashashwi-s/Arras/releases/download/v2.4.9/Arras.dmg" }],
  }));
  const release = await latestRelease("Arras");
  assert.equal(release.tag, "v2.4.9");
  assert.equal(release.dmg, "https://github.com/yashashwi-s/Arras/releases/download/v2.4.9/Arras.dmg");
});

test("latestRelease rejects a lookalike asset host", async (context) => {
  context.mock.method(globalThis, "fetch", mockFetch({
    tag_name: "v2.4.9",
    html_url: "https://github.com/yashashwi-s/Arras/releases/tag/v2.4.9",
    published_at: "2026-09-28T10:00:00Z",
    assets: [{ name: "Arras.dmg", browser_download_url: "https://github.com.evil.example/yashashwi-s/Arras/releases/download/v2.4.9/Arras.dmg" }],
  }));
  assert.equal(await latestRelease("Arras"), null);
});

test("release helpers reject unknown repositories without fetching", async (context) => {
  const fetchMock = context.mock.method(globalThis, "fetch", async () => { throw new Error("must not fetch"); });
  assert.equal(await latestRelease("../other"), null);
  assert.equal(await totalDownloads("Other"), null);
  assert.equal(fetchMock.mock.callCount(), 0);
});
