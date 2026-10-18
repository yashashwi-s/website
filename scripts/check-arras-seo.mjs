import assert from "node:assert/strict";
import product from "../data/arras-product.json" with { type: "json" };
import { requestPage } from "./lib/request-page.mjs";

const canonical = "https://tryarras.tech";
const preview = process.env.ARRAS_REQUEST_BASE_URL;
const arrasOrigin = preview ? new URL(preview).origin : canonical;
const portfolioOrigin = process.env.PORTFOLIO_REQUEST_BASE_URL || (preview ? new URL(preview).origin : "https://yashashwi.me");
const publicPaths = ["/", "/faq", "/security"];
const googlebot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const decode = text => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const visible = html => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)]));
}
const metaValues = (html, key) => [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0])).filter(meta => (meta.name || meta.property) === key).map(meta => meta.content);
const anchors = html => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(([, attrs, body]) => ({ ...attributes(attrs), text: visible(body) }));

const pages = Object.fromEntries(await Promise.all(publicPaths.map(async path => {
  const response = await requestPage(`${arrasOrigin}${path}`, { headers: { Host: "tryarras.tech", "User-Agent": googlebot } });
  const html = await response.text();
  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const link = attributes(tag);
    if (link.href?.startsWith(product.repositoryUrl)) {
      check(link.referrerpolicy === "origin" && !/noreferrer/.test(link.rel || ""), `${path}: GitHub links must send only the origin`);
    }
  }
  const expected = path === "/" ? canonical : `${canonical}${path}`;
  check(response.status === 200, `${path}: must return 200 without a redirect`);
  check(!/\b(noindex|nofollow|none)\b/i.test(response.headers.get("x-robots-tag") || ""), `${path}: blocking X-Robots-Tag`);
  const metadataHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const name of ["robots", "googlebot"]) {
    const directives = metaValues(metadataHtml, name);
    check(directives.length === 1 && !directives.some(value => /\b(noindex|nofollow|none)\b/i.test(value)), `${path}: ${name} must allow indexing and following`);
  }
  const canonicals = [...metadataHtml.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(link => link.rel === "canonical").map(link => link.href);
  check(canonicals.length === 1 && canonicals[0] === expected, `${path}: expected one canonical ${expected}`);
  check(JSON.stringify(metaValues(metadataHtml, "og:url")) === JSON.stringify([expected]), `${path}: incorrect OpenGraph URL`);
  for (const field of ["og:image", "twitter:image"]) {
    const urls = metaValues(metadataHtml, field);
    check(urls.length > 0 && urls.every(url => new URL(url).origin === canonical), `${path}: ${field} must use the Arras HTTPS host`);
  }
  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json));
  const nodes = blocks.flatMap(block => block["@graph"] || [block]);
  for (const node of nodes.filter(node => ["WebPage", "WebSite", "SoftwareApplication"].includes(node["@type"]))) {
    check(node.url && new URL(node.url).origin === canonical, `${path}: ${node["@type"]} uses the wrong website host`);
  }
  for (const node of nodes.filter(node => node["@type"] === "WebPage")) check(node.url === expected, `${path}: WebPage URL differs from canonical`);
  if (path === "/") {
    const software = nodes.filter(node => node["@type"] === "SoftwareApplication");
    check(software.length === 1, "Landing page must have one SoftwareApplication");
    const app = software[0];
    check(app?.url === canonical && app?.["@id"] === `${canonical}#software`, "SoftwareApplication identity must use the canonical Arras URL");
    check(app?.softwareVersion === product.publicRelease.version, "SoftwareApplication must describe the reviewed website release");
    check(/Apple Silicon/.test(app?.processorRequirements) && /Intel/.test(app?.processorRequirements), "SoftwareApplication must describe both packaged architectures");
    for (const url of [app?.offers?.url, app?.screenshot, app?.image]) check(url && new URL(url).origin === canonical, "SoftwareApplication offer and media URLs must use the Arras host");
  }
  for (const link of anchors(metadataHtml).filter(link => !/\.(?:png|jpe?g|webp|avif|svg|gif|mp4|webm)(?:[?#]|$)/i.test(link.href || ""))) check(!/puremac\.yashashwi\.me\/(?:puremac\/)?arras(?:\/|$)|^\/puremac\/arras(?:\/|$)/i.test(link.href || ""), `${path}: legacy Arras navigation URL ${link.href}`);
  return [path, { html, text: visible(html) }];
})));

for (const path of ["/", "/faq"]) {
  for (const term of [/true aspect ratio/i, /uncropped/i, /single photo/i, /Polaroid/, /Gallery/, /transparent PNG/i, /GIF/, /APNG/, /screenshot/i, /PDF/, /Space slideshow/i]) check(term.test(pages[path].text), `${path}: missing useful shipped-feature copy ${term}`);
  for (const term of [/collage/i, /Photos album/i, /Copy Appearance/, /Reference Tools/, /setups/i, /muted.*video/i]) check(term.test(pages[path].text), `${path}: missing reviewed 2.5.0 feature ${term}`);
}

const [robotsResponse, sitemapResponse, portfolioResponse] = await Promise.all([
  requestPage(`${arrasOrigin}/robots.txt`, { headers: { Host: "tryarras.tech", "User-Agent": googlebot } }),
  requestPage(`${arrasOrigin}/sitemap.xml`, { headers: { Host: "tryarras.tech", "User-Agent": googlebot } }),
  requestPage(`${portfolioOrigin}/`, { headers: { Host: "yashashwi.me", "User-Agent": googlebot } }),
]);
check(robotsResponse.status === 200 && robotsResponse.headers.get("content-type")?.startsWith("text/plain"), "robots.txt must return text with HTTP 200");
const robots = await robotsResponse.text();
check(robots.includes(`Sitemap: ${canonical}/sitemap.xml`), "robots.txt has the wrong sitemap host");
const crawlerGroups = robots.split(/\n\s*\n/).filter(group => /^User-agent:/mi.test(group));
check(crawlerGroups.some(group => /^User-agent: \*$/mi.test(group)), "robots.txt needs a wildcard crawler rule");
for (const group of crawlerGroups) {
  check(/^Allow: \/$/mi.test(group), "All crawler groups must allow public pages");
  check([...group.matchAll(/^Disallow:\s*(.*)$/gmi)].every(([, path]) => path.trim() === "/api/"), "robots.txt must not disallow public pages");
}
check(sitemapResponse.status === 200 && /xml/.test(sitemapResponse.headers.get("content-type") || ""), "sitemap.xml must return XML with HTTP 200");
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const expectedLocations = publicPaths.map(path => path === "/" ? canonical : `${canonical}${path}`);
check(JSON.stringify([...locations].sort()) === JSON.stringify(expectedLocations.sort()), "sitemap.xml must contain every canonical public route exactly once");
check(!locations.some(url => /\/faqs$|\/puremac\//.test(url)), "sitemap.xml must not include redirected page paths");
check(portfolioResponse.status === 200, "Portfolio must return HTTP 200 for Googlebot");
const portfolio = await portfolioResponse.text();
const portfolioLinks = anchors(portfolio.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ""));
const arrasLinks = portfolioLinks.filter(link => link.href && new URL(link.href, "https://yashashwi.me").origin === canonical);
check(arrasLinks.length >= 4 && arrasLinks.every(link => /Arras/.test(link.text)), "Portfolio must expose Arras navigation, project, feature and footer as named <a href> links");
check(arrasLinks.some(link => /desktop photo widgets/i.test(link.text)), "Arras portfolio anchor text should describe desktop photo widgets");
check(portfolioLinks.some(link => link.href === "https://puremac.yashashwi.me/fadeo" && /Fadeo/.test(link.text)), "Fadeo's crawlable product link must stay intact");
check(!portfolioLinks.some(link => /^https:\/\/puremac\.yashashwi\.me\/?$|puremac\.yashashwi\.me\/(?:puremac\/)?arras(?:\/|$)/.test(link.href || "")), "Portfolio Arras links must go directly to the product host");
check(!/<(?:button|div|span)\b[^>]*(?:href|data-href)="https?:/i.test(portfolio), "External portfolio navigation must use standard anchors");
for (const link of portfolioLinks) check(Boolean(link.href), "Every rendered portfolio anchor must have an href");

assert.equal(failures.length, 0, failures.join("\n"));
console.log("SEO checks passed: Googlebot responses, indexable public pages, canonical/OG/JSON-LD hosts, reviewed 2.5.0 copy, robots, sitemap, and crawlable portfolio links (Fadeo intact).");
