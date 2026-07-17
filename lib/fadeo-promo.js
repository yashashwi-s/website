import { withRedis, redisConfigured } from "@/lib/redis";

// The whole giveaway is gated by these two lines. Whichever limit hits first ends it.
// To kill it early: set PROMO_MAX_CLAIMS to 0 and redeploy. Nothing else to touch.
export const PROMO_MAX_CLAIMS = 100;
export const PROMO_END = new Date("2026-09-01T00:00:00Z");

export const KV_COUNT_KEY = "fadeo:promo:claimed";
// Reclaim bookkeeping: which keys were issued, which pinged activation, which have already
// been reclaimed. A promo key never activated within its 7-day window frees its slot back
// into the pool.
const ISSUED_KEY = "fadeo:promo:issued";
const ACTIVATED_KEY = "fadeo:promo:activated";
const RECLAIMED_KEY = "fadeo:promo:reclaimed";
const SWEEP_LOCK_KEY = "fadeo:promo:sweeplock";

export const kvConfigured = redisConfigured;

// Frees the live-claim slots of promo keys never activated within their 7-day window.
// Idempotent per key: SADD to the reclaimed set returns 1 only the first time, so a key
// decrements the counter at most once even under concurrent sweeps. Throttled to at most
// once per 5 minutes across all callers via an NX/EX lock, so running it on every
// promoState read stays cheap (and never below 0).
async function sweepReclaim(r) {
  if ((await r.set(SWEEP_LOCK_KEY, "1", "EX", 300, "NX")) !== "OK") return;
  const issued = await r.hgetall(ISSUED_KEY);
  const now = Date.now();
  for (const [id, raw] of Object.entries(issued || {})) {
    let meta;
    try { meta = JSON.parse(raw); } catch { continue; }
    if (!meta.mustActivateBy || now < new Date(meta.mustActivateBy).getTime()) continue;
    if (await r.sismember(ACTIVATED_KEY, id)) continue;
    if ((await r.sadd(RECLAIMED_KEY, id)) === 1) {
      const after = await r.decr(KV_COUNT_KEY);
      if (after < 0) await r.set(KV_COUNT_KEY, "0");
    }
  }
}

export async function promoState() {
  const expired = Date.now() >= PROMO_END.getTime();
  const claimed = kvConfigured()
    ? await withRedis(async (r) => {
        try { await sweepReclaim(r); } catch { /* reclaim is best-effort, never block the read */ }
        return Number((await r.get(KV_COUNT_KEY)) ?? 0);
      })
    : null;
  const soldOut = claimed !== null && claimed >= PROMO_MAX_CLAIMS;
  return {
    active: kvConfigured() && !expired && !soldOut,
    claimed,
    max: PROMO_MAX_CLAIMS,
    endsAt: PROMO_END.toISOString(),
  };
}

// Called right after a promo key is signed, so the reclaim sweep knows this key exists and
// when it must be activated by.
export async function recordIssued({ id, claimNumber, mustActivateBy }) {
  if (!id) return;
  const value = JSON.stringify({
    claimNumber: claimNumber ?? null,
    mustActivateBy: mustActivateBy instanceof Date ? mustActivateBy.toISOString() : (mustActivateBy ?? null),
    issuedAt: new Date().toISOString(),
  });
  return withRedis((r) => r.hset(ISSUED_KEY, id, value));
}

// Called by the activation endpoint when the app confirms a real key was activated, so the
// sweep leaves its slot claimed.
export async function markActivated(id) {
  if (!id) return;
  return withRedis((r) => r.sadd(ACTIVATED_KEY, id));
}

// Atomically reserves the next slot, returning its 1-based number.
export async function claimSlot() {
  return withRedis((r) => r.incr(KV_COUNT_KEY));
}

// Gives a slot back (signing failed after the slot was reserved).
export async function releaseSlot() {
  return withRedis((r) => r.decr(KV_COUNT_KEY));
}

// Admin-only: force the counter to an exact value (e.g. undo a test claim before
// launch). Gated by ADMIN_KEY at the route level, not here.
export async function setClaimedCount(value) {
  return withRedis((r) => r.set(KV_COUNT_KEY, String(value)));
}
