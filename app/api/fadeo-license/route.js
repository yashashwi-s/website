import { NextResponse } from "next/server";
import { signLicense } from "@/lib/fadeo-license";
import { promoState, redis, kvConfigured, PROMO_MAX_CLAIMS, PROMO_END, KV_COUNT_KEY } from "@/lib/fadeo-promo";

export async function GET() {
  const state = await promoState();
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
