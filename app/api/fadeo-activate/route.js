import { NextResponse } from "next/server";
import { verifyLicense } from "@/lib/fadeo-license";
import { markActivated, kvConfigured } from "@/lib/fadeo-promo";

// Called once by the app when a user activates a license (LicenseManager). Anonymous: the
// body is just the key itself, which the app already holds; we verify its Ed25519 signature
// server-side and record only its id, so the reclaim sweep leaves an activated key's slot
// alone. No email, no usage, no personal data. A key that fails verification is silently a
// no-op (still 200) so a bad paste never surfaces an error to the user mid-activation.
export async function POST(request) {
  if (!kvConfigured()) {
    return NextResponse.json({ ok: true }); // nothing to record against; treat as a no-op
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const payload = verifyLicense(body?.key);
  // Only promo keys carry mustActivateBy and are subject to reclaim; a verified paid key has
  // no slot to protect, so recording it is unnecessary (and harmless if it happens).
  if (payload?.id && payload.mustActivateBy) {
    try { await markActivated(payload.id); } catch { /* best-effort */ }
  }
  return NextResponse.json({ ok: true });
}
