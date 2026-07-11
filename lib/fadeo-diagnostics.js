import { withRedis, redisConfigured } from "@/lib/redis";

export const diagnosticsConfigured = redisConfigured;

const INSTALLS_SET_KEY = "fadeo:diag:installs";
const installKey = (installID) => `fadeo:diag:install:${installID}`;

// Coarse, anonymous, opt-in only (see Fadeo's PLAN.md #13a and DiagnosticsUploader.swift).
// One row per installID, always overwritten in place: the app sends its current running
// totals at most once a day, so the latest submission already IS the full picture for
// that install -- there's no time-series to keep, just current state per install.
function validate(body) {
  if (typeof body !== "object" || body === null) return null;
  const { installID, daysSinceFirstLaunch, sessionCount, workspaceCount, totalSwitches, totalActiveSeconds, appVersion, osVersion } = body;
  if (typeof installID !== "string" || installID.length < 8 || installID.length > 64) return null;
  const nums = { daysSinceFirstLaunch, sessionCount, workspaceCount, totalSwitches, totalActiveSeconds };
  for (const v of Object.values(nums)) {
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return null;
  }
  return {
    installID,
    daysSinceFirstLaunch: Math.floor(daysSinceFirstLaunch),
    sessionCount: Math.floor(sessionCount),
    workspaceCount: Math.floor(workspaceCount),
    totalSwitches: Math.floor(totalSwitches),
    totalActiveSeconds,
    appVersion: typeof appVersion === "string" ? appVersion.slice(0, 32) : "unknown",
    osVersion: typeof osVersion === "string" ? osVersion.slice(0, 64) : "unknown",
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
  const sum = (f) => rows.reduce((acc, r) => acc + r[f], 0);
  const activeLast7d = rows.filter((r) => {
    const ageMs = Date.now() - new Date(r.submittedAt).getTime();
    return ageMs <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const byVersion = {};
  const byOS = {};
  for (const r of rows) {
    byVersion[r.appVersion] = (byVersion[r.appVersion] ?? 0) + 1;
    byOS[r.osVersion] = (byOS[r.osVersion] ?? 0) + 1;
  }
  return {
    totalInstalls,
    activeLast7d,
    totalSessions: sum("sessionCount"),
    totalSwitches: sum("totalSwitches"),
    totalActiveSeconds: sum("totalActiveSeconds"),
    avgWorkspaceCount: totalInstalls ? sum("workspaceCount") / totalInstalls : 0,
    avgDaysSinceFirstLaunch: totalInstalls ? sum("daysSinceFirstLaunch") / totalInstalls : 0,
    byVersion,
    byOS,
  };
}
