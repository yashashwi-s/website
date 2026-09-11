// Read-only regression checks. Override origins to test a preview with host routing.
const puremac = process.env.PUREMAC_BASE_URL || "https://puremac.yashashwi.me";
const arras = process.env.ARRAS_BASE_URL || "https://arras.yashashwi.me";
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const get = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  assert(response.ok, `${url}: HTTP ${response.status}`);
  return { response, html: await response.text() };
};
for (const [url, name, canonical] of [[puremac, "PureMac", "https://puremac.yashashwi.me"], [`${puremac}/fadeo`, "Fadeo", "https://puremac.yashashwi.me/fadeo"], [arras, "Arras", "https://arras.yashashwi.me"]]) {
  const { html, response } = await get(url);
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"), `${name}: noindex response header`);
  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert(canonicals.length === 1 && canonicals[0][1].replace(/\/$/, "") === canonical, `${name}: canonical mismatch`);
  assert(html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/)?.[1].startsWith(name), `${name}: inherited or absent social title`);
  assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${name}: expected one primary heading`);
  if (name === "Arras") {
    for (const id of ["controls-and-limits", "photo-rotation", "keyboard-controls", "shortcuts-and-imports", "sharing-privacy", "layout-backups"]) assert(html.includes(`id="${id}"`), `Arras: missing ${id}`);
    assert(!html.includes("That Never Crops"), "Arras: absolute cropping claim returned");
  }
  if (name === "PureMac") {
    const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    const graph = scripts.flatMap(s => s["@graph"] || [s]);
    for (const type of ["CollectionPage", "Organization", "WebSite"]) assert(graph.some(n => n["@type"] === type), `PureMac: missing ${type}`);
  }
}
const icon = await get(`${puremac}/favicon.ico`);
assert(icon.response.headers.get("content-type")?.startsWith("image/"), "PureMac fallback favicon is not an image");
const summary = await get(`${puremac}/llms.txt`);
assert(!/about 20 MB|about 2\.4 MB/.test(summary.html), "PureMac summary contains unsupported fixed measurements");
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log("Discovery checks passed: canonical URLs, social titles, headings, publisher identity, useful Arras answers, favicon and summary accuracy.");
