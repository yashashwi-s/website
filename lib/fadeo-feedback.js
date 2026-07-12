import { withRedis, redisConfigured } from "@/lib/redis";

export const feedbackConfigured = redisConfigured;

const FEEDBACK_LIST_KEY = "fadeo:feedback:list";
const MAX_KEEP = 500;

// Anonymous in-app rating + written feedback (see Fadeo's Feedback.swift). Carries the same
// random installID as the usage diagnostics so a comment can be tied to that install's usage
// shape, with no personal data. Newest first; capped so the list can't grow unbounded.
function validate(body) {
  if (typeof body !== "object" || body === null) return null;
  const { installID, text } = body;
  if (typeof installID !== "string" || installID.length < 8 || installID.length > 64) return null;
  const rating = Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null;
  const cleanText = typeof text === "string" ? text.trim().slice(0, 2000) : "";
  if (!cleanText && rating == null) return null; // nothing worth storing
  return {
    installID,
    rating,
    text: cleanText,
    appVersion: typeof body.appVersion === "string" ? body.appVersion.slice(0, 32) : "unknown",
    osVersion: typeof body.osVersion === "string" ? body.osVersion.slice(0, 64) : "unknown",
    submittedAt: new Date().toISOString(),
  };
}

export async function submitFeedback(body) {
  const record = validate(body);
  if (!record) return null;
  await withRedis(async (r) => {
    await r.lpush(FEEDBACK_LIST_KEY, JSON.stringify(record));
    await r.ltrim(FEEDBACK_LIST_KEY, 0, MAX_KEEP - 1);
  });
  return record;
}

export async function allFeedback() {
  return withRedis(async (r) => {
    const items = await r.lrange(FEEDBACK_LIST_KEY, 0, -1);
    return items
      .map((s) => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean);
  });
}
