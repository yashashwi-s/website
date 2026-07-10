import { NextResponse } from "next/server";
import { signLicense } from "@/lib/fadeo-license";
import { promoState, redis, kvConfigured, PROMO_MAX_CLAIMS, PROMO_END, KV_COUNT_KEY } from "@/lib/fadeo-promo";

export async function GET(request) {
  const state = await promoState();
  const debug = new URL(request.url).searchParams.get("debug");
  if (debug === "1") {
    // Boolean-only presence check, no values, to pin down env var naming mismatches
    // without exposing anything sensitive.
    state.env = {
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
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
  const kv = redis();
  const claimNumber = await kv.incr(KV_COUNT_KEY);
  if (claimNumber > PROMO_MAX_CLAIMS) {
    return NextResponse.json({ error: "All free licenses have been claimed." }, { status: 410 });
  }

  try {
    const { key } = signLicense({ note: `promo-${claimNumber}` });
    return NextResponse.json({ key, claimNumber, max: PROMO_MAX_CLAIMS });
  } catch {
    await kv.decr(KV_COUNT_KEY); // signing failed, give the slot back
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 500 });
  }
}
