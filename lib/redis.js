import Redis from "ioredis";

export function redisConfigured() {
  return Boolean(process.env.REDIS_URL);
}

// One connection per invocation, closed when done. At this traffic volume there's no
// benefit to pooling, and an explicitly closed connection means the serverless function
// returns promptly instead of waiting on a lingering socket.
export async function withRedis(fn) {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  const client = new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 5000, lazyConnect: false });
  // ioredis emits 'error' on connection trouble; with no listener Node treats it as an
  // unhandled 'error' event and crashes the whole invocation. Swallow it here so an
  // unreachable Redis surfaces as a rejected command that callers can catch (and fail
  // open on) instead of taking the request down.
  client.on("error", () => {});
  try {
    return await fn(client);
  } finally {
    client.disconnect();
  }
}

// Webhooks are "at least once", never "exactly once" -- every provider (Gumroad,
// Stripe, ...) can and does retry a delivery if it doesn't get a fast enough response.
// Call this with a key unique to the event (e.g. `gumroad:sale:<sale_id>`) before doing
// anything with side effects (issuing a license, sending an email). Returns true only
// the first time a given key is seen; a retried delivery gets false and should no-op.
export async function claimOnce(key, ttlSeconds = 60 * 60 * 24 * 7) {
  return withRedis(async (r) => {
    const result = await r.set(key, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  });
}
