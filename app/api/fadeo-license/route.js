import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { signLicense } from "@/lib/fadeo-license";
import { sendLicenseEmail } from "@/lib/send-license-email";
import { promoState, claimSlot, releaseSlot, setClaimedCount, recordIssued, kvConfigured, PROMO_MAX_CLAIMS, PROMO_END } from "@/lib/fadeo-promo";
import { withRedis } from "@/lib/redis";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTIVATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
// Cheap friction so a single client can't script the whole 100-key pool away. Generous
// enough that a real person (and a couple of retries, or a small shared office IP) never
// hits it. Fails OPEN: any Redis hiccup skips the check rather than blocking a claim.
const PROMO_IP_DAILY_CAP = 5;

async function overIpCap(request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (!ip) return false; // can't identify the caller, don't block
    return await withRedis(async (r) => {
      const key = `fadeo:promo:ip:${ip}`;
      const n = await r.incr(key);
      if (n === 1) await r.expire(key, 24 * 60 * 60);
      return n > PROMO_IP_DAILY_CAP;
    });
  } catch {
    return false;
  }
}

function isAuthorizedAdmin(request) {
  const secret = process.env.ADMIN_KEY;
  const provided = request.headers.get("x-admin-secret");
  if (!secret || !provided) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(provided);
  // timingSafeEqual throws on length mismatch rather than returning false, and length
  // itself is safe to leak (it's not part of the secret), so check that first.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(request) {
  const state = await promoState();
  const debug = new URL(request.url).searchParams.get("debug");
  if (debug === "1") {
    // Boolean-only presence check, no values, to pin down env var naming mismatches
    // without exposing anything sensitive.
    state.env = {
      REDIS_URL: Boolean(process.env.REDIS_URL),
      FADEO_LICENSE_PRIVATE_KEY: Boolean(process.env.FADEO_LICENSE_PRIVATE_KEY),
    };
  }
  return NextResponse.json(state);
}

export async function POST(request) {
  if (!kvConfigured() || !process.env.FADEO_LICENSE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Giveaway isn't live yet." }, { status: 503 });
  }
  if (Date.now() >= PROMO_END.getTime()) {
    return NextResponse.json({ error: "This giveaway has ended." }, { status: 410 });
  }

  // Optional: emailing a copy is a convenience on top of the on-screen key, never a
  // requirement to claim (the giveaway's whole pitch is "no card, no email").
  let email = null;
  try {
    const body = await request.json();
    if (typeof body?.email === "string" && EMAIL_RE.test(body.email.trim())) {
      email = body.email.trim();
    }
  } catch {
    // No body (or not JSON) is the normal case for the plain "claim" click -- fine.
  }

  if (await overIpCap(request)) {
    return NextResponse.json(
      { error: "You've claimed a few already today. If you need another, email fadeo.puremac@gmail.com." },
      { status: 429 }
    );
  }

  // Atomic increment: reserves a slot before signing, so concurrent requests near the cap
  // can't both succeed. If we overshoot, back off immediately and don't mint a key.
  const claimNumber = await claimSlot();
  if (claimNumber > PROMO_MAX_CLAIMS) {
    return NextResponse.json({ error: "All free licenses have been claimed." }, { status: 410 });
  }

  try {
    const mustActivateBy = new Date(Date.now() + ACTIVATE_WINDOW_MS);
    const { key, id } = signLicense({ note: `promo-${claimNumber}`, mustActivateBy });
    // Track the issued key so the reclaim sweep can free this slot if it's never activated.
    // Best-effort: a bookkeeping failure must not fail an otherwise-valid claim.
    try { await recordIssued({ id, claimNumber, mustActivateBy }); } catch { /* non-fatal */ }
    let emailed = false;
    if (email) {
      try {
        await sendLicenseEmail({ to: email, key, mustActivateBy });
        emailed = true;
      } catch {
        // Key is already reserved and valid on-screen; a mail-send failure shouldn't
        // fail the claim itself, just silently skip the "we also emailed it" confirmation.
      }
    }
    return NextResponse.json({ key, claimNumber, max: PROMO_MAX_CLAIMS, mustActivateBy: mustActivateBy.toISOString(), emailed });
  } catch {
    await releaseSlot(); // signing failed, give the slot back
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 500 });
  }
}

// Admin-only: force the claimed count to an exact value, e.g. undoing test claims made
// while setting things up. Requires x-admin-secret to match ADMIN_KEY, compared in
// constant time so timing can't leak how much of a guess matched.
export async function DELETE(request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const value = Number(new URL(request.url).searchParams.get("count") ?? "0");
  if (!Number.isInteger(value) || value < 0) {
    return NextResponse.json({ error: "count must be a non-negative integer" }, { status: 400 });
  }
  await setClaimedCount(value);
  return NextResponse.json({ claimed: value });
}
