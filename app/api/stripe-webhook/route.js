import { NextResponse } from "next/server";
import Stripe from "stripe";
import { signLicense } from "@/lib/fadeo-license";
import { sendLicenseEmail } from "@/lib/send-license-email";
import { claimOnce } from "@/lib/redis";

// Fires on every completed Stripe Checkout session for the Fadeo Payment Link. Mints a
// real Ed25519-signed license (same signer as the giveaway and the offline generator
// script) and emails it. Pay-what-you-want is configured entirely in the Stripe
// dashboard (Payment Link -> "customer chooses price" with a minimum) -- nothing about
// the amount is enforced here, Stripe already collected it before this fires.
export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !stripeSecretKey) {
    return NextResponse.json({ error: "Stripe isn't configured yet." }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const amount = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : null;

    // Stripe retries on a slow/failed response same as Gumroad; claim the event id
    // before doing anything so a retry is a safe no-op instead of a duplicate email.
    const firstTime = await claimOnce(`stripe:event:${event.id}`);

    if (email && firstTime) {
      try {
        const { key } = signLicense({ note: `stripe-${session.id}` });
        await sendLicenseEmail({ to: email, key, amount });
      } catch (err) {
        // Stripe already has the payment; a delivery failure here needs manual
        // follow-up (the customer can always reply to their receipt or use the About
        // pane's feedback link), not a failed webhook response that triggers retries
        // and re-sends of an already-completed payment's email.
        console.error("Failed to issue/send license after Stripe payment:", session.id, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
