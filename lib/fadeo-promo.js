import { Redis } from "@upstash/redis";

// The whole giveaway is gated by these two lines. Whichever limit hits first ends it.
// To kill it early: set PROMO_MAX_CLAIMS to 0 and redeploy. Nothing else to touch.
export const PROMO_MAX_CLAIMS = 100;
export const PROMO_END = new Date("2026-09-01T00:00:00Z");

export const KV_COUNT_KEY = "fadeo:promo:claimed";

export function kvConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function redis() {
  return Redis.fromEnv();
}

export async function promoState() {
  const expired = Date.now() >= PROMO_END.getTime();
  const claimed = kvConfigured() ? Number((await redis().get(KV_COUNT_KEY)) ?? 0) : null;
  const soldOut = claimed !== null && claimed >= PROMO_MAX_CLAIMS;
  return {
    active: kvConfigured() && !expired && !soldOut,
    claimed,
    max: PROMO_MAX_CLAIMS,
    endsAt: PROMO_END.toISOString(),
  };
}
