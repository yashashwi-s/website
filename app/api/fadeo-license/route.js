import { NextResponse } from "next/server";
import { signLicense } from "@/lib/fadeo-license";
import { promoState, claimSlot, releaseSlot, kvConfigured, PROMO_MAX_CLAIMS, PROMO_END } from "@/lib/fadeo-promo";

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
