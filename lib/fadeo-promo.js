import { withRedis, redisConfigured } from "@/lib/redis";

// The whole giveaway is gated by these two lines. Whichever limit hits first ends it.
// To kill it early: set PROMO_MAX_CLAIMS to 0 and redeploy. Nothing else to touch.
export const PROMO_MAX_CLAIMS = 100;
export const PROMO_END = new Date("2026-09-01T00:00:00Z");

export const KV_COUNT_KEY = "fadeo:promo:claimed";

export const kvConfigured = redisConfigured;

export async function promoState() {
  const expired = Date.now() >= PROMO_END.getTime();
  const claimed = kvConfigured()
    ? await withRedis(async (r) => Number((await r.get(KV_COUNT_KEY)) ?? 0))
    : null;
  const soldOut = claimed !== null && claimed >= PROMO_MAX_CLAIMS;
  return {
    active: kvConfigured() && !expired && !soldOut,
    claimed,
    max: PROMO_MAX_CLAIMS,
    endsAt: PROMO_END.toISOString(),
  };
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
// launch). Gated by ADMIN_SECRET at the route level, not here.
export async function setClaimedCount(value) {
  return withRedis((r) => r.set(KV_COUNT_KEY, String(value)));
}
