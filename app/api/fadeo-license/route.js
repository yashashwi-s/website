import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { signLicense } from "@/lib/fadeo-license";
import { promoState, claimSlot, releaseSlot, setClaimedCount, kvConfigured, PROMO_MAX_CLAIMS, PROMO_END } from "@/lib/fadeo-promo";

function isAuthorizedAdmin(request) {
  const secret = process.env.ADMIN_SECRET;
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

export async function POST() {
  if (!kvConfigured() || !process.env.FADEO_LICENSE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Giveaway isn't live yet." }, { status: 503 });
  }
  if (Date.now() >= PROMO_END.getTime()) {
    return NextResponse.json({ error: "This giveaway has ended." }, { status: 410 });
  }

  // Atomic increment: reserves a slot before signing, so concurrent requests near the cap
  // can't both succeed. If we overshoot, back off immediately and don't mint a key.
  const claimNumber = await claimSlot();
  if (claimNumber > PROMO_MAX_CLAIMS) {
    return NextResponse.json({ error: "All free licenses have been claimed." }, { status: 410 });
  }

  try {
    const { key } = signLicense({ note: `promo-${claimNumber}` });
    return NextResponse.json({ key, claimNumber, max: PROMO_MAX_CLAIMS });
  } catch {
    await releaseSlot(); // signing failed, give the slot back
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 500 });
  }
}

// Admin-only: force the claimed count to an exact value, e.g. undoing test claims made
// while setting things up. Requires x-admin-secret to match ADMIN_SECRET, compared in
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
