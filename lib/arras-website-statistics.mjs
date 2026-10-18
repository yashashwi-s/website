import Redis from "ioredis";
import { normalizeArrasSource, normalizeArrasCampaign } from "./arras-attribution.mjs";

export const WEBSITE_RETENTION_DAYS = 90;
export const WEBSITE_MONTHLY_EVENT_LIMIT = 5000;
const HOSTS = new Set(["tryarras.tech", "www.tryarras.tech", "arras.yashashwi.me"]);
const PAGES = new Set(["/", "/faq", "/faqs", "/security", "/security-privacy"]);

export function websiteObservation(request, kind = "page") {
  const url = new URL(request.url);
  if (request.method !== "GET" || !HOSTS.has(url.hostname)) return null;
  const headers = request.headers;
  if (headers.has("next-router-prefetch") || headers.has("rsc") ||
      /prefetch|prerender/i.test(`${headers.get("purpose") || ""} ${headers.get("sec-purpose") || ""} ${headers.get("x-moz") || ""}`)) return null;
  if (kind === "page" && !PAGES.has(url.pathname)) return null;
  if (kind !== "page" && kind !== "download") return null;
  const automated = /bot|crawler|spider|preview|slurp|headless|curl|wget|python-requests/i.test(headers.get("user-agent") || "");
  if (automated) return { event: "automated", fields: ["event:automated"] };
  const referrer = normalizeArrasSource(headers.get("referer")) || "direct";
  const source = normalizeArrasSource(url.searchParams.get("ref")) || referrer;
  const fields = [`event:${kind}`, `path:${kind === "download" ? "/download" : url.pathname}`, `referrer:${source}`];
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = normalizeArrasCampaign(url.searchParams.get(key));
    if (value) fields.push(`${key}:${value}`);
  }
  return { event: kind, fields };
}

// Anonymous aggregate counters only. No raw visits, addresses, cookies or IDs.
// A write cap bounds retained events; it is not a provider billing guarantee.
export const WEBSITE_INGEST_SCRIPT = `
local prefix, month, day, now = ARGV[1], ARGV[2], tonumber(ARGV[3]), tonumber(ARGV[4])
local limit, expiry = tonumber(ARGV[5]), tonumber(ARGV[6])
local fields = cjson.decode(ARGV[7])
local controls = redis.call('MGET', prefix .. ':month:' .. month, prefix .. ':disabled')
if controls[2] == '1' then return 410 end
local accepted = tonumber(controls[1] or '0')
if accepted >= limit then return 429 end
local key = prefix .. ':day:' .. day
local prior = redis.call('HGET', key, '_aggregate')
local totals = prior and cjson.decode(prior) or {}
local cardinality = 0
for _, _ in pairs(totals) do cardinality = cardinality + 1 end
for _, field in ipairs(fields) do
  if not totals[field] and cardinality >= 500 then
    field = string.match(field, '^[^:]+:') .. 'other'
  elseif not totals[field] then cardinality = cardinality + 1 end
  totals[field] = (totals[field] or 0) + 1
end
redis.call('SETEX', prefix .. ':month:' .. month, math.max(1, expiry-now), accepted+1)
redis.call('HSETEX', key, 'EXAT', (day+${WEBSITE_RETENTION_DAYS + 1})*86400, 'FIELDS', 2, '_aggregate', cjson.encode(totals), '_schema', '1')
return 204
`;

export function websiteStatisticsSettings(env = process.env) {
  const limit = Number(env.ARRAS_WEBSITE_ANALYTICS_MONTHLY_LIMIT || WEBSITE_MONTHLY_EVENT_LIMIT);
  return {
    enabled: env.ARRAS_WEBSITE_ANALYTICS_ENABLED === "1" && env.VERCEL_ENV === "production",
    redisURL: env.ARRAS_TELEMETRY_REDIS_URL || env.ARRAS_TELEMETRY_KV_URL,
    requireTLS: env.ARRAS_TELEMETRY_REDIS_REQUIRE_TLS === "1",
    monthlyLimit: Number.isSafeInteger(limit) && limit > 0 && limit <= 100000 ? limit : WEBSITE_MONTHLY_EVENT_LIMIT,
  };
}

export function makeWebsiteStore(settings, namespace = "arras:website:v1:production") {
  return {
    async record(observation, now = Date.now()) {
      const date = new Date(now), month = date.toISOString().slice(0, 7);
      const monthExpiry = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 3) / 1000);
      const redis = new Redis({ disableClientInfo: true, lazyConnect: true,
        enableOfflineQueue: false, maxRetriesPerRequest: 0, connectTimeout: 2000,
        commandTimeout: 2000, retryStrategy: () => null,
        ...(settings.requireTLS ? { tls: { servername: new URL(settings.redisURL).hostname, rejectUnauthorized: true } } : {}),
      }, settings.redisURL);
      redis.on("error", () => {});
      try {
        await redis.connect();
        return Number(await redis.eval(WEBSITE_INGEST_SCRIPT, 0, namespace, month,
          Math.floor(now / 86400000), Math.floor(now / 1000), settings.monthlyLimit,
          monthExpiry, JSON.stringify(observation.fields)));
      } finally { redis.disconnect(); }
    },
  };
}

export async function recordWebsiteObservation(observation, settings = websiteStatisticsSettings(), store) {
  if (!observation || !settings.enabled) return;
  try {
    if (!settings.redisURL) throw new Error("unconfigured");
    const status = await (store || makeWebsiteStore(settings)).record(observation);
    if (status !== 204) console.warn(`Arras website counters paused (${[410,429].includes(status) ? status : "storage"}).`);
  } catch { console.warn("Arras website counters unavailable; page/download delivery continues."); }
}
