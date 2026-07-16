import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { subscribersConfigured, addSubscriber, allSubscribers } from "@/lib/fadeo-subscribers";

function isAuthorizedAdmin(request) {
  const secret = process.env.ADMIN_KEY;
  const provided = request.headers.get("x-admin-secret");
  if (!secret || !provided) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Public: a visitor leaves their email to hear about updates (SubscribeBand). Anonymous,
// no license or install tie-in. Idempotent -- re-subscribing the same address is fine.
export async function POST(request) {
  if (!subscribersConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const result = await addSubscriber(body?.email, body?.source);
  if (!result.ok) {
    return NextResponse.json({ error: "That doesn't look like a valid email." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// Admin-only: the subscriber list, for the diagnostics dashboard so I can actually reach
// these people later.
export async function GET(request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!subscribersConfigured()) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  const subscribers = await allSubscribers();
  return NextResponse.json({ subscribers });
}
