import { withRedis, redisConfigured } from "@/lib/redis";

export const subscribersConfigured = redisConfigured;

// Newsletter / "email me updates" list. A visitor who wants to hear about new Fadeo
// releases leaves their address (SubscribeBand in fadeo-client). Stored as a Redis hash
// keyed by lowercased email so re-submitting the same address is a no-op dedupe rather
// than a duplicate row. This is a plain contact list, never tied to a license or an
// install's usage; the diagnostics dashboard just reads it back so I can reach people.
const SUBSCRIBERS_KEY = "fadeo:subscribers";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(email) {
  if (typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 254 || !EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

// Returns { ok, created } -- created is false when the address was already on the list
// (still a success from the visitor's side, just nothing new stored). hsetnx keeps the
// original subscribedAt on a re-submit and is atomic under concurrent requests.
export async function addSubscriber(email, source = "site") {
  const clean = normalize(email);
  if (!clean) return { ok: false };
  return withRedis(async (r) => {
    const created = await r.hsetnx(
      SUBSCRIBERS_KEY,
      clean,
      JSON.stringify({ subscribedAt: new Date().toISOString(), source: String(source).slice(0, 32) })
    );
    return { ok: true, created: created === 1 };
  });
}

export async function allSubscribers() {
  return withRedis(async (r) => {
    const map = await r.hgetall(SUBSCRIBERS_KEY);
    return Object.entries(map || {})
      .map(([email, raw]) => {
        let meta = {};
        try { meta = JSON.parse(raw); } catch { /* tolerate a legacy/plain value */ }
        return { email, subscribedAt: meta.subscribedAt || null, source: meta.source || null };
      })
      .sort((a, b) => (b.subscribedAt || "").localeCompare(a.subscribedAt || ""));
  });
}
