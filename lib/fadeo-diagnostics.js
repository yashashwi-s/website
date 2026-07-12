import { withRedis, redisConfigured } from "@/lib/redis";

export const diagnosticsConfigured = redisConfigured;

const INSTALLS_SET_KEY = "fadeo:diag:installs";
const installKey = (installID) => `fadeo:diag:install:${installID}`;

// Coarse, anonymous, opt-in only (see Fadeo's PLAN.md #13a and DiagnosticsUploader.swift).
// One row per installID, always overwritten in place: the app sends its current running
// totals at most once a day, so the latest submission already IS the full picture for
// that install -- there's no time-series to keep, just current state per install.
// A small map of string->non-negative-int, capped, keys sanitized. Used for the
// feature-adoption breakdowns (sourceKinds, triggerKinds, presets).
function cleanCountMap(m) {
  if (typeof m !== "object" || m === null) return {};
  const out = {};
  for (const [k, v] of Object.entries(m).slice(0, 40)) {
    if (typeof k === "string" && typeof v === "number" && Number.isFinite(v) && v >= 0) {
      out[k.slice(0, 40)] = Math.floor(v);
    }
  }
  return out;
}

function validate(body) {
  if (typeof body !== "object" || body === null) return null;
  const { installID, daysSinceFirstLaunch, sessionCount, workspaceCount, totalSwitches, totalActiveSeconds, appVersion, osVersion } = body;
  if (typeof installID !== "string" || installID.length < 8 || installID.length > 64) return null;
  const nums = { daysSinceFirstLaunch, sessionCount, workspaceCount, totalSwitches, totalActiveSeconds };
  for (const v of Object.values(nums)) {
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return null;
  }
  const rating = Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null;
  return {
    installID,
    daysSinceFirstLaunch: Math.floor(daysSinceFirstLaunch),
    sessionCount: Math.floor(sessionCount),
    workspaceCount: Math.floor(workspaceCount),
    totalSwitches: Math.floor(totalSwitches),
    totalActiveSeconds,
    appVersion: typeof appVersion === "string" ? appVersion.slice(0, 32) : "unknown",
    osVersion: typeof osVersion === "string" ? osVersion.slice(0, 64) : "unknown",
    // Feature adoption (privacy-safe counts; see ConfigUsageShape). Defaulted so older
    // clients that don't send these still validate.
    enabledWorkspaceCount: Number.isFinite(body.enabledWorkspaceCount) ? Math.floor(body.enabledWorkspaceCount) : 0,
    overrideWorkspaceCount: Number.isFinite(body.overrideWorkspaceCount) ? Math.floor(body.overrideWorkspaceCount) : 0,
    sourceKinds: cleanCountMap(body.sourceKinds),
    triggerKinds: cleanCountMap(body.triggerKinds),
    presets: cleanCountMap(body.presets),
    fallbackMode: typeof body.fallbackMode === "string" ? body.fallbackMode.slice(0, 32) : "",
    licensed: body.licensed === true,
    rating,
    submittedAt: new Date().toISOString(),
  };
}

// Returns the stored record on success, null if the body didn't pass validation.
export async function submitSummary(body) {
  const record = validate(body);
  if (!record) return null;
  await withRedis(async (r) => {
    await r.sadd(INSTALLS_SET_KEY, record.installID);
    await r.set(installKey(record.installID), JSON.stringify(record));
  });
  return record;
}

export async function allSummaries() {
  const { parsed, missing } = await withRedis(async (r) => {
    const ids = await r.smembers(INSTALLS_SET_KEY);
    if (ids.length === 0) return { parsed: [], missing: [] };
    const rows = await r.mget(ids.map(installKey));
    const parsed = [];
    const missing = [];
    ids.forEach((id, i) => {
      if (rows[i]) parsed.push(JSON.parse(rows[i]));
      else missing.push(id);
    });
    return { parsed, missing };
  });
  // An install's key can be individually cleared (e.g. manual pruning) while it lingers
  // in the set; sweep those out here so the set doesn't grow unbounded with dead ids.
  if (missing.length > 0) await withRedis((r) => r.srem(INSTALLS_SET_KEY, missing));
  return parsed;
}

export function aggregate(rows) {
  const totalInstalls = rows.length;
  const sum = (f) => rows.reduce((acc, r) => acc + (r[f] || 0), 0);
  const activeLast7d = rows.filter((r) => {
    const ageMs = Date.now() - new Date(r.submittedAt).getTime();
    return ageMs <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const byVersion = {};
  const byOS = {};
  // Feature adoption: for each kind, how many INSTALLS use it at least once (more useful
  // than raw workspace counts -- tells you reach, not power-user skew).
  const sourceAdoption = {};
  const triggerAdoption = {};
  const presetAdoption = {};
  const ratings = {};
  let ratedCount = 0;
  let licensedCount = 0;
  const mergeAdoption = (into, map) => {
    for (const k of Object.keys(map || {})) into[k] = (into[k] ?? 0) + 1;
  };
  for (const r of rows) {
    byVersion[r.appVersion] = (byVersion[r.appVersion] ?? 0) + 1;
    byOS[r.osVersion] = (byOS[r.osVersion] ?? 0) + 1;
    mergeAdoption(sourceAdoption, r.sourceKinds);
    mergeAdoption(triggerAdoption, r.triggerKinds);
    mergeAdoption(presetAdoption, r.presets);
    if (r.licensed) licensedCount += 1;
    if (r.rating) { ratings[r.rating] = (ratings[r.rating] ?? 0) + 1; ratedCount += 1; }
  }
  const totalSessions = sum("sessionCount");
  const totalActiveSeconds = sum("totalActiveSeconds");
  const ratingSum = Object.entries(ratings).reduce((a, [k, v]) => a + Number(k) * v, 0);
  return {
    totalInstalls,
    activeLast7d,
    totalSessions,
    totalSwitches: sum("totalSwitches"),
    totalActiveSeconds,
    avgWorkspaceCount: totalInstalls ? sum("workspaceCount") / totalInstalls : 0,
    avgDaysSinceFirstLaunch: totalInstalls ? sum("daysSinceFirstLaunch") / totalInstalls : 0,
    avgSessionSeconds: totalSessions ? totalActiveSeconds / totalSessions : 0,
    avgSwitchesPerSession: totalSessions ? sum("totalSwitches") / totalSessions : 0,
    licensedCount,
    conversionRate: totalInstalls ? licensedCount / totalInstalls : 0,
    ratings,          // { "5": n, "4": n, ... }
    ratedCount,
    avgRating: ratedCount ? ratingSum / ratedCount : 0,
    byVersion,
    byOS,
    sourceAdoption,   // installs using each source kind
    triggerAdoption,  // installs using each trigger kind
    presetAdoption,   // installs using each preset
  };
}
