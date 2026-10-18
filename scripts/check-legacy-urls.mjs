import assert from "node:assert/strict";
import { requestPage } from "./lib/request-page.mjs";

const preview = process.env.LEGACY_REQUEST_BASE_URL || process.env.ARRAS_REQUEST_BASE_URL;
const canonical = "https://tryarras.tech";
const cases = [];
for (const host of ["puremac.yashashwi.me", "yashashwi.me", "arras.yashashwi.me"]) {
  for (const prefix of ["/arras", "/puremac/arras"]) {
    for (const [suffix, target] of [["", "/"], ["/faq", "/faq"], ["/faqs", "/faq"], ["/security", "/security"], ["/security-privacy", "/security"], ["/robots.txt", "/robots.txt"], ["/sitemap.xml", "/sitemap.xml"], ["/llms.txt", "/llms.txt"]]) {
      for (const slash of ["", "/"]) cases.push([`https://${host}${prefix}${suffix}${slash}?utm_source=legacy-check`, `${canonical}${target}?utm_source=legacy-check`]);
    }
  }
}
for (const host of ["puremac.yashashwi.me", "yashashwi.me"]) {
  for (const path of ["/tableau", "/puremac/tableau"]) cases.push([`https://${host}${path}`, `${canonical}/`]);
}
for (const path of ["/faqs", "/faqs/"]) cases.push([`${canonical}${path}`, `${canonical}/faq`]);
for (const host of ["arras.yashashwi.me", "www.tryarras.tech"]) {
  for (const path of ["/", "/faq", "/security", "/robots.txt", "/sitemap.xml", "/llms.txt"]) cases.push([`https://${host}${path}`, `${canonical}${path}`]);
  cases.push([`https://${host}/security-privacy`, `${canonical}/security`]);
}
cases.push([`${canonical}/security-privacy`, `${canonical}/security`]);

async function get(url) {
  const parsed = new URL(url);
  const requestUrl = preview ? `${new URL(preview).origin}${parsed.pathname}${parsed.search}` : url;
  return requestPage(requestUrl, { headers: { Host: parsed.host, "User-Agent": "Arras-SEO-Redirect-Check-bot/1.0" } });
}
// A redirect must be 301 (Next's permanent:true default is 308), preserve
// queries and land directly on the destination page without another hop.
const destinations = new Set();
for (let offset = 0; offset < cases.length; offset += 8) {
  await Promise.all(cases.slice(offset, offset + 8).map(async ([source, target]) => {
    const response = await get(source);
    const actual = new URL(response.headers.get("location") || source, source);
    assert.equal(response.status, 301, `${source}: expected 301, got ${response.status}`);
    assert.equal(actual.href, target, `${source}: wrong target or dropped query`);
    destinations.add(actual.href);
  }));
}
await Promise.all([...destinations].map(async url => {
  const response = await get(url);
  assert.equal(response.status, 200, `${url}: extra redirect hop or failure ${response.status}`);
}));
for (const source of [`${canonical}/faq/`, `${canonical}/security/`, "https://puremac.yashashwi.me/fadeo/"]) {
  const response = await get(`${source}?source=slash-check`);
  const actual = new URL(response.headers.get("location") || source, source);
  assert.equal(response.status, 308, `${source}: expected normal trailing-slash normalization`);
  assert.equal(actual.href, `${source.slice(0, -1)}?source=slash-check`, `${source}: trailing-slash redirect must not loop`);
  assert.equal((await get(actual.href)).status, 200, `${actual.href}: trailing-slash destination must work`);
}
console.log(`Legacy URL checks passed: ${cases.length} exact 301 redirects, preserved queries, one-hop destinations, and normal Arras/Fadeo slash redirects.`);
