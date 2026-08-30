const baseUrl = (process.env.PUREMAC_BASE_URL || "https://puremac.yashashwi.me").replace(/\/$/, "");
const requestBaseUrl = (process.env.PUREMAC_REQUEST_BASE_URL || baseUrl).replace(/\/$/, "");
const arrasBaseUrl = (process.env.ARRAS_BASE_URL || "https://arras.yashashwi.me").replace(/\/$/, "");
const arrasRequestBaseUrl = (process.env.ARRAS_REQUEST_BASE_URL || arrasBaseUrl).replace(/\/$/, "");

const paths = ["/", "/arras", "/fadeo", "/robots.txt", "/sitemap.xml", "/llms.txt"];
const responses = await Promise.all(
  paths.map(async (path) => {
    const response = await fetch(`${requestBaseUrl}${path}`, {
      headers: { "User-Agent": "PureMac-AEO-Check/1.0" },
      redirect: "follow",
    });
    const body = await response.text();
    return [path, { response, body }];
  })
);
const pages = Object.fromEntries(responses);
const arrasResponses = await Promise.all(
  ["/", "/robots.txt", "/sitemap.xml"].map(async (path) => {
    const response = await fetch(`${arrasRequestBaseUrl}${path}`, {
      headers: { "User-Agent": "PureMac-AEO-Check/1.0" },
      redirect: "follow",
    });
    const body = await response.text();
    return [path, { response, body }];
  })
);
const arrasPages = Object.fromEntries(arrasResponses);
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

for (const [path, { response }] of Object.entries(pages)) {
  check(response.ok, `${path} returned ${response.status}`);
}
for (const [path, { response }] of Object.entries(arrasPages)) {
  check(response.ok, `Arras ${path} returned ${response.status}`);
}

const arrasHtml = arrasPages["/"].body;
const title = arrasHtml.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
const description = decodeHtml(
  arrasHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
  arrasHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
  ""
);
const canonicals = [...arrasHtml.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)].map(
  (match) => match[1]
);
const jsonLdBlocks = [...arrasHtml.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch {
      failures.push("/arras contains invalid JSON-LD");
      return null;
    }
  })
  .filter(Boolean);
const graphTypes = new Set(
  jsonLdBlocks.flatMap((block) => {
    const nodes = block["@graph"] ?? [block];
    return nodes.flatMap((node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
  })
);
const faq = jsonLdBlocks.find((block) => block["@type"] === "FAQPage");

check(title.length >= 45 && title.length <= 60, `Arras title is ${title.length} characters, expected 45-60`);
check(description.length >= 130 && description.length <= 160, `/arras description is ${description.length} characters`);
check(canonicals.includes(arrasBaseUrl), "Arras canonical URL is missing or incorrect");
check((arrasHtml.match(/<h1(?:\s|>)/gi) ?? []).length === 1, "/arras must render exactly one H1");
check(faq?.mainEntity?.length === 10, "/arras must expose exactly 10 FAQ schema questions");
for (const type of ["SoftwareApplication", "HowTo", "BreadcrumbList", "Organization", "Person", "WebPage"]) {
  check(graphTypes.has(type), `/arras JSON-LD is missing ${type}`);
}
check(arrasHtml.includes("How is Arras different from the macOS Photos widget?"), "/arras comparison answer is missing");
check(arrasHtml.includes("support.apple.com/guide/mac-help/mchl52be5da5/mac"), "/arras Apple source link is missing");
check(arrasHtml.includes("github.com/yashashwi-s/Arras"), "/arras project source link is missing");

const robots = pages["/robots.txt"].body;
for (const crawler of [
  "OAI-SearchBot",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
]) {
  check(robots.includes(`User-agent: ${crawler}`), `/robots.txt is missing ${crawler}`);
}
check(robots.includes("Disallow: /api/"), "/robots.txt must exclude API endpoints");
check(robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`), "/robots.txt sitemap URL is incorrect");

const sitemap = pages["/sitemap.xml"].body;
for (const path of ["", "/fadeo"]) {
  check(sitemap.includes(`<loc>${baseUrl}${path}</loc>`), `/sitemap.xml is missing ${path || "/"}`);
}
check(sitemap.includes("<lastmod>"), "/sitemap.xml is missing freshness timestamps");

const arrasRobots = arrasPages["/robots.txt"].body;
check(arrasRobots.includes("User-agent: *"), "Arras /robots.txt is missing its crawler rule");
check(arrasRobots.includes(`Sitemap: ${arrasBaseUrl}/sitemap.xml`), "Arras /robots.txt sitemap URL is incorrect");
const arrasSitemap = arrasPages["/sitemap.xml"].body;
check(arrasSitemap.includes(`<loc>${arrasBaseUrl}</loc>`), "Arras /sitemap.xml is missing the canonical root");
check(arrasSitemap.includes("<lastmod>"), "Arras /sitemap.xml is missing a freshness timestamp");

const llms = pages["/llms.txt"].body;
check(llms.startsWith("# PureMac"), "/llms.txt must start with the site identity");
check(llms.includes("## Primary Product: Arras"), "/llms.txt must prioritize Arras");
check(llms.includes("## Authoritative External References"), "/llms.txt must include source guidance");

if (failures.length) {
  console.error(`PureMac AEO checks failed against ${requestBaseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PureMac AEO checks passed against ${requestBaseUrl}.`);
console.log(`Arras metadata: ${title.length}-character title, ${description.length}-character description.`);
console.log(`Arras structured data: ${faq.mainEntity.length} FAQs plus ${[...graphTypes].filter(Boolean).join(", ")}.`);
