import { NextResponse } from "next/server";
import { signLicense } from "@/lib/fadeo-license";
import { sendLicenseEmail } from "@/lib/send-license-email";

// Gumroad's Ping (Settings -> Advanced -> Ping URL) posts form-encoded data on every
// sale, with no cryptographic signature -- unlike Stripe, anyone who guesses this URL
// could POST a fake payload. So the sale_id is only a lookup key: the real payload comes
// from calling Gumroad's own API back with our access token, which only Gumroad and we
// can produce a valid answer for.
export async function POST(request) {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "Gumroad isn't configured yet." }, { status: 503 });
  }

  const form = await request.formData();
  const saleId = form.get("sale_id");
  if (!saleId || typeof saleId !== "string") {
    return NextResponse.json({ error: "Missing sale_id" }, { status: 400 });
  }

  const verifyRes = await fetch(
    `https://api.gumroad.com/v2/sales/${encodeURIComponent(saleId)}?access_token=${encodeURIComponent(accessToken)}`
  );
  const verifyData = await verifyRes.json().catch(() => null);
  if (!verifyRes.ok || !verifyData?.success || !verifyData.sale) {
    return NextResponse.json({ error: "Could not verify sale" }, { status: 400 });
  }

  const sale = verifyData.sale;
  if (sale.refunded || sale.disputed || sale.chargebacked) {
    return NextResponse.json({ received: true, skipped: "refunded_or_disputed" });
  }

  const email = sale.email;
  const amount = sale.price != null ? (sale.price / 100).toFixed(2) : null;

  if (email) {
    try {
      const { key } = signLicense({ note: `gumroad-${saleId}` });
      await sendLicenseEmail({ to: email, key, amount });
    } catch (err) {
      // Payment already succeeded on Gumroad's side; a delivery failure here needs
      // manual follow-up (buyer can reply to the confirmation email or use the app's
      // feedback link), not a failed response that makes Gumroad retry indefinitely.
      console.error("Failed to issue/send license after Gumroad sale:", saleId, err);
    }
  }

  return NextResponse.json({ received: true });
}
