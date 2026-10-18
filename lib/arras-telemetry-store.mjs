import Redis from "ioredis";

export const RAW_DAYS = 30;
export const AGGREGATE_DAYS = 400;
export const REQUESTS_PER_INSTALL_DAY = 6;
export const MAX_REQUESTS_PER_DAY = 10_000;

// One Redis 8+ HSETEX commits each day's events, deduplication and counters.
// Raw fields expire together; only the anonymous rollup/schema receive longer
// retention. A failed extension is safe to retry without recounting. Legacy
// hashes migrate once from their event ledger, preserving the original keys.
export const INGEST_SCRIPT = `
local prefix, body, today = ARGV[1], cjson.decode(ARGV[2]), tonumber(ARGV[3])
local limit, now = tonumber(ARGV[4]), tonumber(ARGV[5])
local global, rate = prefix .. ':budget:' .. today, prefix .. ':rate:' .. body.install_id .. ':' .. today
local minute = prefix .. ':requests:' .. math.floor(now/60)
local controls = redis.call('MGET', global, rate, prefix .. ':disabled', minute)
if controls[3] == '1' then return 410 end
local requests = tonumber(controls[4] or '0')
if requests >= 1000 then return 429 end
redis.call('SETEX', minute, 120, requests+1)
local globalCount, installCount = tonumber(controls[1] or '0'), tonumber(controls[2] or '0')
if globalCount >= limit or installCount >= 6 then return 429 end
local budgetTTL = math.max(1, (today+2)*86400-now)
redis.call('SETEX', global, budgetTTL, globalCount+1)
redis.call('SETEX', rate, budgetTTL, installCount+1)
local function accumulate(totals, e)
  local function count(field) totals[field] = (totals[field] or 0) + 1 end
  count('event:' .. e.event)
  if e.event == 'first_run' then count('existing_configuration:' .. tostring(e.existing_configuration)) end
  if e.event == 'first_feature_used' then count('feature:' .. e.widget_type) end
  if e.event == 'app_updated' then count('upgrade:' .. e.previous_version .. ':' .. e.app_version) end
  if e.event == 'daily_configuration' then
    count('version:' .. e.app_version); count('build:' .. e.build)
    count('os:' .. e.os_version); count('architecture:' .. e.architecture)
    count('widgets:' .. e.configuration.widget_count); count('collages:' .. e.configuration.collage_count)
    for kind, bucket in pairs(e.configuration.counts_by_type) do count('type:' .. kind .. ':' .. bucket) end
  end
end
local days, plans = {}, {}
for _, e in ipairs(body.events) do
  if not days[e.day] then days[e.day] = {} end
  table.insert(days[e.day], e)
end
-- Prepare every day before changing event data. Schema errors cannot poison deduplication.
for day, events in pairs(days) do
  local key, fields = prefix .. ':day:' .. day, {'_aggregate', '_schema', 'snapshot:' .. body.install_id}
  for _, e in ipairs(events) do table.insert(fields, 'raw:' .. body.install_id .. ':' .. e.event_id) end
  local values, existing = redis.call('HMGET', key, unpack(fields)), {}
  for i, field in ipairs(fields) do if values[i] then existing[field] = values[i] end end
  if existing._schema and existing._schema ~= '2' then error('Unsupported telemetry day schema') end
  if existing._schema and not existing._aggregate then error('Missing telemetry aggregate') end
  local totals, writes = {}, {}
  if existing._aggregate then totals = cjson.decode(existing._aggregate) end
  if not existing._schema then
    if redis.call('EXISTS', prefix .. ':raw:' .. day, prefix .. ':aggregate:' .. day, prefix .. ':snapshots:' .. day) > 0 then
      local raw = redis.call('HGETALL', prefix .. ':raw:' .. day)
      for i = 1, #raw, 2 do
        existing['raw:' .. raw[i]], writes['raw:' .. raw[i]] = raw[i+1], raw[i+1]
        local event = cjson.decode(raw[i+1])
        accumulate(totals, event)
        if event.event == 'daily_configuration' then
          local id = string.match(raw[i], '^([^:]+):')
          existing['snapshot:' .. id], writes['snapshot:' .. id] = '1', '1'
        end
      end
      local aggregates = redis.call('HGETALL', prefix .. ':aggregate:' .. day)
      for i = 1, #aggregates, 2 do
        local value = tonumber(aggregates[i+1])
        if not value or value < 0 or value > (totals[aggregates[i]] or 0) then
          error('Legacy telemetry aggregate needs reconciliation')
        end
      end
    end
  end
  for field, count in pairs(totals) do
    if type(field) ~= 'string' or not tonumber(count) or tonumber(count) < 0 or tonumber(count)%1 ~= 0 then error('Invalid telemetry aggregate') end
    totals[field] = tonumber(count)
  end
  for _, e in ipairs(events) do
    local field, snapshot = 'raw:' .. body.install_id .. ':' .. e.event_id, 'snapshot:' .. body.install_id
    local skip = existing[field]
    if not skip and e.event == 'daily_configuration' then skip = existing[snapshot] end
    if not skip then
      existing[field], writes[field] = cjson.encode(e), cjson.encode(e)
      if e.event == 'daily_configuration' then existing[snapshot], writes[snapshot] = '1', '1' end
      accumulate(totals, e)
    end
  end
  if next(writes) or not existing._schema then writes._aggregate, writes._schema = cjson.encode(totals), '2' end
  local pairsToWrite = {}
  for field, value in pairs(writes) do table.insert(pairsToWrite, field); table.insert(pairsToWrite, value) end
  plans[day] = {key = key, values = pairsToWrite}
end
local orderedDays = {}
for day, _ in pairs(plans) do table.insert(orderedDays, day) end
table.sort(orderedDays)
for _, day in ipairs(orderedDays) do
  local plan = plans[day]
  -- One atomic write commits counts, event IDs and expiry together. A failure
  -- extending anonymous retention leaves every field safely expiring at 30 days.
  if #plan.values > 0 then
    redis.call('HSETEX', plan.key, 'EXAT', (tonumber(day)+31)*86400, 'FIELDS', #plan.values/2, unpack(plan.values))
  end
  -- Retry repairs a failed extension without recounting committed events.
  redis.call('HEXPIREAT', plan.key, (tonumber(day)+401)*86400, 'FIELDS', 2, '_aggregate', '_schema')
end
return 204
`;

export function telemetrySettings(env = process.env) {
  return {
    enabled: env.ARRAS_TELEMETRY_ENABLED === "1",
    environment: env.ARRAS_TELEMETRY_ENVIRONMENT === "production" ? "production" : "development",
    redisURL: env.ARRAS_TELEMETRY_REDIS_URL || env.ARRAS_TELEMETRY_KV_URL || env.REDIS_URL,
    requireTLS: env.ARRAS_TELEMETRY_REDIS_REQUIRE_TLS === "1",
  };
}

export function makeStore(settings, namespace = "arras:telemetry:v1") {
  const prefix = `${namespace}:${settings.environment}`;
  async function run(fn) {
    if (!settings.redisURL) throw new Error("unconfigured");
    const redis = new Redis({
      // Avoid two optional CLIENT SETINFO commands on every short-lived connection.
      disableClientInfo: true,
      lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 0,
      connectTimeout: 2000, commandTimeout: 2000, retryStrategy: () => null,
      ...(settings.requireTLS ? { tls: { servername: new URL(settings.redisURL).hostname, rejectUnauthorized: true } } : {}),
    }, settings.redisURL);
    redis.on("error", () => {});
    try { await redis.connect(); return await fn(redis); }
    finally { redis.disconnect(); }
  }
  return {
    configured: Boolean(settings.redisURL),
    // GET requests have a global short-lived budget too. No IP or user agent is
    // read or stored; edge-level denial-of-service controls remain a deploy gate.
    async requestStatus(now = Date.now()) {
      const minute = Math.floor(now / 60_000);
      return run((r) => r.eval(`
        local controls = redis.call('MGET', KEYS[1], KEYS[2])
        if controls[2] == '1' then return 410 end
        local n = tonumber(controls[1] or '0')
        if n >= 1000 then return 429 end
        redis.call('SETEX', KEYS[1], 120, n+1)
        return 204
      `, 2, `${prefix}:requests:${minute}`, `${prefix}:disabled`));
    },
    async ingest(body, now = Date.now()) {
      return run((r) => r.eval(INGEST_SCRIPT, 0, prefix, JSON.stringify(body), Math.floor(now / 86_400_000), MAX_REQUESTS_PER_DAY, Math.floor(now / 1000)));
    },
  };
}
