import Redis from "ioredis";

// The whole giveaway is gated by these two lines. Whichever limit hits first ends it.
// To kill it early: set PROMO_MAX_CLAIMS to 0 and redeploy. Nothing else to touch.
export const PROMO_MAX_CLAIMS = 100;
export const PROMO_END = new Date("2026-09-01T00:00:00Z");

export const KV_COUNT_KEY = "fadeo:promo:claimed";

export function kvConfigured() {
  return Boolean(process.env.REDIS_URL);
}

// One connection per invocation, closed when done. At this traffic volume (a capped
// 100-claim giveaway plus occasional Stripe webhooks) there's no benefit to pooling,
// and an explicitly closed connection means the serverless function returns promptly
// instead of waiting on a lingering socket.
async function withRedis(fn) {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  const client = new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 5000, lazyConnect: false });
  try {
    return await fn(client);
  } finally {
    client.disconnect();
  }
}

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
